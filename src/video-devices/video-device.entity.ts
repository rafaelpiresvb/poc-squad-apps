import { ApiProperty } from "@nestjs/swagger";
import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity()
@Index(['userId', 'serial'], { unique: true })
export class VideoDevice extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({example: 'bf7794ff-859f-4765-bd97-c43b630be863', description: 'The id of the video device'})
    id: string;

    @Column({ nullable: false, type: 'uuid' })
    userId: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    @ApiProperty({example: 'House', description: 'The name of the video device'})
    name: string;

    @Column({ nullable: false, type: 'varchar', length: 13 })
    @ApiProperty({example: 'ABCDEF1234567', description: 'The serial number of the video device'})
    serial: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    @ApiProperty({example: 'admin', description: 'The username to access video device'})
    username: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    @ApiProperty({example: '1234', description: 'The password of the video device'})
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}