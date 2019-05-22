import {Request, Response, Router} from "express";
import {LandingModel} from "../Model/LandingModel";
import {CResponse} from "../util/CResponse";

// import { Auth } from "./../library/Auth";
// const router = new Auth().route;
const router = Router();

router.get("/", (req: Request, res: Response) => {
    const r =  new LandingModel().get();
    CResponse.set(res, r);

});

module.exports = router;
