// import {Request, Response, Router} from "express";
import {Request, Response} from "express";
import {CResponse} from "../util/CResponse";
import {PhotographerModel} from "../Model/PhotographerModel";
import {BookingModel} from "../Model/BookingModel";
import {PhotographerServiceModel} from "../Model/PhotographerServiceModel";
import {Booking} from "../entity/Booking";

import { Auth } from "./../library/Auth";
const router = new Auth().route;

/**
 * Photographers
 */
router.get("/", (req: Request, res: Response) => {
    // const r =  new PhotographerModel().getPhotographers()
    // CResponse.set(res, r);
    const r = new PhotographerModel().getDashboard(req.body.photographerId);
    CResponse.set(res, r);
});


router.get("/dashboard", (req: Request, res: Response) => {
    console.log('dashboard', req.body)
    const r = new PhotographerModel().getDashboard(req.body.photographerId);
    CResponse.set(res, r);
});


/**
 * Photographer Info
 */
router.get("/:photographerID", (req: Request, res: Response) => {
    const r =  new PhotographerModel().getPhotographer(req.params["photographerID"]);
    CResponse.set(res, r);
});

/**
 * 포토그래퍼의 서비스 목록
 */
router.get("/services", (req: Request, res: Response) => {
    const r =  new PhotographerServiceModel().getServices(req.body.photographerId);
    CResponse.set(res, r);
});

router.get("/services/:serviceID", (req: Request, res: Response) => {
    const r =  new PhotographerServiceModel().getService(req.params["serviceID"]);
    CResponse.set(res, r);
});

router.delete("/services/:serviceID", (req: Request, res: Response) => {
    const r =  new PhotographerServiceModel().deleteService(req.body.photographerId, req.params["serviceID"]);
    CResponse.set(res, r);
});

/**
 * Service Area
 */
router.get("/servicearea", (req: Request, res: Response) => {
    const r =  new PhotographerServiceModel().getArea(req.body.photographerId);
    CResponse.set(res, r);
});

router.post("/servicearea", (req: Request, res: Response) => {
    const r =  new PhotographerServiceModel().addArea(req.body.photographerId, req.body);
    CResponse.set(res, r);
});

router.put("/servicearea", (req: Request, res: Response) => {
    const r =  new PhotographerServiceModel().updateArea(req.body.photographerId, req.body);
    CResponse.set(res, r);
});

/**
 * Bookings
 */
router.get("/bookings", (req: Request, res: Response) => {
    const r = new BookingModel().getBookingsByPhotographer(req.body.photographerId, req.query["query"]);
    CResponse.set(res, r);
});

router.get("/bookings/messages", (req: Request, res: Response) => {
    const r = new BookingModel().getMessagesByPhotographer(req.body.photographerId);
    CResponse.set(res, r);
});

router.get("/bookings/messages/:bookingID", (req: Request, res: Response) => {
    const r = new BookingModel().getMessage(req.params["bookingID"], "photographer");
    CResponse.set(res, r);
});

router.post("/bookings/messages/:bookingID", (req: Request, res: Response) => {
    const r = new BookingModel().addMessageByPhotographer(req.params["bookingID"], req.body.photographerId, req.body.message);
    CResponse.set(res, r);
});

router.get("/bookings/albums", (req: Request, res: Response) => {
    console.log('albums', req.body.photographerId)
});

router.get("/:photographerID/bookings/albums/:bookingID", (req: Request, res: Response) => {
    const r = new BookingModel().getAlbum(req.params["bookingID"]);
    CResponse.set(res, r);
});

router.post("/:photographerID/bookings/albums/:bookingID", (req: Request, res: Response) => {
    const r = new BookingModel().addAlbum(req.params["bookingID"], req.body);
    CResponse.set(res, r);
});

/**
 * Holiday
 */

router.get("/holiday", (req: Request, res: Response) => {
    const r = new PhotographerModel().getHoliday(req.body.photographerId);
    CResponse.set(res, r);
});

router.post("/holiday", (req: Request, res: Response) => {
    const r = new PhotographerModel().setHoliday(req.body.photographerId, req.body);
    CResponse.set(res, r);
});

router.put("/holiday", (req: Request, res: Response) => {
    const r = new PhotographerModel().setHoliday(req.body.photographerId, req.body);
    CResponse.set(res, r);
});

router.get("/availability", (req: Request, res: Response) => {
    const r = new PhotographerModel().getAvailablity(req.body.photographerId);
    console.log('server : ', r)
    CResponse.set(res, r);
});

router.post("/availability", (req: Request, res: Response) => {
    const r = new PhotographerModel().setAvailablity(req.body.photographerId, req.body);
    CResponse.set(res, r);
});

router.put("/availability", (req: Request, res: Response) => {
    const r = new PhotographerModel().setAvailablity(req.body.photographerId, req.body);
    CResponse.set(res, r);
});

/**
 * Request
 * @type {Router}
 */

router.put("/request", (req: Request, res: Response) => {
    const body: Booking = req.body;
    const r = new BookingModel().editBookingPhotographer(req.body.photographerId, body);
    CResponse.set(res, r);
});


router.get("/alarms", (req: Request, res: Response) => {
    const r = new BookingModel().getUnreadMessageCountByPhotographer(req.body.photographerId);
    CResponse.set(res, r);
});

module.exports = router;
