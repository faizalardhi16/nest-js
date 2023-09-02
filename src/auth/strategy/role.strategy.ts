import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector: Reflector){}
 
    matchesRole(roles: string[], userRole: string){
        return roles.some((item) => item.toUpperCase() === userRole.toUpperCase());
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler())
   
        if(!roles){
            return true;
        }

        const request = context.switchToHttp().getRequest()
        const user = request.user
        console.log(user, "USER")
        return this.matchesRole(roles, user.role);
    }

}