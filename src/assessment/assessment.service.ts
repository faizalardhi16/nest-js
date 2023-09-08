import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { ICreateAssessment, IFindAllAssessment } from './interface/IRequestAssessment';
import { ResponseInterface } from 'utils/interface/ResponseInterface';
import { objectResponse } from 'utils/objectResponse';
import { Assessment } from '@prisma/client';
import { S3Service } from 'src/libs/s3/s3.service';

@Injectable()
export class AssessmentService {
    constructor(private prisma: PrismaService, private s3Service: S3Service){}

    public async createAssessment(body: ICreateAssessment & {file: Express.Multer.File}): Promise<ResponseInterface>{
        const {title_assessment, description, category_id, user_id, question_id, file} = body
        try {

            const response = await this.s3Service.uploadFile(file.buffer, file.mimetype)

            if(!response){
                throw new ForbiddenException("Failed to upload")
            }

            const assessment = await this.prisma.assessment.create({
                data:{
                    title_assesse: title_assessment,
                    description,
                    category_id: Number(category_id),
                    user_id,
                    file_name: response,
                    question_id: Number(question_id)
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

    public async editAssessment(body: Partial<Assessment>): Promise<ResponseInterface>{
        try {
            const assessment = await this.prisma.assessment.update({
                where: {
                    id: body.id
                },
                data: body
            });

            if(!assessment){
                throw new ForbiddenException("Assessment not found");
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

    public async findAssessment(user_id: number): Promise<ResponseInterface>{

        let whereClause: IFindAllAssessment;

        if(user_id){
            whereClause = {
                where: {user_id}
            }
        }


        const assessment = await this.prisma.assessment.findMany(whereClause);

        for(const a of assessment){
            const url = await this.s3Service.getPresignedUrl(a.file_name)
            console.log(url, "URL")
            Object.assign(a,{file_url: url});
        }

        return objectResponse({
            code: 200,
            status: 'Success',
            message: 'Success to retrieve data',
            data: assessment
        })
    }

    public async findOneAssessment(id: number): Promise<ResponseInterface>{
        const assessment = await this.prisma.assessment.findUnique({
            where: {
                id: Number(id)
            },
            include:{
                user: true
            }
        });

        if(!assessment){
            throw new ForbiddenException('Assessment Not Found');
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
