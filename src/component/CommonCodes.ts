import {Request, Response, Router} from "express";
import {CResponse} from "../util/CResponse";
import {CommonCodeModel} from "../Model/CommonCodeModel";

// import { Auth } from "./../library/Auth";
// const router = new Auth().route;
const router = Router();

router.get("/:codeType", (req: Request, res: Response) => {
    const r =  new CommonCodeModel().getCodes(req.params["codeType"]);
    CResponse.set(res, r);
});

module.exports = router;
