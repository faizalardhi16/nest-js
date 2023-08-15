import { Injectable } from '@nestjs/common';
import { PrismaClient } from "@prisma/client"

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(){
        super({
            datasources: {
                db: {
                    url: process.env.NODE_ENV === "production" ? process.env.DATABASE_URL_PRODUCTION : process.env.DATABASE_URL
                }
            }
        })
    }
}
