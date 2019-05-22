import {BaseModel} from "./BaseModel";
import {Login, User} from "../entity/User";
import * as CryptoJS from "crypto-js";
import {BookingModel} from "./BookingModel";

export class UserModel extends BaseModel {

    public async getUsers(offset?: number | 0, limit?: number | 15): Promise<any> {
        const userRepository = this.getRepository(User);
        return await userRepository.createQueryBuilder("user")
            .orderBy("id", "DESC")
            .offset(offset).limit(limit)
            .getMany();
    }

    public async addUser(data: any): Promise<any> {
        let user: User = this.assignObjectToModel(data, User);
        let login: Login = this.assignObjectToModel(data, Login);
        // let a = 1;

        //로그인 이메일은 유니크
        const existEmail = await this.getRepository(Login).count(login.loginID as any);
        if (existEmail > 0) {
            return false;
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

            return user;
        });

        return r;
    }

    public async getUser(userID: any): Promise<any> {
        return await this.getRepository(User).findOneById(userID);
    }

    public async getUidByFirebaseUid(firebaseUid: any, type: string): Promise<any> {
        // console.log(firebaseUid, type);
        const query = this.getRepository(Login).createQueryBuilder('login');
        query.innerJoinAndSelect('login.user', 'user');
        if (type === 'photographer') {
            query.innerJoinAndSelect('user.photographer', 'photographer')
        }
        query.where('login.firebaseUid = :firebaseUid').setParameter('firebaseUid', firebaseUid);
        return await query.getOne()
    }

    /**
     * 아이디 패스워드 검증
     * @param data
     * @returns {Promise<any>}
     */
    public async compareLoginInfo(data: any): Promise<any> {
        let login: Login = this.assignObjectToModel(data, Login);
        return await this.getRepository(Login).createQueryBuilder("login")
            .innerJoinAndSelect("login.user", "user")
            .where("loginID = :loginID").setParameter("loginID", login.loginID)
            .andWhere("loginPassword = :loginPassword").setParameter("loginPassword", CryptoJS.SHA3(login.loginPassword).toString())
            .getOne();
    }


    public async getUserUid(uid: any): Promise<any> {
        return await this.getRepository(User).findOne({uid: uid});
    }

    public async getDashboard(userID: any): Promise<any> {

        const bookingModel = new BookingModel();

        //upcoming
        const request = await bookingModel.getBookingsByUser(userID, "upcoming", 1);
        const requestCount = await bookingModel.getBookingsByUserCount(userID, "upcoming");

        //message
        const message = await bookingModel.getMessagesByUser(userID, 1);
        const messageCount = await bookingModel.getMessagesByUserCount(userID);

        //need_to_upload
        const needToUpload = await bookingModel.getBookingsByPhotographer(userID, "need_to_upload", 1);
        const needToUploadCount = await bookingModel.getBookingsByPhotographerCount(userID, "need_to_upload");

        return {
            upcoming: request,
            upcomingCount: requestCount,
            message: message,
            messageCount: messageCount,
            needToUpload: needToUpload,
            needToUploadCount: needToUploadCount,
        };
    }

    public async updateUser(uid: any, data: any): Promise<any> {
        let user: User = this.assignObjectToModel(data, User);
        delete user.id;

        return this.transaction(async entityManager => {
            return entityManager.getRepository(User).updateById(uid, user);
        });

    }
}
