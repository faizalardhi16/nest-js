import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { ICreateAssessment } from './interface/IRequestAssessment';
import { ResponseInterface } from 'utils/interface/ResponseInterface';
import { RequestUserInterface } from 'src/user/interface/UserInterface';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'utils/role.enum';
import { Roles } from 'utils/roles.decorator';
import { RoleGuard } from 'src/auth/strategy/role.strategy';
import { Assessment } from '@prisma/client';

@Controller('assessment')
export class AssessmentController {
    constructor(private service: AssessmentService){}

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
    
}
