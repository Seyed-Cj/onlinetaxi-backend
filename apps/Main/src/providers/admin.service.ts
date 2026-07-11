import {
  HttpStatus,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { PostgresService } from 'src/databases/postgres/postgres.service';
import { RedisService } from 'src/databases/redis/redis.service';
import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvErr,
} from 'src/services/dto';
import { JwtHandler } from 'src/utils/handlers/jwt.handler';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  private logger = new Logger('/providers/admins');
  constructor(
    private readonly pg: PostgresService,
    private readonly utils: UtilsService,
    private readonly jwtService: JwtHandler,
    private readonly redis: RedisService,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    const checkRootUser = await this.pg.models.Admin.findOne({
      where: {
        isDefault: true,
      },
    });
    if (checkRootUser) {
      this.logger.verbose('Initializing', 'Root user already exists');
      return;
    }
    const defaultPassword = 'Root@panel123!';
    const { salt, hash } =
      await this.utils.PasswordHandler.generate(defaultPassword);
    const admin = await this.pg.models.Admin.create({
      email: 'root@originsnework.com',
      name: 'Root Admin',
      isDefault: true,
      isActive: true,
      password: hash,
      salt,
    });

    this.logger.verbose('Initializing', 'Root user has been created');
    return;
  }

  async signin({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const email = query.email.toLowerCase();

    const profile = await this.pg.models.Admin.findOne({
      where: { email },
      nest: true,
      raw: true,
    });
    if (!profile)
      throw new SrvErr(
        HttpStatus.BAD_REQUEST,
        'err_auth_usernameOrPasswordNotValid',
      );

    const password = await this.utils.PasswordHandler.validate(
      query.password,
      profile.salt!,
      profile.password!,
    );
    if (!password) {
      throw new SrvErr(
        HttpStatus.BAD_REQUEST,
        'err_auth_usernameOrPasswordNotValid',
      );
    }

    const newSession = await this.pg.models.AdminSession.create({
      adminId: profile.id,
      refreshExpiresAt: +new Date(),
    });

    const tokenData = this.jwtService.generateAccessToken(
      profile.id,
      'ADMIN',
      newSession.id,
    );

    await newSession.update({
      refreshExpiresAt: tokenData.payload.refreshExpiresAt,
    });

    await newSession.reload();

    const _profile = await this.pg.models.Admin.scope(
      'withoutPassword',
    ).findByPk(profile.id, {
      raw: true,
    });

    return {
      data: {
        profile: _profile,
        session: newSession,
        isActive: _profile!.isActive,
        tokenData,
      },
    };
  }

  async authorize({
    query: { token },
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    let isAuthorized = false;
    let clearCookie: string | null = 'online-taxi_auth_admin';

    let tokenData;
    let admin;
    let session;

    const decodedToken = this.jwtService.decodeAccessToken(token);

    if (decodedToken) {
      const adminId = decodedToken.accountId;

      admin = await this.getAdminById(adminId);

      if (admin) {
        session = await this.getSessionById(decodedToken.sessionId);
        const now = Date.now();

        if (decodedToken.refreshExpiresAt <= now) {
          await this.pg.models.AdminSession.destroy({
            where: { id: decodedToken.sessionId },
          });

          await this.redis.cacheCli.del(
            `adminSession_${decodedToken.sessionId}`,
          );
        } else if (decodedToken.accessExpiresAt <= now) {
          if (session) {
            tokenData = this.jwtService.generateAccessToken(
              adminId,
              'ADMIN',
              session.id,
            );

            session = await this.extendSession(
              session.id,
              tokenData.payload.refreshExpiresAt,
            );

            isAuthorized = true;
          }
        } else {
          if (session) {
            isAuthorized = true;
          }
        }
      }
    }

    if (isAuthorized) {
      clearCookie = null;
    }

    return {
      data: {
        isAuthorized,
        admin,
        session,
        tokenData,
        clearCookie,
        isActive: admin?.isActive ?? null,
      },
    };
  }

  private async getAdminById(id: string) {
    let admin = null;
    let _admin: any = await this.redis.cacheCli.get(`admin_${id}`);

    if (!_admin) {
      _admin = await this.pg.models.Admin.findByPk(id);
      if (!_admin) return null;

      _admin = JSON.parse(JSON.stringify(_admin));

      await this.redis.cacheCli.set(
        `admin_${_admin.id}`,
        JSON.stringify(_admin),
        'EX',
        900,
      );

      admin = _admin;
    } else {
      admin = JSON.parse(_admin);
    }

    return admin;
  }
  private async getSessionById(id: string) {
    let session = null;
    let _session: any = await this.redis.cacheCli.get(`adminSession_${id}`);

    if (!_session) {
      _session = await this.pg.models.AdminSession.findByPk(id);

      if (!_session) {
        return null;
      }

      await this.redis.cacheCli.set(
        `adminSession_${_session.id}`,
        JSON.stringify(_session),
        'EX',
        900,
      );

      session = _session;
    } else {
      session = JSON.parse(_session);
    }

    return session;
  }
  private async extendSession(
    id: string,
    refreshExpiresAt: number,
  ): Promise<any> {
    const updated = await this.pg.models.AdminSession.update(
      { refreshExpiresAt },
      {
        where: { id },
        returning: true,
      },
    );

    const session = updated[0] ? updated[1][0] : null;

    if (session) {
      await this.redis.cacheCli.set(
        `adminSession_${session.id}`,
        JSON.stringify(session),
        'EX',
        900,
      );
    }

    return session;
  }
}
