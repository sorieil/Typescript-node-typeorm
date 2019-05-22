import * as debug from "debug";
import * as http from "https";
import "reflect-metadata";
import {createConnection} from "typeorm";
import {App} from "./App";
import * as fs from "fs";

createConnection({
    type: "mysql",
    name: "default",
    driver: {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "test",
        password: "test123!",
        database: "test",
    },
    logging: {
        logQueries: true,
        logFailedQueryError: true,
    },
    autoSchemaSync: true,
    entities: [
        __dirname + "/entity/*",
    ],
    cli: {
        entitiesDir: __dirname + "/entity",
    },
}).then(async () => {
    const app = new App().express;
    debug("test-api");

    function normalizePort(val: number | string): number | string | boolean {
        const port: number = (typeof val === "string") ? parseInt(val, 10) : val;
        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }

    function onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== "listen") {
            throw error;
        }
        const bind = (typeof port === "string") ? "Pipe " + port : "Port " + port;
        switch (error.code) {
            case "EACCES":
                debug(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case "EADDRINUSE":
                debug(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    function onListening(): void {
        const addr = server.address();
        const bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
        debug(`Listening on ${bind}`);
    }

    // app.set("jsonp callback name", "callback");

    const options = {
        key: fs.readFileSync("/etc/letsencrypt/live/api.test.com/privkey.pem", "utf-8"),
        cert: fs.readFileSync("/etc/letsencrypt/live/api.test.com/fullchain.pem", "utf-8"),
    };

    const port = normalizePort(443);
    app.set("port", port);
    const server = http.createServer(options, app);
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
}).catch((error: any) => console.log(error));
