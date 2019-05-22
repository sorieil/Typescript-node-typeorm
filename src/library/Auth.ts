import * as express from "express";
import * as Firebase from "../library/Firebase";
import {firebaseAdmin} from "./Firebase";
import {UserModel} from "../Model/UserModel";

/**
 * router.use 사용시 1급함수를 적용 할경우와 그외 다른 클레스를 사용할때 getter setter 방식의 전역변수 방법으로 사용하면, router.use 내부 함수에서
 * 불러올 수 없고 undefined 에러가 뜬다.
 */
export class Auth {
    public route: any;

    constructor() {
        this.route = express.Router();
        this.middleware();
    }

    private middleware() {
        this.route.use(this.validateFirebaseIdToken);
        this.route.use(this.check);

    }

    /**
     * Check firebase uid
     * @param req
     * @param res
     * @param next
     * @returns {Promise<never | any>}
     */
    private check(req: any, res: any, next: any) {

        try {
            const uid = req.body.firebaseUid;
            // console.log('body:', req.body)
            return firebaseAdmin.firestore().collection('users').doc(uid).get().then((snapshot) => {
                if (snapshot.exists) {
                    const firebaseUsers = snapshot.data();
                    // console.log(firebaseUsers)
                    return new UserModel().getUidByFirebaseUid(uid, firebaseUsers.type).then((result: any) => {
                        // console.log('Login:', result);
                        if (result) {
                            console.log('user id:', result.user.photographer[0].id);
                            if (firebaseUsers.type === 'photographer') {
                                // console.log('1 step');
                                req.body.photographerId = result.user.photographer[0].id
                            } else {
                                // console.log('2 step');
                                req.body.photographerId = null
                            }
                            // console.log('3 step');
                            req.body.uid = result.user.id;
                            // console.log(req.body)
                            next();
                        } else {
                            res.json({msg: "2차 시스템에 등록된 회원이 아닙니다."});
                            return;
                        }
                    }).catch((e: any) => {
                        console.error(e)
                        res.json({msg: "회원 인증 오류"});
                        return;
                    });
                } else {
                    res.json({msg: "1차 시스템에 등록된 회원이 아닙니다."});
                    return;
                }

            })

        } catch (e) {
            res.send("Check error");
            return;
        }


    }

    /**
     * Check firebase token
     * @param req
     * @param res
     * @param next
     * @returns {Promise<never | admin.auth.DecodedIdToken>}
     */
    private validateFirebaseIdToken(req: any, res: any, next: any) {
        try {
            // console.log('Check if request is authorized with Firebase ID token');
            if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
                // console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
                //     'Make sure you authorize your request by providing the following HTTP header:',
                //     'Authorization: Bearer <Firebase ID Token>');
                res.statusCode = 401;
                // MyRealmName can be changed to anything, will be prompted to the user
                // this will displayed in the browser when authorization is cancelled
                res.json({msg: "토큰 정보가 없습니다."});
                return;
            }

            const idToken = req.headers.authorization.split("Bearer ")[1];
            // console.log("reciev:", idToken);
            return Firebase.firebaseAdmin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
                // console.log('ID Token correctly decoded', decodedIdToken);
                req.body.firebaseUid = decodedIdToken.uid;
                // console.log('uid:', req.body.firebaseUid);
                next();
            }).catch((e) => {
                console.log(e);
                res.statusCode = 401;
                res.json({msg: "토큰 인증 오류", error: e});
                return;
            });
        } catch (e) {
            res.statusCode = 401;
            res.json({msg: "Validate error"});
        }

    }
}
