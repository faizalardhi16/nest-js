import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInterface, LoginInterface } from './interface';
import { ResponseInterface } from 'utils/interface/ResponseInterface';

@Controller({
    path: 'auth',
    version: ['1']
})
export class AuthController {
    private readonly authService: AuthService;

    constructor(service: AuthService){
        this.authService = service;
    }

    // @Roles(Role.ADMIN)
    @Post('signup')
    @HttpCode(HttpStatus.OK)
    public async registerUser(@Body() body: AuthInterface): Promise<ResponseInterface>{
        return this.authService.signup(body);
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    public async loginUser(@Body() body: LoginInterface): Promise<ResponseInterface>{
        return this.authService.signin(body);
    }
}
