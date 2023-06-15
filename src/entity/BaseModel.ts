import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export default abstract class BaseModel extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: String

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}