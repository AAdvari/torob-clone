import {BaseEntity} from "./Base.entity";
import {DeepPartial, Repository} from "typeorm";
import {NotFoundException} from "@nestjs/common";

export class BaseService<Entity extends BaseEntity<Entity>> {
    entityName: string;
    Record: any;
    constructor(protected repository: Repository<Entity>) {
        this.Record = this.repository.target;
        this.entityName = this.repository.metadata.name.toLowerCase();
    }


    async delete(id: number) {
        this.checkNullId(id);
        const record = new this.Record();
        record.id = id;
        record.deletedAt = new Date();
        const result = await this.repository.save(record);
        this.checkNotFound(result);
    }


    async save(entity: DeepPartial<Entity>): Promise<Entity> {
        const record = new this.Record();
        for (const [key, value] of Object.entries(entity)) {
            if (value !== undefined) {
                record[key] = value;
            }
        }
        return this.repository.save(record);
    }

    checkNotFound(entity: Entity) {
        if (!entity) {
            throw new NotFoundException(`${this.entityName} not found`);
        }
    }


    private checkNullId(id: number) {
        if (!id) {
            throw new NotFoundException(`${this.entityName} not found`);
        }
    }

}
