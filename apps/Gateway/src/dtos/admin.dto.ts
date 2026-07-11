import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class AdminSignInInputDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'root@originsnework.com',
  })
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({ type: String, required: true, example: 'Root@panel123!' })
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*\-_]).{7,33}$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character.',
  })
  password?: string;
}
