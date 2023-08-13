import { User } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class EditUserInterface{
    @IsNotEmpty()
    param: string;

    @IsNotEmpty()
    data: Partial<User>
}

export interface RequestUserInterface{
    user: JWTObject
}

export interface JWTObject{
    email: string;
    sub: number;
    exp: number;
    iat: number;
    role: string;
}
