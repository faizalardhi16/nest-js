import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InterviewRequestProp{
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsNumber()
    user_id: number
}