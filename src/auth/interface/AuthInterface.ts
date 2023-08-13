import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Division } from "utils/division.enum";
import { Role } from "utils/role.enum";

export class AuthInterface{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    role: Role;

    @IsString()
    @IsNotEmpty()
    division: Division;
}

export class LoginInterface{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}


