import {BaseModel} from "./BaseModel";
import {LandingPage} from "../entity/Common";

export class LandingModel extends BaseModel {

    constructor() {
        super();
        this.temp();
    }

    public async get(): Promise<any> {
        return await this.getRepository(LandingPage).find();
    }

    public async temp(): Promise<any> {
        const landingPage = new LandingPage();
        landingPage.id = 1;
        landingPage.description = "Find photographer_name whenever and wherever";
        landingPage.urls = "https://firebasestorage.googleapis.com/v0/b/test-7beb1.appspot.com/o/images%2Flanding%2Flanding-1.jpg?alt=media&token=86ebed53-0c19-4cfb-a00b-ac05da291b0f, https://firebasestorage.googleapis.com/v0/b/test-7beb1.appspot.com/o/images%2Flanding%2Flanding-2.jpg?alt=media&token=df7120fa-ff44-453d-881c-23a257ab3f67";
        return await this.getRepository(LandingPage).save(landingPage);
    }

}
