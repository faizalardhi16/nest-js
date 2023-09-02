import { IsNotEmpty, IsString } from "class-validator";

export class ICreateCategory{
    @IsNotEmpty()
    @IsString()
    title: string

}