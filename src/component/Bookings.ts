import {Request, Response} from "express";
import {CResponse} from "../util/CResponse";
import {BookingModel} from "../Model/BookingModel";

import { Auth } from "./../library/Auth";
const router = new Auth().route;

//부킹목록
router.get("/", (req: Request, res: Response) => {
    // const r = new BookingModel();
});

//부킹등록
router.post("/", (req: Request, res: Response) => {
    console.log('booking body: ', req.body)
    const r = new BookingModel().addBooking(req.body);
    // const r = new BookingModel().addBooking({
    //     "booking.id:": 0,
    //     "booking.date": "2017-09-01",
    //     "booking.startTime": "0",
    //     "booking.endTime": "1",
    //     "booking.placeID": "",
    //     "booking.address": "",
    //     "booking.price": 50,
    //     "booking.description": "사진을 잘 찍고 싶습니다..........",
    //     "booking.status": "request",
    //     "booking.requestedAt": new Date(),
    //     "userID": 1,
    //     "photographerID": 2,
    //     "photographerServiceID": 3,
    // });
    CResponse.set(res, r);
});

module.exports = router;
