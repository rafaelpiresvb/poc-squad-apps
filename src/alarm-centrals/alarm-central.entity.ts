import { ApiProperty } from '@nestjs/swagger';
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
@Index(['userId', 'macAddress'], { unique: true })
export class AlarmCentral extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({example: 'bf7794ff-859f-4765-bd97-c43b630be863', description: 'The id of the alarm central'})
    id: string;

    @Column({ nullable: false, type: 'uuid' })
    userId: string;

    @ApiProperty({example: 'House', description: 'The name of the alarm central'})
    @Column({ nullable: false, type: 'varchar', length: 200 })
    name: string;

    @ApiProperty({example: '1A2B3C4D5E6F', description: 'The MAC address of the alarm central, must be a valid MAC without separators'})
    @Column({ nullable: false, type: 'varchar', length: 20 })
    macAddress: string;

    @ApiProperty({example: '1234', description: 'The password of the alarm central, must be 4 ou 6 numeric digits'})
    @Column({ nullable: false, type: 'varchar', length: 6 })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}