import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseInterface } from 'utils/interface/ResponseInterface';
import { objectResponse } from 'utils/objectResponse';
import { EditUserInterface } from './interface/UserInterface';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async findAllUser(query: {email: string;}): Promise<ResponseInterface>{
        const userList: User[] = await this.prisma.user.findMany({
            where: {
                email: {
                    contains: query.email
                }
            },
        });

        const modifyUser = userList.map((item) => {
            delete item.hash

            return item;
        })

        return objectResponse({
           status: 'Success',
           code: 200,
           message: 'Success to retrieve Data',
           data: modifyUser
        })
    }

    async updateUser(body: EditUserInterface): Promise<ResponseInterface>{
        const {data, param} = body;

        const user:User = await this.prisma.user.update({
            where: {
                email: param
            },
            data
        });

        delete user.hash;

        return objectResponse({
            code: 200,
            status: 'Success',
            message: "Success to update data",
            data: user
        })
    }

    async findOneUser(email: string): Promise<ResponseInterface>{
        const user: User = await this.prisma.user.findUnique({
            where: {
                email
            }
        });    

        if(!user){
            const exc = new ForbiddenException("Credential not found")

            return objectResponse({
                code: exc.getStatus(),
                status: 'Failed',
                message: exc.message,
                data: null
            })
        }

        delete user.hash

        return objectResponse({
            code: 200,
            status: 'Success',
            message: 'Successfully to retrieve data',
            data: user
        })
    }

    async deleteUser(email: string): Promise<ResponseInterface>{
        try {
            const user: User = await this.prisma.user.delete({
                where:{
                    email
                }
            })

            delete user.hash;

            return objectResponse({
                code: 200,
                status: 'Success',
                message: 'Successfully delete data',
                data: user
            })
        } catch (error) {
            throw new ForbiddenException();
        }
    }


}
