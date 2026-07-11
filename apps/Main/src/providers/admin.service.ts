import { HttpStatus, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PostgresService } from 'src/databases/postgres/postgres.service';
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
    if (!password)
      throw new SrvErr(
        HttpStatus.BAD_REQUEST,
        'err_auth_usernameOrPasswordNotValid',
      );

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
}
