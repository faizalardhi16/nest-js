import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Role } from 'utils/role.enum';
import { Roles } from 'utils/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/strategy/role.strategy';
import { ICreateCategory } from './interface/ICreateCategory';
import { ResponseInterface } from 'utils/interface/ResponseInterface';

@Controller({
    path: 'category',
    version: ['1']
})
export class CategoryController {
    constructor(private service: CategoryService){}

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('create')
    @HttpCode(HttpStatus.OK)
    public async addCategories(@Body() body: ICreateCategory): Promise<ResponseInterface>{
        return this.service.createCategory(body);
    }
    
    @Roles(Role.ADMIN, Role.ASSESSI, Role.ASSESSOR, Role.LEAD_ASSESSOR)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllCategory(): Promise<ResponseInterface>{
        return this.service.findAllCategory();
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    public async deleteCategory(@Param() param: {id: string}): Promise<ResponseInterface>{
        console.log(param.id, "param")
        return this.service.removeCategory(param.id)
    }
    
}
