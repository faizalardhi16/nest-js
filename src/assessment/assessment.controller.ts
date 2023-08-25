import { Body, Controller, FileTypeValidator, Get, HttpCode, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { ICreateAssessment } from './interface/IRequestAssessment';
import { ResponseInterface } from 'utils/interface/ResponseInterface';
import { RequestUserInterface } from 'src/user/interface/UserInterface';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'utils/role.enum';
import { Roles } from 'utils/roles.decorator';
import { RoleGuard } from 'src/auth/strategy/role.strategy';
import { Assessment } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { S3Service } from 'src/s3/s3.service';

@Controller('assessment')
export class AssessmentController {
    constructor(private service: AssessmentService, private s3Service: S3Service){}

    @Roles(Role.ASSESSI)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('create')
    @HttpCode(HttpStatus.OK)
    saveAssessment(@Body() body: ICreateAssessment, @Req() req: RequestUserInterface): Promise<ResponseInterface>{
        return this.service.createAssessment({...body, user_id: req.user.sub})
    }

    @Roles(Role.ASSESSI)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Patch('update')
    @HttpCode(HttpStatus.OK)
    updateAssessment(@Body() body: Partial<Assessment>): Promise<ResponseInterface>{
        return this.service.editAssessment(body)
    }

    @Roles(Role.ADMIN, Role.ASSESSI, Role.ASSESSOR, Role.LEAD_ASSESSOR)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    getAssessment(@Query() query: {user_id: number;}): Promise<ResponseInterface>{
        const user_id = Number(query.user_id);
        return this.service.findAssessment(user_id);
    }
    
    @Roles(Role.ADMIN, Role.ASSESSI, Role.ASSESSOR, Role.LEAD_ASSESSOR)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    getDetailAssessment(@Param() param:{id: number;}): Promise<ResponseInterface>{
        return this.service.findOneAssessment(param.id)
    }

    @Post('local')
    @UseInterceptors(
      FileInterceptor('file'),
    )
    async local(@UploadedFile(
      new ParseFilePipe({
        validators:[
            new MaxFileSizeValidator({maxSize: 1024 * 1024 * 5}),
            new FileTypeValidator({fileType: 'image/*'})
        ]
      })
    ) file: Express.Multer.File) {
      const response = await this.s3Service.uploadFile(file.buffer, file.mimetype);
      return {
        statusCode: 200,
        data: response,
      };
    }

    // @Post('upload')
    // @UseInterceptors(FileInterceptor('file', {
    //     storage: diskStorage({
    //         destination: "public/img",
    //         filename: (req, file, cb) => {
    //             cb(null, file.originalname + 'hello')
    //         }
    //     })
    // }))
    // uploadFile(@UploadedFile(
    //     new ParseFilePipe({
    //         validators:[
    //             new MaxFileSizeValidator({maxSize: 1024 * 1024 * 5}),
    //             new FileTypeValidator({fileType: 'application/pdf'})
    //         ]
    //     })
    // ) file: Express.Multer.File){
    //     return{
    //         path: file.path,
    //         name: file.filename
    //     }
    // }
    
}
