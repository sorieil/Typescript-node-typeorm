import {Request, Response, Router} from "express";
import {CResponse} from "../util/CResponse";
import {UserModel} from "../Model/UserModel";
import {PhotographerModel} from "../Model/PhotographerModel";

const router = Router();
/**
 * Add Photographer
 */
router.post("/photographer", (req: Request, res: Response) => {
    console.log('sign photographer: ', req.body)
    const r = new PhotographerModel().addPhotographer(req.body);
    CResponse.set(res, r);
});

/**
 * Add New User
 */
router.post("/user", (req: Request, res: Response) => {
    console.log('sign user: ', req.body)
    const r = new UserModel().addUser(req.body);
    // const r = new UserModel().addUser(req.body);
    CResponse.set(res, r);
});

module.exports = router;
