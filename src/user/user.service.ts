import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { ResponseInterface } from 'utils/interface/ResponseInterface';
import { objectResponse } from 'utils/objectResponse';
import { EditUserInterface } from './interface/UserInterface';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    public async findAllUser(query: {email: string;}): Promise<ResponseInterface>{
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

    public async updateUser(body: EditUserInterface): Promise<ResponseInterface>{
        try {
            const {data, param} = body;

            const transaction = this.prisma.user.update({
                where: {
                    email: param
                },
                data
            });

            const user = await this.prisma.$transaction([transaction])

            delete user[0].hash;

            return objectResponse({
                code: 200,
                status: 'Success',
                message: "Success to update data",
                data: user
            })
        } catch (error) {
            return objectResponse({
                code: 500,
                status: 'Failed',
                message: "Failed4 to update data",
                data: null
            })
        }
    }

    public async findOneUser(email: string): Promise<ResponseInterface>{
        const user: User = await this.prisma.user.findUnique({
            where: {
                email
            }
        });    

        if(!user){
            throw new ForbiddenException("Credential not found")
        }

        delete user.hash

        return objectResponse({
            code: 200,
            status: 'Success',
            message: 'Successfully to retrieve data',
            data: user
        })
    }

    public async deleteUser(email: string): Promise<ResponseInterface>{
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
