import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateAssessment, IFindAllAssessment } from './interface/IRequestAssessment';
import { ResponseInterface } from 'utils/interface/ResponseInterface';
import { objectResponse } from 'utils/objectResponse';
import { Assessment } from '@prisma/client';

@Injectable()
export class AssessmentService {
    constructor(private prisma: PrismaService){}

    async createAssessment(body: ICreateAssessment): Promise<ResponseInterface>{
        const {title_assessment, description, category_id, user_id} = body
        try {
            const assessment = await this.prisma.assessment.create({
                data:{
                    title_assesse: title_assessment,
                    description,
                    category_id,
                    user_id
                }
            });

            delete assessment.user_id

            return objectResponse({
                code: 200,
                status: 'Success',
                message: 'Success to create assessment',
                data: assessment
            })
        } catch (error) {
            throw new Error(error);
        }
    }

    async editAssessment(body: Partial<Assessment>): Promise<ResponseInterface>{
        try {
            const assessment = await this.prisma.assessment.update({
                where: {
                    id: body.id
                },
                data: body
            });

            if(!assessment){
                const exc = new ForbiddenException("Assessment not found");
                return objectResponse({
                    code: exc.getStatus(),
                    message: exc.message,
                    status: 'Failed',
                    data: null
                });
            }

            return objectResponse({
                code: 200,
                message: 'Success to updated data',
                status: 'Success',
                data: assessment
            })
        } catch (error) {
            throw error;
        }

    }

    async findAssessment(user_id: number): Promise<ResponseInterface>{

        let whereClause: IFindAllAssessment;

        if(user_id){
            whereClause = {
                where: {user_id}
            }
        }


        const assessment = await this.prisma.assessment.findMany(whereClause);

        return objectResponse({
            code: 200,
            status: 'Success',
            message: 'Success to retrieve data',
            data: assessment
        })
    }

    async findOneAssessment(id: number): Promise<ResponseInterface>{
        const assessment = await this.prisma.assessment.findUnique({
            where: {
                id: Number(id)
            },
            include:{
                user: true
            }
        });

        if(!assessment){
            const exc = new ForbiddenException('Assessment Not Found');

            return objectResponse({
                code: exc.getStatus(),
                status: 'Failed',
                message: exc.message,
                data: null
            })
        }

        delete assessment.user.hash
        delete assessment.user.createdAt
        delete assessment.user.updatedAt
        delete assessment.user.id
        
        return objectResponse({
            code: 200,
            status: 'Success',
            message: 'Successfully to retrieve data',
            data: assessment
        })
    }
}
