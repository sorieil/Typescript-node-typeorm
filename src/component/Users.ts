import {Request, Response} from "express";
import {UserModel} from "../Model/UserModel";
import {CResponse} from "../util/CResponse";
import {BookingModel} from "../Model/BookingModel";
import {PhotographerServiceModel} from "../Model/PhotographerServiceModel";
import {Booking} from "../entity/Booking";

import { Auth } from "./../library/Auth";
const router = new Auth().route;

/**
 * Users
 * 검색은 ?query= 로 해결한다.
 */
router.get("/", (req: Request, res: Response) => {
    let offset = 0;
    if (typeof req.query["page"] !== "undefined") {
        offset = parseInt(req.query["page"], 10) - 1;
    }
    const r = new UserModel().getUsers(offset, 15);
    CResponse.set(res, r);
});

/**
 * User info
 */
router.get("/:userID", (req: Request, res: Response) => {
    const r = new UserModel().getUser(req.params["userID"]);
    CResponse.set(res, r);
});

router.put("/:userID", (req: Request, res: Response) => {
    const r = new UserModel().updateUser(req.params["userID"],req.body);
    CResponse.set(res, r);
});


/**
 * Bookings
 */
router.get("/:userID/bookings", (req: Request, res: Response) => {
    // console.log(req.query["query"]);
    const r = new BookingModel().getBookingsByUser(req.params["userID"], req.query["query"]);
    CResponse.set(res, r);
});

router.get("/:userID/bookings/messages", (req: Request, res: Response) => {
    const r = new BookingModel().getMessagesByUser(req.params["userID"]);
    CResponse.set(res, r);
});

router.get("/:userID/bookings/messages/:bookingID", (req: Request, res: Response) => {
    const r = new BookingModel().getMessage(req.params["bookingID"], "user");
    CResponse.set(res, r);
});

router.post("/:userID/bookings/messages/:bookingID", (req: Request, res: Response) => {
    const r = new BookingModel().addMessageByUser(req.params["bookingID"], req.params["userID"], req.body.message);
    CResponse.set(res, r);
});

router.put("/:userID/bookings", (req: Request, res: Response) => {
    const body: Booking = req.body;
    const r = new BookingModel().editBookingUser(req.params["userID"],body);
    CResponse.set(res, r);
});

/**
 * User service
 */
router.get("/:userID/services", (req: Request, res: Response) => {
    const r = new PhotographerServiceModel().getSavedServicesByUser(req.params["userID"]);
    CResponse.set(res, r);
});

router.delete("/:userID/services/:serviceID", (req: Request, res: Response) => {
    const r = new PhotographerServiceModel().removeServiceByUser(req.params["userID"], req.params["serviceID"]);
    CResponse.set(res, r);
});

router.get("/:userID/services/isSaved/:serviceID", (req: Request, res: Response) => {
    const r = new PhotographerServiceModel().getIsSavedByUser(req.params["userID"], req.params["serviceID"]);
    CResponse.set(res, r);
});

router.post("/:userID/services", (req: Request, res: Response) => {
    const r = new PhotographerServiceModel().saveServiceByUser(req.params["userID"], req.body);
    CResponse.set(res, r);
});

router.get("/:userID/dashboard", (req: Request, res: Response) => {
    const r = new UserModel().getDashboard(req.params["userID"]);
    CResponse.set(res, r);
});

/**
 * User albums
 */

router.get("/albums", (req: Request, res: Response) => {
   const r = new BookingModel().getAlbums(req.body.uid);
    CResponse.set(res, r);
});

router.get("/albums/:bookingID", (req: Request, res: Response) => {
    const r = new BookingModel().getAlbum(req.params["bookingID"]);
    CResponse.set(res, r);
});

router.post("/albums/:bookingID/review", (req: Request, res: Response) => {
    const r = new BookingModel().addReview(req.params["bookingID"], req.body);
    CResponse.set(res, r);
});


/**
 * User alarms
 */
router.get("/alarms", (req: Request, res: Response) => {
    const r = new BookingModel().getUnreadMessageCountByUser(req.body.uid);
    CResponse.set(res, r);
});

module.exports = router;
