import {Request, Response} from "express";
// import {CResponse} from "../util/CResponse";
// import {UserModel} from "../Model/UserModel";
// import {PhotographerModel} from "../Model/PhotographerModel";
// import {sign} from "jsonwebtoken";

import { Auth } from "./../library/Auth";
const router = new Auth().route;

/**
 * 로그인 처리
 */
router.post("/login", (req: Request, res: Response) => {
    // console.log("login", req.body);
    // const r = new UserModel().getUidByFirebaseUid(req.body.firebase.uid).then( async (data) => {
    //     if (typeof data !== "undefined") {
    //         if (data.user.accountType === "user") {
    //         // 여기서 파이어베이스 uid 기준으로 데이터를 불러온다.
    //             const user = await new UserModel().getUser(data.user.id);
    //             const payload: {} = {
    //                 id: user.id,
    //                 userID: user.id,
    //                 photographerID: 0,
    //                 userName: user.lastName + " " + user.firstName,
    //                 accountType: user.accountType,
    //                 email: user.email,
    //                 exp: Math.floor(Date.now() / 1000) + (60 * 60) * 24,
    //             }
    //             return sign(payload, "test!!!");
    //
    //         } else {
    //             const photographer = await new PhotographerModel().getPhotographer(data.user.id);
    //             const payload: {} = {
    //                 id: photographer.id,
    //                 userID: photographer.user.id,
    //                 photographerID: photographer.id,
    //                 userName: photographer.user.lastName + " " + photographer.user.firstName,
    //                 accountType: photographer.user.accountType,
    //                 email: photographer.user.email,
    //                 exp: Math.floor(Date.now() / 1000) + (60 * 60) * 24,
    //             }
    //             return sign(payload, "test!!!");
    //
    //         }
    //     } else {
    //         res.json({status: 403, data: null,});
    //         res.statusCode = 403;
    //     }
    // } ).catch(() => {
    //     res.json({status: 404, data: null,});
    //     res.statusCode = 404;
    // });
    //
    // CResponse.set(res, r);

});

router.post("/adminlogin", (req: Request, res: Response) => {

});

module.exports = router;
