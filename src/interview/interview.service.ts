import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { InterviewRequestProp } from './interface/InterviewRequestProp';
import { ResponseInterface } from 'utils/interface/ResponseInterface';
import { objectResponse } from 'utils/objectResponse';
import { IQueryFindInterview } from './interface/IQueryFindInterview';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Interview } from '@prisma/client';

@Injectable()
export class InterviewService {
    constructor(private prisma: PrismaService){}

    public async saveInterview(body: InterviewRequestProp): Promise<ResponseInterface>{
        const interview = await this.prisma.interview.create({
            data: {
                title: body.title,
                description: body.description,
                user_id: body.user_id
            }
        });


        return objectResponse({
            code: 200,
            status: 'Success',
            message: 'Successfully add Interview',
            data: interview
        });
    }

    public async findInterview(query: IQueryFindInterview): Promise<ResponseInterface>{
        let whereClause: any = {
            where: {}
        }

        if(query.user_id) whereClause.where.user_id = Number(query.user_id)
        if(query.search) whereClause.where.title = {contains: query.search}
       
        const interview = await this.prisma.interview.findMany(whereClause);

        return objectResponse({
            code: 200,
            status: 'Success',
            message: "Successfully to retrieve data",
            data: interview
        })
    }

    public async editInterview(data: Partial<Interview>): Promise<ResponseInterface>{
        try {
           const interview = await this.prisma.interview.update({
            where: {
                id: data.id
            },
            data
           });

           return objectResponse({
            code: 200,
            message: 'Successfully to update data',
            status: 'Success',
            data: interview
           })
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    const exc = new ForbiddenException("Failed to Edit");
                    return objectResponse({
                        code: exc.getStatus(),
                        message: exc.message,
                        data: null,
                        status: 'Failed'
                    })
                }
            }
            
            throw new Error();
        }
    }
}
