import {BaseModel} from "./BaseModel";
import {CommonCode} from "../entity/Common";

export class CommonCodeModel extends BaseModel {

    public async getCodes(codeType: string): Promise<any> {
        return await this.getRepository(CommonCode).createQueryBuilder("commoncode")
            .where("codeType = :codeType")
            .setParameter("codeType", codeType)
            .orderBy("seq", "ASC")
            .getMany();
    }
}