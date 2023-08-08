import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthInterface } from './interface';
import { ResponseInterface } from 'utils/interface/ResponseInterface';
import { objectResponse } from 'utils/objectResponse';
import * as argon from "argon2";
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}

    async signup(body: AuthInterface): Promise<ResponseInterface> {
        try {
            //generate password hash
            const hash = await argon.hash(body.password);

            //save user
            const user = await this.prisma.user.create({
                data:{
                    email: body.email,
                    hash
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
            console.log(`error log ${error}`)
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
            return objectResponse({ 
                status: 'Failed', 
                code: 422, 
                message: 'Unproccessable Entity', 
                data: null
            })
        }
    }

    async signin(body: AuthInterface): Promise<ResponseInterface>{
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

        delete user.hash

        return objectResponse({ 
            status: 'Success', 
            code: 200, 
            message: 'Successfully to login', 
            data: user
        });
    }

    // async updateUser(body: Partial<AuthInterface>): Promise<ResponseInterface>{
    //     const user = await this.prisma.user.update({ data: {}, where: {id: body.id}})

    //     return objectResponse({ status: 'Success', code: 200, message: 'Successfully Update User', data: user})
    // }
}
