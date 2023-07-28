import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserInterface } from "interface/CreateUserInterface";

@Controller('auth')

export class AuthController {
    constructor(private authService: AuthService){}

    @Post('test')
    register(@Body() body: CreateUserInterface): CreateUserInterface {
        return this.authService.signup(body);
    }
    
}