import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateTripInputDto {
  @ApiProperty({ example: 1204.3245 })
  @IsNumber()
  @IsNotEmpty()
  originLat!: number;

  @ApiProperty({ example: 1534.4573 })
  @IsNumber()
  @IsNotEmpty()
  originLng!: number;

  @ApiProperty({ example: 1234.8765 })
  @IsNumber()
  @IsNotEmpty()
  destinationLat!: number;

  @ApiProperty({ example: 1544.3563 })
  @IsNumber()
  @IsNotEmpty()
  destinationLng!: number;
}