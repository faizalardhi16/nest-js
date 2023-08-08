import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInterface } from './interface';
import { ResponseInterface } from 'utils/interface/ResponseInterface';

@Controller('auth')
export class AuthController {
    private readonly authService: AuthService;

    constructor(service: AuthService){
        this.authService = service;
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    registerUser(@Body() body: AuthInterface): Promise<ResponseInterface>{
        return this.authService.signup(body);
    }
}
