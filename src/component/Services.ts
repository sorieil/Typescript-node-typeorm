import {Request, Response, Router} from "express";
import {CResponse} from "../util/CResponse";
import {PhotographerServiceModel} from "../Model/PhotographerServiceModel";

// import {Auth} from "./../library/Auth";

// const router = new Auth().route;
const router = Router()

//관리자용?
router.get("/", (req: Request, res: Response) => {
    const r = new PhotographerServiceModel().searchServices(req.query);
    CResponse.set(res, r);
});

/**
 * 서비스 등록
 */
router.post("/", (req: Request, res: Response) => {

    const r = new PhotographerServiceModel().addService(req.body);

    /*    const r = new PhotographerModel().addService({
            "photographer.id": 1,
            "photographerService.id": 0, // 값이 있으면 update
            "photographerService.aboutService": "aboutService",
            "photographerService.currency": "krw",
            "photographerService.delivery": "delivery",
            "photographerService.minimumHours": 1,
            "photographerService.price": 8.9,
            "photographerService.promoteOnLandingPage": false,
            "photographerService.representativeImage": "image url",
            "photographerService.speciality": "",
            "photographerService.whatYouNeedToProvide": "",

            "photographerServiceImages": [
                {
                    "imageName": "origin name",
                    "path": "storage path",
                    "width": 1024, // origin size
                    "height": 500, //origin size
                    "size": 10000000, //file size
                },
                {
                    "imageName": "origin name",
                    "path": "storage path",
                    "width": 1024, // origin size
                    "height": 500, //origin size
                    "size": 10000000, //file size
                },
                {
                    "imageName": "origin name",
                    "path": "storage path",
                    "width": 1024, // origin size
                    "height": 500, //origin size
                    "size": 10000000, //file size
                }
            ],

            "photographerServiceArea.id": 0, // 값이 있으면 update
            "photographerServiceArea.aboutTheLocation": "asdasd",
            "photographerServiceArea.address": "asdasdasd",
            "photographerServiceArea.city": "london",
            "photographerServiceArea.bySearch": "asdasdasd",
            "photographerServiceArea.howToGetHere": "blah blah",
            "photographerServiceArea.latitude": "431.123123",
            "photographerServiceArea.longitude": "234.232321",

            "photographerServiceAreaImages": [
                {
                    "imageName": "origin name - area",
                    "path": "storage path",
                    "width": 1024, // origin size
                    "height": 500, //origin size
                    "size": 10000000, //file size
                },
                {
                    "imageName": "origin name - area",
                    "path": "storage path",
                    "width": 1024, // origin size
                    "height": 500, //origin size
                    "size": 10000000, //file size
                },
            ],
        });*/
    CResponse.set(res, r);

});

router.put("/:serviceID", (req: Request, res: Response) => {
    const r = new PhotographerServiceModel().updateService(req.params["serviceID"], req.body);
    CResponse.set(res, r);
});

/**
 * 서비스 정보
 */
router.get("/:serviceID", (req: Request, res: Response) => {
    const r = new PhotographerServiceModel().getService(req.params["serviceID"]);
    CResponse.set(res, r);
});

module.exports= router
