import { Body, Injectable } from "@nestjs/common";
import { CreateUserInterface } from "src/interface/CreateUserInterface";

@Injectable()

export class AuthService {
    signup(@Body() body: CreateUserInterface): CreateUserInterface {
        return body
    }
}