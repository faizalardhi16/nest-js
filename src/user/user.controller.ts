import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/strategy/role.strategy';
import { Role } from 'utils/role.enum';
import { Roles } from 'utils/roles.decorator';
import { UserService } from './user.service';
import { DatabaseService } from 'src/database/database.service';
import { User } from '@prisma/client';
import { EditUserInterface, RequestUserInterface } from './interface/UserInterface';
import { ResponseInterface } from 'utils/interface/ResponseInterface';

@Controller('user')
export class UserController {
    constructor(private service: UserService, private db: DatabaseService){}

    @Roles(Role.ADMIN, Role.LEAD_ASSESSOR)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    getUser(@Req() req: RequestUserInterface){
        return this.service.findOneUser(req.user.email)
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get("userlist")
    @HttpCode(HttpStatus.OK)
    GetUserList(@Query() query: {email: string;}): Promise<ResponseInterface>{
        return this.service.findAllUser(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('edituser')
    @HttpCode(HttpStatus.OK)
    EditUser(@Body() body: Partial<User>, @Req() req: RequestUserInterface): Promise<ResponseInterface>{
        const payload: EditUserInterface = {
            data: body,
            param: req.user.email
        }
        return this.service.updateUser(payload);
    }


    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Delete("delete")
    @HttpCode(HttpStatus.OK)
    RemoveUser(@Body() body: {email: string;}): Promise<ResponseInterface>{
        return this.service.deleteUser(body.email);
    }

    @Roles(Role.ADMIN, Role.LEAD_ASSESSOR)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('detail/:email')
    @HttpCode(HttpStatus.OK)
    UserDetail(@Param() params: {email: string;}): Promise<ResponseInterface>{
        return this.service.findOneUser(params.email)
    }

    // @Get('test')
    // async GetListTest(){
    //     const tes = await this.db.executeQuery("select * from users");
        
    //     return tes
    // }
}
