import {EntityManager, getEntityManager, getRepository, Repository, ObjectType} from "typeorm";
export class BaseModel {

    protected getRepository(entity: any): Repository<any> {
        return getRepository(entity);
    }

    protected getManager(): EntityManager {
        return getEntityManager();
    }

    protected async transaction(runInTransaction: (entityManager: EntityManager) => Promise<any>): Promise<any> {
        return getEntityManager().transaction(runInTransaction);
    }

    public async transInsertQuery(query ?: string ) {
        const queryRunner = getEntityManager().connection.driver.createQueryRunner();
        await queryRunner.startTransaction();
        return await queryRunner.query(query).then(async () => {
            await queryRunner.rollbackTransaction(); // 실제로는 queryRunner.commitTransaction()
            await queryRunner.release();
        }).catch(() => queryRunner.rollbackTransaction());
    }

    //object와 엔티티를 합친다
    protected assignObjectToModel<Entity>(object: any, type: ObjectType<Entity>): Entity {
        let repository = getRepository(type);
        let model: Entity = repository.create();
        const modelName = model.constructor.name[0].toLowerCase() + model.constructor.name.substring(1, model.constructor.name.length) + ".";

        repository.metadata.columns
            .filter(column => {
                if (object.hasOwnProperty(column.propertyName) || object.hasOwnProperty(modelName + column.propertyName)) {
                    return true;
                } else {
                    return false;
                }
            })
            .forEach(column => {
                if (object.hasOwnProperty(column.propertyName)) {
                    model[column.propertyName] = object[column.propertyName]
                } else if(object.hasOwnProperty(modelName + column.propertyName)) {
                    model[column.propertyName] = object[modelName + column.propertyName]
                }
            });

        return model;
    }
}
