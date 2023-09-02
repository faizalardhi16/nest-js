import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/strategy/role.strategy';
import { Role } from 'utils/role.enum';
import { ICreateQuestion } from './interface/ICreateQuestion';
import { ResponseInterface } from 'utils/interface/ResponseInterface';
import { Roles } from 'utils/roles.decorator';

@Controller({
    path: 'question',
    version: ['1']
})
export class QuestionController {
    constructor(private service: QuestionService){}
  
    @Roles(Role.ADMIN, Role.ASSESSOR, Role.LEAD_ASSESSOR)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post()
    public async AddQuestion(@Body() body: ICreateQuestion): Promise<ResponseInterface>{
        return this.service.createQuestion(body);
    }


    @UseGuards(AuthGuard('jwt'))
    @Get()
    public async GetQuestion(): Promise<ResponseInterface>{
        return this.service.findAllQuestion();
    }

}
