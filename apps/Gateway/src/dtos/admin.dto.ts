import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class AdminModel {
  @ApiProperty({ type: String, required: false })
  id?: string;
  @ApiProperty({ type: String, required: false })
  email?: string;
  @ApiProperty({ type: String, required: false })
  name?: string;
  password?: string;
  salt?: string;
  @ApiProperty({ type: Boolean, required: false })
  isDefault?: boolean;
  @ApiProperty({ type: Boolean, required: false })
  isActive?: boolean;
  @ApiProperty({ type: Date, required: false })
  createdAt?: Date;
  @ApiProperty({ type: Date, required: false })
  updatedAt?: Date;
}
export class AdminSessionModel {
  @ApiProperty({ type: String, required: false })
  id?: string;
  @ApiProperty({ type: String, required: false })
  adminId?: string;
  @ApiProperty({ type: Date, required: false })
  refreshExpiresAt?: Date;
  @ApiProperty({ type: Date, required: false })
  createdAt?: Date;
  @ApiProperty({ type: Date, required: false })
  updatedAt?: Date;
}

export class AdminSignInInputDto {
  @ApiProperty({ type: String, required: true, example: 'root@originsnework.com' })
  @IsString()
  @IsEmail()
  email!: string;
  @ApiProperty({ type: String, required: true, example: 'Root@panel123!' })
  @IsString()
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[(#?!@$%^&*-_)]).{7,33}$/,
    {
      message:
        'Password must be between 8 to 32 English characters, numbers, or symbols and it must contains at least one uppercase letter, one number, and one of (#?!@$%^&*-_) symbols',
    },
  )
  password!: string;
}

export class GetProfileOutputDto {
  @ApiProperty({ required: false })
  userType!: 'ADMIN';
}

export class GetAdminProfileOutputDto extends GetProfileOutputDto {
  @ApiProperty({ type: AdminModel, required: false })
  profile?: AdminModel;

  @ApiProperty({ type: AdminSessionModel, required: false })
  session?: AdminSessionModel;
}

export class AdminSignInOutputDto extends GetAdminProfileOutputDto {
  tokenData: any;
}
