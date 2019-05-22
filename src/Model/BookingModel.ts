import {BaseModel} from "./BaseModel";
import {Album, Booking} from "../entity/Booking";
import {Photographer, PhotographerService, PhotographerServiceReview} from "../entity/Photographer";
import {User} from "../entity/User";
import {Message, MessageDetail} from "../entity/Message";
import {Image} from "../entity/Common";

export declare type BookingStatus = "request" | "rejected" | "accepted" | "need_to_upload" | "complete";

export class BookingModel extends BaseModel {

    /**
     * Adds a booking.
     * @param data
     * @returns {Promise<any>}
     */
    public async addBooking(data: any): Promise<any> {

        const booking: Booking = this.assignObjectToModel(data, Booking);

        let user: User = await this.getRepository(User).findOneById(data.userID);
        let photographer: Photographer = await this.getRepository(Photographer).findOneById(data.photographerID);
        let photographerService: PhotographerService = await this.getRepository(PhotographerService).findOneById(data.photographerServiceID);

        return await this.transaction(async entityManager => {

            //날짜 입력
            booking.rejectedAt = new Date();

            booking.user = user;
            booking.photographer = photographer;
            booking.photographerService = photographerService;

            return await entityManager.save(booking);
        });
    }

    /**
     * Load all the user's bookings.
     * @param {number} userID
     * @param {string} query
     * @returns {Promise<any>}
     */
    public async getBookingsByUser(userID: number, query?: string, limit?: number): Promise<any> {
        let r = this.getRepository(Booking).createQueryBuilder("booking")
            .innerJoinAndSelect("booking.user", "user")
            // .innerJoinAndSelect("booking.photographerService", "service")
            .innerJoinAndSelect("booking.photographer", "photographer")
            .innerJoinAndSelect("photographer.user", "p_user")
            .where("booking.user = :userID").setParameter("userID", userID);

        if (typeof query !== "undefined") {

            if (query === "upcoming") {

                r.andWhere("booking.status = 'request'");
                r.orWhere("booking.status = 'accepted'");

            } else if (query === "previous") {

                r.andWhere("booking.status = 'rejected'");
                r.orWhere("booking.status = 'complete'");
                r.orWhere("booking.status = 'need_to_upload'");

            } else if (query === "need_to_upload") {

                r.andWhere("booking.status = 'need_to_upload'");
                r.andWhere("booking.status = 'complete'");

            } else {
                r.andWhere("booking.status = '" + query + "'")
            }
        }

        if (limit === 1) {
            r.orderBy("booking.updatedAt", "DESC");
            return r.getOne();
        }

        return await r.getMany();
    }

    public async getBookingsByUserCount(userID: number, query?: string): Promise<any> {
        let r = this.getRepository(Booking).createQueryBuilder("booking")
            .innerJoinAndSelect("booking.user", "user")
            // .innerJoinAndSelect("booking.photographerService", "service")
            .where("booking.user = :userID").setParameter("userID", userID);

        if (typeof query !== "undefined") {

            if (query === "upcoming") {

                r.andWhere("booking.status = 'request'");
                r.orWhere("booking.status = 'accepted'");

            } else if (query === "previous") {

                r.andWhere("booking.status = 'rejected'");
                r.orWhere("booking.status = 'complete'");
                r.orWhere("booking.status = 'need_to_upload'");

            } else if (query === "need_to_upload") {

                r.andWhere("booking.status = 'need_to_upload'");
                r.andWhere("booking.status = 'complete'");

            } else {
                r.andWhere("booking.status = '" + query + "'")
            }
        }

        return await r.getCount();
    }

    /**
     * Load all the photographer's bookings.
     * @param {number} photographerID
     * @param {string} query
     * @returns {Promise<any>}
     */
    public async getBookingsByPhotographer(photographerID: number, query?: string, limit?: number): Promise<any> {
        let r = this.getRepository(Booking).createQueryBuilder("booking")
            .innerJoinAndSelect("booking.user", "user")
            // .innerJoinAndSelect("booking.photographerService", "service")
            .where("booking.photographer = :photographerID").setParameter("photographerID", photographerID);


        if (typeof query !== "undefined") {

            if (query === "upcoming") {

                r.andWhere("booking.status = 'accepted'");

            } else if (query === "previous") {

                // r.andWhere("booking.status = 'rejected'");
                r.andWhere("booking.status = 'complete'");
                r.orWhere("booking.status = 'need_to_upload'");

            } else if (query === "need_to_upload") {

                r.andWhere("booking.status = 'need_to_upload'");
                r.orWhere("booking.status = 'complete'");

            } else {
                r.andWhere("booking.status = '" + query + "'")
            }
        }

        if (limit === 1) {
            r.orderBy("booking.updatedAt", "DESC");
            return r.getOne();
        }

        return await r.getMany();
    }

    public async getBookingsByPhotographerCount(photographerID: number, query?: string): Promise<any> {
        let r = this.getRepository(Booking).createQueryBuilder("booking")
            .innerJoinAndSelect("booking.user", "user")
            // .innerJoinAndSelect("booking.photographerService", "service")
            .where("booking.photographer = :photographerID").setParameter("photographerID", photographerID);


        if (typeof query !== "undefined") {

            if (query === "upcoming") {

                r.andWhere("booking.status = 'accepted'");

            } else if (query === "previous") {

                // r.andWhere("booking.status = 'rejected'");
                r.andWhere("booking.status = 'complete'");
                r.orWhere("booking.status = 'need_to_upload'");

            } else if (query === "need_to_upload") {

                r.andWhere("booking.status = 'need_to_upload'");
                r.orWhere("booking.status = 'complete'");

            } else {
                r.andWhere("booking.status = '" + query + "'")
            }
        }

        return await r.getCount();
    }

    /**
     * Changes status about booking.
     * @param {number} bookingID
     * @param {string} toStatus
     * @returns {Promise<any>}
     */
    public async changeBookingStatus(bookingID: number, toStatus: string): Promise<any> {

        const repo = this.getRepository(Booking);
        let booking: Booking = await repo.findOneById(bookingID);
        booking.status = toStatus;

        const now = new Date();
        if (toStatus === "requested") {
            booking.rejectedAt = now;
        } else if (toStatus === "rejected") {
            booking.requestedAt = now;
        } else if (toStatus === "accepted") {
            booking.acceptedAt = now;
        } else if (toStatus === "need_to_upload") {
            booking.needToUploadAt = now;
        } else if (toStatus === "complete") {
            booking.completedAt = now;
        }

        return await repo.save(booking);

    }

    /**
     * Load the user's all a messages.
     * @param {number} userID
     * @returns {Promise<any>}
     */
    public async getMessagesByUser(userID: number, limit?: number): Promise<any> {

        const subQuery = await this.getRepository(Message).query(`
            Select md.id
            FROM message_details md
            INNER JOIN (
            	Select metaId, max(id) as maxID from message_details group by metaId 
            ) md2 ON md.id = md2.maxID AND md.metaId = md2.metaId
            INNER JOIN messages msg ON msg.id = md.metaId
            INNER JOIN photographers p ON p.id = msg.photographerId
            INNER JOIN users up ON up.id = p.userId
            WHERE msg.userId = ?
            ORDER BY md.id DESC
        `, [userID]);

        let q = this.getRepository(MessageDetail).createQueryBuilder("md")
            .select(["md", "msg", "photographer", "user", "booking"])
            .innerJoin("md.meta", "msg")
            .innerJoin("msg.booking", "booking")
            .innerJoin("msg.photographer", "photographer")
            .innerJoin("photographer.user", "user")
            .whereInIds(subQuery)
            .orderBy("md.id", "DESC");

        if (limit === 1) {
            return await q.getOne();
        }

        return await q.getMany();
    }

    public async getMessagesByUserCount(userID: number): Promise<any> {

        const subQuery = await this.getRepository(Message).query(`
            Select md.id
            FROM message_details md
            INNER JOIN (
            	Select metaId, max(id) as maxID from message_details group by metaId 
            ) md2 ON md.id = md2.maxID AND md.metaId = md2.metaId
            INNER JOIN messages msg ON msg.id = md.metaId
            INNER JOIN photographers p ON p.id = msg.photographerId
            INNER JOIN users up ON up.id = p.userId
            WHERE msg.userId = ?
            ORDER BY md.id DESC
        `, [userID]);

        let q = this.getRepository(MessageDetail).createQueryBuilder("md")
            .select(["md", "msg", "photographer", "user", "booking"])
            .innerJoin("md.meta", "msg")
            .innerJoin("msg.booking", "booking")
            .innerJoin("msg.photographer", "photographer")
            .innerJoin("photographer.user", "user")
            .whereInIds(subQuery)

        return await q.getCount();
    }

    /**
     * Load the Photographer's all a messages.
     * @param {number} photographerID
     * @returns {Promise<any>}
     */
    public async getMessagesByPhotographer(photographerID: number, limit?: number): Promise<any> {
        const subQuery = await this.getManager().query(`
            Select md.id
            FROM message_details md
            INNER JOIN (
            	Select metaId, max(id) as maxID from message_details group by metaId
            ) md2 ON md.id = md2.maxID AND md.metaId = md2.metaId
            INNER JOIN messages msg ON msg.id = md.metaId
            WHERE msg.photographerId = ?
            `, [photographerID]);

        let q = this.getRepository(MessageDetail).createQueryBuilder("md")
            .select(["md", "msg", "booking", "user"])
            .innerJoin("md.meta", "msg")
            .innerJoin("msg.user", "user")
            .innerJoin("msg.booking", "booking")
            .whereInIds(subQuery)
            .orderBy("md.id", "DESC");

            if (limit === 1) {
                return await q.getOne();
            }

            return await q.getMany();
    }

    public async getMessagesByPhotographerCount(photographerID: number): Promise<any> {

        const subQuery = await this.getManager().query(`
            Select md.id
            FROM message_details md
            INNER JOIN (
            	Select metaId, max(id) as maxID from message_details group by metaId
            ) md2 ON md.id = md2.maxID AND md.metaId = md2.metaId
            INNER JOIN messages msg ON msg.id = md.metaId
            WHERE msg.photographerId = ?
        `, [photographerID]);

        let q = this.getRepository(MessageDetail).createQueryBuilder("md")
            .select(["md", "msg", "booking", "user"])
            .innerJoin("md.meta", "msg")
            .innerJoin("msg.user", "user")
            .innerJoin("msg.booking", "booking")
            .whereInIds(subQuery)
            .orderBy("md.id", "DESC");

        return await q.getCount();
    }

    // 유저가 보낸 매세지 중 읽지 않은 갯수
    public async getUnreadMessageCountByPhotographer(photographerID: number): Promise<any> {
        const q = this.getRepository(MessageDetail).createQueryBuilder("md")
            .select("Count(*)")
            .innerJoin("md.meta", "msg")
            .where("msg.photographerId = :photographerID").setParameter("photographerID", photographerID)
            .andWhere("md.writerType = :writerType").setParameter("writerType", "user")
            .andWhere("md.isRead = :isRead").setParameter("isRead", false);

        return await q.getCount();
    }

    // 포토그래퍼가 보낸 메세지 중 읽지 않은 갯수
    public async getUnreadMessageCountByUser(userID: number): Promise<any> {
        const q = this.getRepository(MessageDetail).createQueryBuilder("md")
            .select("Count(*)")
            .innerJoin("md.meta", "msg")
            .where("msg.userId = :userID").setParameter("userID", userID)
            .andWhere("md.writerType = :writerType").setParameter("writerType", "photographer")
            .andWhere("md.isRead = :isRead").setParameter("isRead", false);

        return await q.getCount();
    }

    /**
     * Loads a messages by BookingID.
     * @param {number} bookingID
     * @returns {Promise<any>}
     */
    public async getMessage(bookingID: number, type: "user" | "photographer"): Promise<any> {

        const r = await this.getRepository(MessageDetail).createQueryBuilder("md")
            .innerJoinAndSelect("md.meta", "msg")
            .innerJoinAndSelect("msg.booking", "booking")
            .innerJoinAndSelect("msg.user", "user")
            .innerJoinAndSelect("msg.photographer", "photographer")
            .innerJoinAndSelect("photographer.user", "pu")
            .where("msg.bookingId = :bookingID").setParameter("bookingID", bookingID)
            .orderBy("md.createdAt", "DESC")
            .getMany();

        if (r.length > 0) {

            await this.transaction(async entityManager => {
                await entityManager.getRepository(MessageDetail).createQueryBuilder("md")
                    .where("metaId = :metaID").setParameter("metaID", r[0].meta.id)
                    .andWhere("writerType = :writerType").setParameter("writerType", (type === "user") ? "photographer" : "user")
                    .update(MessageDetail)
                    .set({isRead: true})
                    .execute();
            });

        }

        return r;
    }

    /**
     * The user adds a message.
     * @param {number} bookingID
     * @param {number} userID
     * @param message
     * @returns {Promise<any>}
     */
    public async addMessageByUser(bookingID: number, userID: number, message: any): Promise<any> {

        const repo = this.getRepository(Message);
        let messageContainer = await repo.createQueryBuilder("msg")
            .innerJoinAndSelect("msg.details", "details")
            .where("msg.booking = :bookingID").setParameter("bookingID", bookingID)
            .getOne();

        if (typeof messageContainer === "undefined") {

            const booking = await this.getRepository(Booking).createQueryBuilder("booking")
                .innerJoinAndSelect("booking.photographer", "photographer")
                .innerJoinAndSelect("booking.user", "user")
                .innerJoinAndSelect("booking.photographerService", "photographerService")
                .where("booking.id = :bookingID").setParameter("bookingID", bookingID).getOne();

            messageContainer = new Message();
            messageContainer.user = await this.getRepository(User).findOneById(booking.user.id);
            messageContainer.photographer = await this.getRepository(Photographer).findOneById(booking.photographer.id);
            messageContainer.photographerService = await this.getRepository(PhotographerService).findOneById(booking.photographerService.id);
            messageContainer.booking = booking;
            messageContainer.details = [];
        }

        const messageDetail = new MessageDetail();
        messageDetail.meta = messageContainer;
        messageDetail.writerType = "user";
        messageDetail.message = message;

        messageContainer.details.push(messageDetail);

        await repo.save(messageContainer);

        return await this.getMessage(bookingID, "user");
    }

    /**
     * The photographer adds a message.
     * @param {number} bookingID
     * @param {number} photographerID
     * @param {string} message
     * @returns {Promise<any>}
     */
    public async addMessageByPhotographer(bookingID: number, photographerID: number, message: string): Promise<any> {

        const repo = this.getRepository(Message);
        let messageContainer = await repo.createQueryBuilder("msg")
            .innerJoinAndSelect("msg.details", "details")
            .where("msg.bookingId = :bookingID").setParameter("bookingID", bookingID)
            .getOne();

        if (typeof messageContainer === "undefined") {

            const booking = await this.getRepository(Booking).createQueryBuilder("booking")
                .innerJoinAndSelect("booking.photographer", "photographer")
                .innerJoinAndSelect("booking.user", "user")
                .innerJoinAndSelect("booking.photographerService", "photographerService")
                .where("booking.id = :bookingID").setParameter("bookingID", bookingID).getOne();

            messageContainer = new Message();
            messageContainer.user = await this.getRepository(User).findOneById(booking.user.id);
            messageContainer.photographer = await this.getRepository(Photographer).findOneById(booking.photographer.id);
            messageContainer.photographerService = await this.getRepository(PhotographerService).findOneById(booking.photographerService.id);
            messageContainer.booking = booking;
            messageContainer.details = [];
        }

        const messageDetail = new MessageDetail();
        messageDetail.meta = messageContainer;
        messageDetail.writerType = "photographer";
        messageDetail.message = message;

        messageContainer.details.push(messageDetail);

        await repo.save(messageContainer);

        return await this.getMessage(bookingID, "photographer");
    }

    public async editBookingUser(userID: number, data: Booking): Promise<any> {
        let booking: Booking = this.assignObjectToModel(data, Booking);
        const bookingID = booking.id;
        delete booking.id;

        return this.transaction(async entityManager => {
            return entityManager.getRepository(Booking).createQueryBuilder("booking").
            where("booking.user = :userID", {userID: userID})
                .andWhere("booking.id = :bookingID", {bookingID: bookingID})
                .update(booking).execute();
        });
    }

    public async editBookingPhotographer(photographerID: number, data: Booking): Promise<any> {
        let booking: Booking = this.assignObjectToModel(data, Booking);
        const bookingID = booking.id;
        delete booking.id;

        return this.transaction(async entityManager => {
            return entityManager.getRepository(Booking).createQueryBuilder("booking").
            where("booking.photographer = :photographerID", {photographerID: photographerID})
                .andWhere("booking.id = :bookingID", {bookingID: bookingID})
                .update(booking).execute();
        });
    }

    public async getAlbums(userID: any): Promise<any> {
        return await this.getRepository(Album).createQueryBuilder("album")
            .innerJoinAndSelect("album.booking", "booking")
            .innerJoinAndSelect("booking.user", "user")
            .innerJoinAndSelect("booking.photographer", "photographer")
            .innerJoinAndSelect("photographer.user", "photographer_user")
            .leftJoinAndSelect("photographer.area", "photographer_area")
            .leftJoinAndSelect("album.images", "images")
            .leftJoinAndSelect("booking.review", "review")
            .where("user.id = :userID", { userID: userID })
            .getMany();
    }

    public async getAlbum(bookingID: any): Promise<any> {
        return await this.getRepository(Album).createQueryBuilder("album")
            .innerJoinAndSelect("album.booking", "booking")
            .innerJoinAndSelect("booking.user", "user")
            .innerJoinAndSelect("booking.photographer", "photographer")
            .innerJoinAndSelect("photographer.user", "photographer_user")
            .leftJoinAndSelect("album.images", "images")
            .leftJoinAndSelect("booking.review", "review")
            .where("booking.id = :bookingID", { bookingID: bookingID })
            .getOne();
    }

    public async addAlbum(bookingID: any, data: any): Promise<any> {

        //서비스 이미지 배열 생성
        let albumImages: Array<Image> = new Array<Image>();
        if (typeof data["albumImages"] !== "undefined") {
            for (let image of data["albumImages"]) {
                albumImages.push(this.assignObjectToModel(image, Image));
            }
        }

        return this.transaction(async entityManager => {

            let booking = await entityManager.getRepository(Booking).createQueryBuilder("booking")
                .select(["booking", "user.id", "ps.id"])
                .innerJoin("booking.user", "user")
                .innerJoin("booking.photographerService", "ps")
                .where("booking.id = :bookingID", {bookingID: bookingID})
                .getOne();

            let user = await entityManager.findOneById(User, booking.user.id);
            let service = await entityManager.findOneById(PhotographerService, booking.photographerService.id)

            // if (area.id) {
            //     await entityManager.getRepository(Image).createQueryBuilder("images")
            //         .where("photographerServiceAreaId = :areaID", {areaID: area.id}).delete().execute();
            // }

            //서비스 이미지 저장

            let album = new Album();

            let si: Image[] = [];
            for (let image of albumImages) {
                await entityManager.save(image);
                si.push(image);
            }

            album.images = si;
            album.booking = booking;
            album.user = user;
            album.photographerService = service;
            await entityManager.save(album);

            return true;
        });
    }

    public async addReview(bookingID: any, data: any): Promise<any> {

        let booking = await this.getRepository(Booking).createQueryBuilder("booking")
            .select(["booking.id", "photographer.id", "user.id", "service.id"])
            .innerJoin("booking.user", "user")
            .innerJoin("booking.photographer", "photographer")
            .innerJoin("booking.photographerService", "service")
            .where("booking.id = :bookingID", {bookingID: bookingID})
            .getOne();

        let pg = await this.getRepository(Photographer).findOneById(booking.photographer.id);
        let user = await this.getRepository(User).findOneById(booking.user.id);
        let service = await this.getRepository(PhotographerService).findOneById(booking.photographerService.id);

        const count = await this.getRepository(PhotographerServiceReview).createQueryBuilder("review")
            .where("review.photographerServiceId = ?", {photographerServiceId: service.id})
            .getCount();

        const sumRating = await this.getRepository(PhotographerServiceReview).createQueryBuilder("review")
            .select("SUM(review.grade)", "sum")
            .where("review.photographerServiceId = :photographerServiceId", {photographerServiceId: service.id})
            .getRawOne();

        const averageRating = sumRating + data.grade / count + 1;


        return this.transaction(async entityManager => {

            service.averageRating = averageRating;
            await entityManager.getRepository(PhotographerService).save(service);

            let review: PhotographerServiceReview = new PhotographerServiceReview();
            review.photographer = pg;
            review.user = user;
            review.booking = booking;
            review.photographerService = service;
            review.review = data.review;
            review.report = data.report;
            review.grade = data.grade;

            return await entityManager.getRepository(PhotographerServiceReview).save(review);
        });


        // let review: PhotographerServiceReview = new PhotographerServiceReview();
        // review.photographer = pg;
        // review.user = user;
        // review.booking = booking;
        // review.photographerService = service;
        // review.review = data.review;
        // review.report = data.report;
        // review.grade = data.grade;
        //
        // return this.getRepository(PhotographerServiceReview).save(review);

    }
}
