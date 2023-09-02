import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { ResponseInterface } from 'utils/interface/ResponseInterface';
import { ICreateQuestion } from './interface/ICreateQuestion';
import { objectResponse } from 'utils/objectResponse';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class QuestionService {
    constructor(private prisma: PrismaService){}

    public async createQuestion(body: ICreateQuestion): Promise<ResponseInterface>{
        try {
            const question = await this.prisma.question.create({
                data: body
            });

            delete question.createdAt
            delete question.updatedAt

            return objectResponse({
                code: 200,
                status: 'Success',
                message: 'Successfully to add question',
                data: question
            });
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                throw new ForbiddenException("Category Not Found")
            }
            throw error   
        }
    }

    public async findAllQuestion(): Promise<ResponseInterface>{
       try {
            const data = await this.prisma.question.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category_id: true,
                    createdAt: false,
                    updatedAt: false
                }
            });

            return objectResponse({
                code: 200,
                status: 'Success',
                message: 'Success to retrieve data',
                data
            });
       } catch (error) {
            throw error
       }
    }
}
