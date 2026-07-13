import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class PassengerModel {
  @ApiProperty({ type: String, required: false })
  id?: string;

  @ApiProperty({ type: String, required: true })
  phone!: string;

  @ApiProperty({ type: String, required: false })
  email?: string;

  @ApiProperty({ type: String, required: false })
  password?: string;

  @ApiProperty({ type: String, required: false })
  firstName?: string;

  @ApiProperty({ type: String, required: false })
  lastName?: string;

  @ApiProperty({ type: Boolean, required: false })
  isActive?: boolean;

  @ApiProperty({ type: Boolean, required: false })
  isVerified?: boolean;

  @ApiProperty({ type: Date, required: false })
  createdAt?: Date;

  @ApiProperty({ type: Date, required: false })
  updatedAt?: Date;
}

export class PassengerSessionModel {
  @ApiProperty({ type: String, required: false })
  id?: string;

  @ApiProperty({ type: String, required: false })
  passengerId?: string;

  @ApiProperty({ type: Date, required: false })
  refreshExpiresAt?: Date;

  @ApiProperty({ type: Date, required: false })
  createdAt?: Date;

  @ApiProperty({ type: Date, required: false })
  updatedAt?: Date;
}

export class PassengerRequestOtpInputDto {
  @ApiProperty({
    type: String,
    required: true,
    example: '+989123456789',
    description: 'Passenger phone number',
  })
  @IsPhoneNumber('IR', { message: 'شماره تلفن معتبر وارد کنید' })
  phone!: string;
}

export class PassengerVerifyOtpInputDto {
  @ApiProperty({
    type: String,
    required: true,
    example: '+989123456789',
    description: 'Passenger phone number',
  })
  @IsPhoneNumber('IR', { message: 'شماره تلفن معتبر وارد کنید' })
  phone!: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  otp!: string;
}
