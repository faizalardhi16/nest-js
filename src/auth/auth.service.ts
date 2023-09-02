import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthInterface, LoginInterface } from './interface';
import { ResponseInterface } from 'utils/interface/ResponseInterface';
import { objectResponse } from 'utils/objectResponse';
import * as argon from "argon2";
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService){}

    public async signup(body: AuthInterface): Promise<ResponseInterface> {
        try {
            //generate password hash
            const hash = await argon.hash(body.password);

            //save user
            const user = await this.prisma.user.create({
                data:{
                    email: body.email,
                    hash,
                    role: body.role,
                    division: body.division,
                    pc: 1
                },
            });

            delete user.hash;

            const response: ResponseInterface = objectResponse({ 
                status: 'Success', 
                code: 200, 
                message: 'Successfully Signup', 
                data: user 
            });

            return new Promise((resolve) => resolve(response));
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code = 'P2002'){
                    const exc = new ForbiddenException('Credentials Taken')                    
                    return objectResponse({ 
                        status: 'Failed', 
                        code: exc.getStatus(), 
                        message: exc.message, 
                        data: null
                    })
                }
            }

            console.log(`${new Date()} - ${error}`)
            return objectResponse({ 
                status: 'Failed', 
                code: 422, 
                message: 'Unproccessable Entity', 
                data: null
            })
        }
    }

    public async signin(body: LoginInterface): Promise<ResponseInterface>{
        const user = await this.prisma.user.findUnique({
            where:{
                email: body.email
            }
        });

        if(!user){
            const exc = new ForbiddenException("Credentials Incorrect") 
            return objectResponse({ 
                status: 'Failed', 
                code: exc.getStatus(), 
                message: exc.message, 
                data: null
            });
        }

        const pwMatches = await argon.verify(user.hash, body.password);

        if(!pwMatches){
            const exc = new ForbiddenException("Credentials Incorrect") 
            return objectResponse({ 
                status: 'Failed', 
                code: exc.getStatus(), 
                message: exc.message, 
                data: null
            });
        }

        const token = await this.signToken(user.id, user.email, user.role);

        return objectResponse({ 
            status: 'Success', 
            code: 200, 
            message: 'Successfully to login', 
            data: token
        });
    }

    private async signToken(
        userId: number, 
        email: string,
        role: string
    ): Promise<{access_token: string;}>{
        const payload = {
            sub: userId,
            email,
            role
        }

        const secret = process.env.JWT_SECRET || ''

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret
        })

        return{
            access_token: token
        }
    }

}
