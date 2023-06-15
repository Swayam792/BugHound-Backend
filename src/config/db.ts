import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { DB_HOST, DB_PORT, DB_PASSWORD, DB_USERNAME } from '../utils/environment'; 
import { User } from '../entity/User';
import { Bug } from '../entity/Bug';
import { Member } from '../entity/Member';
import { Note } from '../entity/Note';
import { Project } from '../entity/Project';

const AppDataSource = new DataSource({
    type: 'postgres',
    host:  DB_HOST,
    port:  DB_PORT,
    username:  DB_USERNAME,
    password:  DB_PASSWORD,
    database: 'bughound',
    entities: [
        process.env.NODE_ENV === 'test'
          ? 'src/entity/**/*.ts'
          : 'build/entity/**/*.js',
    ],    
    synchronize: true,
    logging: false
});

export const userRepository = AppDataSource.getRepository(User);
export const bugRepository = AppDataSource.getRepository(Bug);
export const memberRepository = AppDataSource.getRepository(Member);
export const noteRepository = AppDataSource.getRepository(Note);
export const projectRepository = AppDataSource.getRepository(Project);

export const connectToDB = async () => {
    try {
        AppDataSource.initialize().then(() =>{
            console.log("Database initialized");
        })
    } catch(err){
        console.log(err);
    }
}