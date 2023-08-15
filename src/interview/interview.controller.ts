import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewRequestProp } from './interface/InterviewRequestProp';
import { ResponseInterface } from 'utils/interface/ResponseInterface';
import { Role } from 'utils/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/strategy/role.strategy';
import { Roles } from 'utils/roles.decorator';
import { IQueryFindInterview } from './interface/IQueryFindInterview';
import { Interview } from '@prisma/client';

@Controller('interview')
export class InterviewController {
    constructor(private service: InterviewService){}

    @Roles(Role.ASSESSI, Role.ADMIN)
    @UseGuards(AuthGuard('jwt'),RoleGuard)
    @Post()
    @HttpCode(HttpStatus.OK)
    createInterview(@Body() body:InterviewRequestProp): Promise<ResponseInterface>{
        return this.service.saveInterview(body);
    }

    @Roles(Role.ADMIN, Role.LEAD_ASSESSOR, Role.ASSESSOR, Role.ASSESSI)
    @UseGuards(AuthGuard('jwt'),RoleGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    searchInterview(@Query() query: IQueryFindInterview): Promise<ResponseInterface>{
        console.log("GET", query)
        return this.service.findInterview(query)
    }


    @Roles(Role.ASSESSI)
    @UseGuards(AuthGuard('jwt'),RoleGuard)
    @Patch()
    @HttpCode(HttpStatus.OK)
    updateInterview(@Body() body: Partial<Interview>): Promise<ResponseInterface>{
        return this.service.editInterview(body);
    }
    
}
