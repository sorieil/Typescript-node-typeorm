import {Response} from "express";

export class CResponse {
    static set(res: Response, data: any) {
        if (typeof data.then === 'function') { // Promise라고 판단한다
            data.then((d: any) => {

                //데이터가 undefined면 에러라고 판단한다.
                if (typeof d === "undefined") {
                    return Promise.reject(false);
                }

                res.json({
                    status: 200,
                    data: d,
                });
                res.statusCode = 200;
            }).catch((e: any) => {
                console.log(e);
                res.json({
                    status: 404,
                    data: null,
                });
                res.statusCode = 404;
            })
        }
    }
}
