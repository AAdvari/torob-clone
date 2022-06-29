import {
    Column,
    CreateDateColumn,
    DeepPartial,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity<T> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    createdById?: number;

    @Column({ nullable: true })
    updatedById?: number;

    @CreateDateColumn({
        nullable: false,
        type: 'timestamptz',
    })
    createdAt?: Date;

    @UpdateDateColumn({
        nullable: true,
        type: 'timestamptz',
    })
    updatedAt?: Date;

    @DeleteDateColumn({
        nullable: true,
        type: 'timestamptz',
    })
    deletedAt?: Date;

    constructor(init?: DeepPartial<T>) {
        Object.assign(this, init);
    }
}
