import { Body, Injectable } from "@nestjs/common";
import { CreateUserInterface } from "interface/CreateUserInterface";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()

export class AuthService {
    constructor(private prisma: PrismaService){}

    signup(@Body() body: CreateUserInterface): CreateUserInterface {
        return body
    }
}