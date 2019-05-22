import {BaseModel} from "./BaseModel";
import {Photographer, PhotographerAvailability, PhotographerHoliday} from "../entity/Photographer";
import {Login, User} from "../entity/User";
import * as CryptoJS from "crypto-js";
import {Booking} from "../entity/Booking";
import {BookingModel, BookingStatus} from "./BookingModel";
import {DeepPartial} from "typeorm/common/DeepPartial";


export class PhotographerModel extends BaseModel {

    public async addPhotographer(data: any): Promise<any> {
        let user: User = this.assignObjectToModel(data, User);
        let login: Login = this.assignObjectToModel(data, Login);
        let photographer: Photographer = this.assignObjectToModel(data, Photographer);

        //로그인 이메일은 유니크
        const countOption:DeepPartial<any> = {loginID: login.loginID} as any;
        const existEmail = await this.getRepository(Login).count(countOption);
        if (existEmail > 0) {
            return false;
        }

        //availablity 데이터를 생성한 후 저장 - 기본값
        const availablity: any = [];
        for(let i = 0; i < 7; i++) {
            const a = new PhotographerAvailability();
            a.dayOfWeek = i;
            a.am = 0;
            a.pm = 0;
            a.timeBits = "000000000000000000000000000000000000000000000000";

            availablity.push(a);
        }

        //유저정보 저장
        let r = this.transaction(async entityManager => {

            await entityManager.save(user);
            login.user = user;

            //패스워드 암호화
            login.loginPassword = CryptoJS.SHA3(login.loginPassword).toString();

            /*
            if (a === 1) {
                return Promise.reject(false);
            }*/

            await entityManager.save(login);

            // photographer.user = user;
            // await entityManger.save(photographer);

            photographer.user = user;
            photographer.availability = availablity; // CResponse 에서 분석을 못함.
            await entityManager.save(photographer);
            return photographer;
        });

        return r;
    }

    //관리자에서 사용될듯..
    public async getPhotographers(offset?: number | 0, limit?: number | 15) {
        return await this.getRepository(Photographer).createQueryBuilder("photographer")
            .innerJoinAndSelect("photographer.user", "user")
            .orderBy("photographer.id", "DESC")
            .offset(offset).limit(limit)
            .getMany();
    }

    public async getPhotographer(userID: number): Promise<any> {
        return await this.getRepository(Photographer).createQueryBuilder("photographer")
            .innerJoinAndSelect("photographer.user", "user")
            .where("user.id = :userID").setParameter("userID", userID)
            .getOne();
    }

    public async getBookings(photographerID: number, status?: BookingStatus): Promise<any> {
        let r = this.getRepository(Booking).createQueryBuilder("booking")
            .innerJoin("booking.photographer", "photographer")
            .where("photographer.id = :photographerID")
            .setParameter("photographerID", photographerID);

            if (typeof status !== "undefined") {
                r.andWhere("booking.status = :bookingStatus").setParameter("bookingStatus", status);
            }

        return await r.getMany();
    }

    public async getAvailablity(photographerID: number): Promise<any> {
        return await this.getRepository(PhotographerAvailability).createQueryBuilder("pa")
            .where("pa.photographerID = :photographerID").setParameter("photographerID", photographerID)
            .orderBy("pa.dayOfWeek", "ASC").getMany();
    }

    public async setAvailablity(photographerID: number, data: any): Promise<any> {

        const r = this.transaction(async entityManager => {

            let ar = await entityManager.getRepository(PhotographerAvailability);
            const ars = await ar.createQueryBuilder("pa")
                .where("pa.photographerID = :photographerID").setParameter("photographerID", photographerID)
                .orderBy("pa.dayOfWeek", "ASC").getMany();


            for(let i = 0; i < 7; i++) {
                ars[i].am = data[i].am;
                ars[i].pm = data[i].pm;
                ars[i].timeBits = data[i].timeBits;
                ar.save(ars[i]);
            }

            return ars;
        });

        return r;
    }

    public async getHoliday(photographerID: number): Promise<any> {

        const now: Date = new Date();
        const year: any = now.getFullYear();
        const month: any = now.getMonth() + 1;

        return await this.getRepository(PhotographerHoliday).createQueryBuilder("ph")
            .where("ph.photographerID = :photographerID").setParameter("photographerID", photographerID)
            .andWhere("ph.year = :year").setParameter("year",year)
            .andWhere("ph.month = :month").setParameter("month",month)
            .getOne();

    }

    public async setHoliday(photographerID: number, data: any): Promise<any> {

        const now: Date = new Date();
        const year: any = now.getFullYear();
        const month: any = now.getMonth() + 1;

        const r = this.transaction(async entityManager => {

            let ph = await entityManager.getRepository(PhotographerHoliday);
            let h: PhotographerHoliday = await this.getHoliday(photographerID);
            if (typeof h !== "undefined") {
                ph.removeById(h.id);
            }

            let newPh: PhotographerHoliday = new PhotographerHoliday();
            newPh.year = year;
            newPh.month = month;
            newPh.daies = data.daies;
            newPh.photographer = await entityManager.getRepository(Photographer).findOneById(photographerID);

            return ph.save(newPh);
        });

        return r;

    }

    public async getDashboard(photographerID: any): Promise<any> {

        const bookingModel = new BookingModel();

        //request
        const request = await bookingModel.getBookingsByPhotographer(photographerID, "request", 1);
        const requestCount = await bookingModel.getBookingsByPhotographerCount(photographerID, "request");
        console.log('request', request);
        //upcoming
        const upcoming = await bookingModel.getBookingsByPhotographer(photographerID, "upcoming", 1);
        const upcomingCount = await bookingModel.getBookingsByPhotographerCount(photographerID, "upcoming");
        console.log('upcoming', upcoming);

        //message
        const message = await bookingModel.getMessagesByPhotographer(photographerID, 1);
        const messageCount = await bookingModel.getMessagesByPhotographerCount(photographerID);
        console.log('upcoming', message);
        //need_to_upload
        const needToUpload = await bookingModel.getBookingsByPhotographer(photographerID, "need_to_upload", 1);
        const needToUploadCount = await bookingModel.getBookingsByPhotographerCount(photographerID, "need_to_upload");
        console.log('needToUpload', needToUpload);

        return {
            request: request,
            requestCount: requestCount,
            upcoming: upcoming,
            upcomingCount: upcomingCount,
            message: message,
            messageCount: messageCount,
            needToUpload: needToUpload,
            needToUploadCount: needToUploadCount,
        };
    }
}
