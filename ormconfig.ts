import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Contents } from 'src/content/entities/content.entity';
import { Users } from 'src/user/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const config:TypeOrmModuleOptions = {
    type:'mysql',
    host:'localhost',
    port:3306,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    entities:[
        Contents,
        Users
    ],
    synchronize : true, // 한번 true한 뒤로는 무조건 false
    autoLoadEntities:true,
    charset:'utf8mb4',
    logging:true, 
    keepConnectionAlive:true,
}

export = config;