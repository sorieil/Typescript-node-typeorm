import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { NextFunction, Request, Response, Router } from "express";
import * as express from "express";
import * as logger from "morgan";
const cors = require("cors");
import * as Landing from "./component/Landing";
import * as Users from "./component/Users";
import * as Accounts from "./component/Accounts";
import * as Photographers from "./component/Photographers";
import * as CommonCodes from "./component/CommonCodes";
import * as Bookings from "./component/Bookings";
import * as Services from "./component/Services";
import * as Signup from "./component/Signup";
// Creates and configures an ExpressJS web server.
export class App {

    // ref to Express instance
    public express: any;
    // Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger("dev"));

        const corsOptions = {
            origin:  '*', // 이 주소가 서버가 동작하는 주소
            credentials: false,
            methods: ['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'],
            allowedHeaders: "Access-Control-Allow-Headers, Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept, x-access-token, Authorization"
        };

        this.express.use(cors(corsOptions));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cookieParser());
    }

    // 혀용한 서버만 접속 가능
    // private corsOptionsDelegate(req: Request, callback: any) {
    //     let corsOptions = {};
    //     // tslint:disable-next-line:max-line-length
    //     const whiteLists = ["http://localhost:8083",
    //         "http://localhost:8080",
    //         "https://test-england.firebaseapp.com",
    //         "https://test-7beb1.firebaseapp.com"];
    //     // const ip = req.header("Origin");
    //     // console.log("try from ip: ", ip);
    //     if (whiteLists.indexOf(req.header("Origin")) !== -1) {
    //         corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    //     } else {
    //         corsOptions = { origin: false }; // disable CORS for this request
    //     }
    //
    //     corsOptions = {
    //         origin: "*",
    //     };
    //
    //     callback(null, corsOptions);
    // }

    // Configure API endpoints.
    private routes(): void {
        /* This is just to get up and running, and to make sure what we"ve got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        const router = Router();
        // placeholder route handler
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            // res.send("_");
            res.send("This is test api");
        });

        this.express.use("/", router);
        this.express.use("/users", Users);
        this.express.use("/photographers", Photographers);
        this.express.use("/landing", Landing);
        this.express.use("/accounts", Accounts);
        this.express.use("/commoncodes", CommonCodes);
        this.express.use("/bookings", Bookings);
        this.express.use("/services", Services);
        this.express.use("/signup", Signup);
        this.express.use('/.well-known', express.static(__dirname + '/../.well-known'));
    }
}

export default new App().express;
