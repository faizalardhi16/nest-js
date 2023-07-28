/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateAfilasiClass {
    @IsNotEmpty()
    @IsString()
    afilate: string;

    @IsNotEmpty()
    @IsNumber()
    id: number;
}