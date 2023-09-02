import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ICreateQuestion{
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    category_id: number;
}