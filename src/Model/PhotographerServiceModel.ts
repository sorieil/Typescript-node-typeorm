import {BaseModel} from "./BaseModel";
import {
    Photographer, PhotographerService, PhotographerServiceArea,
    PhotographerServiceReview
} from "../entity/Photographer";
import {CommonCode, Image} from "../entity/Common";
import {User, UserSavedPhorographer} from "../entity/User";

export interface PhotographerServiceSearchOptions {

    photographerID?: number; //이 값이 설정되면 다른값은 무시된다.
    keyword?: string; //작가명을 검색
    date?: string;
    city?: string;
    whatFor?: string;
    time?: string;
    priceRange?: any;
    sort?: string;
    language?: string[];
    offset?: number | 0;
    limit?: number | 20;
}

export class PhotographerServiceModel extends BaseModel {

    public async searchServices(searchOptions?: PhotographerServiceSearchOptions) {

        //검색 조건은 추후 추가
        //평점은 추후 추가

        let query = this.getRepository(PhotographerService).createQueryBuilder("service");
            query.innerJoinAndSelect("service.photographer", "photographer")
            .innerJoinAndSelect("photographer.user", "user")
            .innerJoinAndSelect("photographer.area", "area")
            .where("service.deleted = :deleted", {deleted: false});

            if (searchOptions.priceRange) {
                const priceRange = JSON.parse(searchOptions.priceRange);
                query.andWhere("service.price >= :startPrice").setParameter("startPrice", priceRange.start);
                query.andWhere("service.price <= :endPrice").setParameter("endPrice", priceRange.end);
            }

            if (searchOptions.keyword) {
                query.andWhere("user.firstname like :keyword").setParameter("keyword", "%" + searchOptions.keyword + "%");
                query.orWhere("user.lastname like :keyword").setParameter("keyword", "%" + searchOptions.keyword + "%");
            }

            if (searchOptions.language) {
                query.innerJoin("photographer.languages", "language");
                query.andWhere("language.id = :language").setParameter("language", searchOptions.language);
            }

            if (searchOptions.sort) {
                const sort = searchOptions.sort;
                if (sort === "price_desc") {
                    query.orderBy("service.price", "DESC");
                } else if(sort === "price_asc") {
                    query.orderBy("service.price", "ASC");
                } else if(sort === "rating_desc") {
                    query.orderBy("service.averageRating", "DESC");
                } else if(sort === "rating_asc") {
                    query.orderBy("service.averageRating", "ASC");
                }
            }
            console.log('searchOptions.whatFor:', searchOptions.whatFor)
            if (searchOptions.whatFor) {
                query.andWhere("service.speciality = :specialityId").setParameter("specialityId", searchOptions.whatFor);
            }

            if(searchOptions.city) {
                query.andWhere('area.city = :city').setParameter('city', searchOptions.city)
            }

            if (searchOptions.date) {

                // const now: Date = new Date();


                let tmp: any = searchOptions.date.split("-");
                const year: any = tmp[2];
                const month: any = tmp[1];
                const day: any = tmp[0];

                query.innerJoin("photographer.holidaies", "hd");
                query.andWhere("hd.year = :year").setParameter("year", year);
                query.andWhere("hd.month = :month").setParameter("month", month);
                query.andWhere("hd.daies like :day").setParameter("day", "%," + day + ",%");
            }

            if (searchOptions.time) {

                let tmp: any = searchOptions.time.split("-");
                const st: number = parseInt(tmp[0], 10);
                const et: number = parseInt(tmp[1], 10);
                const startTime: any = {
                    type: (st > 23) ? "pm" : "am",
                    time: (st > 23) ? st - 24 : st,
                };

                const endTime: any = {
                    type: (et > 23) ? "pm" : "am",
                    time: (et > 23) ? et - 24 : et,
                };

                // let timeRange: any = new Array(2).fill(0);
                let amData: number = 0;
                let pmData: number = 0;
                if (st < et) {

                    if (startTime.type === "am" && endTime.type === "pm") {
                        for (let i = startTime.time; i < 24; i++) { //am 처리
                            console.log(1 << i);
                            amData |= 1 << i;
                        }

                        for (let i = 0; i < endTime.time; i++) {
                            pmData |= 1 << i;
                        }
                    } else if (startTime.type === "am" && endTime.type === "am") {
                        for (let i = startTime.time; i < endTime.time; i++) {
                            amData |= 1 << i;
                        }
                    } else {
                        for (let i = startTime.time; i < endTime.time; i++) {
                            pmData |= 1 << i;
                        }
                    }

                } else {
                    //이 경우는 한 가지 경우 밖에 없다.
                    //endTime이 자정일 경우
                }

                let dayofweek: number;
                if (searchOptions.date) {

                    let tmp: any = searchOptions.date.split("-");
                    const year: any = tmp[2];
                    const month: any = tmp[1];
                    const day: any = tmp[0];

                    dayofweek = new Date(year, month, day).getDay();

                } else {
                    const now: Date = new Date();
                    dayofweek = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getDay();
                }

                if (dayofweek === 0) {
                    dayofweek = 6;
                } else {
                    dayofweek = dayofweek - 1;
                }

                query.innerJoin("photographer.availability", "av");
                query.andWhere("av.dayOfWeek = :dayofweek").setParameter("dayofweek", dayofweek);

                if (amData > 0) {
                    query.andWhere("BIT_COUNT(av.am & :amData) > 0").setParameter("amData", amData);
                }

                if (pmData > 0) {
                    query.andWhere("BIT_COUNT(av.pm & :amData) > 0").setParameter("pmData", amData);
                }
            }

        return query.getMany();
        //
        // for(let i: number = 0; i < r.length; i++) {
        //
        //     const service = r[i];
        //
        //     const query2 = this.getRepository(PhotographerServiceReview).createQueryBuilder("review");
        //     query2.select("avg(review.grade) grade").where("review.photographerService.id = :serviceID");
        //     query2.setParameter("serviceID", service.id);
        //     const r2 = await query2.getRawOne();
        //
        //     service.grade = (typeof r2 === "undefined") ? 0 : r2.grade;
        // }

        // return r;
    }

    public async getServices(photographerID: any): Promise<any> {
        return await this.getRepository(PhotographerService).createQueryBuilder("service")
            .innerJoinAndSelect("service.images", "image")
            .innerJoinAndSelect("service.photographer", "photographer")
            .innerJoinAndSelect("photographer.user", "user")
            .innerJoinAndSelect("service.speciality", "speciality")
            .leftJoinAndSelect("service.reviews", "review")
            .where("photographer.id = :photographerID", {photographerID: photographerID})
            .andWhere("service.deleted = :deleted", {deleted: false})
            .getMany();
    }

    public async getService(serviceID: any): Promise<any> {

        // 평가 합산 가져오기
        const query2 = this.getRepository(PhotographerServiceReview).createQueryBuilder("review");
        query2.select("avg(review.grade) grade").where("review.photographerService.id = :serviceID");
        query2.setParameter("serviceID", serviceID);
        const r2 = await query2.getRawOne();

        // 리뷰 가져오기
        const reviews = await this.getRepository(PhotographerServiceReview)
            .createQueryBuilder("review")
            .innerJoinAndSelect("review.user", "user")
            .where("review.photographerService = :serviceId")
            .setParameter("serviceId", serviceID)
            .getMany();

        const grade = (typeof r2 === "undefined") ? 0 : r2.grade;

        const r = await this.getRepository(PhotographerService).createQueryBuilder("service")
            .innerJoinAndSelect("service.images", "image")
            .innerJoinAndSelect("service.photographer", "photographer")
            .innerJoinAndSelect("photographer.languages", "languages")
            .innerJoinAndSelect("photographer.user", "user")
            .innerJoinAndSelect("service.speciality", "speciality")
            .innerJoinAndSelect("photographer.area", "area")
            .leftJoinAndSelect("area.images", "images")
            .where("service.id = :id")
            .andWhere("service.deleted = :deleted", {deleted: false})
            .setParameter("id", serviceID)
            .getOne();

        r.grade = grade === null ? 0 : grade.toFixed(1);
        r.reviews = reviews
        return r;
    }

    public async addService(data: any): Promise<any> {

        let photographer: Photographer = this.assignObjectToModel(data, Photographer);
        let service: PhotographerService = this.assignObjectToModel(data, PhotographerService);
        // let area: PhotographerServiceArea = this.assignObjectToModel(data, PhotographerServiceArea);

        // let speciality = this.getRepository(CommonCode).create();
        // speciality.id = data["photographerService.speciality"];
        // service.speciality = speciality;

        //서비스 이미지 배열 생성
        let serviceImages: Array<Image> = new Array<Image>();
        if (typeof data["photographerServiceImages"] !== "undefined") {
            for (let image of data["photographerServiceImages"]) {
                serviceImages.push(this.assignObjectToModel(image, Image));
            }
        }

        //로케이션 이미지 배열 생성
        // let areaImages: Array<Image> = new Array<Image>();
        // if (typeof data["photographerServiceAreaImages"] !== "undefined") {
        //     for (let image of data["photographerServiceAreaImages"]) {
        //         areaImages.push(this.assignObjectToModel(image, Image));
        //     }
        // }

        return this.transaction(async entityManager => {

            let pg = await entityManager.findOneById(Photographer, photographer.id);

            let speciality = await entityManager.findOneById(CommonCode, data["photographerService.speciality"]);

            if (typeof pg === "undefined") {
                return Promise.reject(undefined);
            }

            // //로케이션 이미지 저장
            // let ai: Image[] = [];
            // for (let image of areaImages) {
            //     await entityManger.save(image);
            //     ai.push(image);
            // }
            // area.images = ai;
            // area.photographerService = service;
            // await entityManger.save(area);

            //서비스 이미지 저장
            let si: Image[] = [];
            for (let image of serviceImages) {
                await entityManager.save(image);
                si.push(image);
            }
            service.images = si;
            // service.area = area;
            service.speciality = speciality;
            service.photographer = pg;
            await entityManager.save(service);

            return await entityManager.findOneById(PhotographerService, service.id);
        });
    }

    public async updateService(serviceID: any, data: any): Promise<any> {

        // let photographer: Photographer = this.assignObjectToModel(data, Photographer);
        let serviceObj: PhotographerService = this.assignObjectToModel(data, PhotographerService);
        // let area: PhotographerServiceArea = this.assignObjectToModel(data, PhotographerServiceArea);

        let service = await this.getRepository(PhotographerService).findOneById(serviceID);

        service.minimumHours = serviceObj.minimumHours;
        service.currency = serviceObj.currency;
        service.price = serviceObj.price;
        service.aboutService = serviceObj.aboutService;
        service.promoteOnLandingPage = serviceObj.promoteOnLandingPage;
        service.whatYouNeedToProvide = serviceObj.whatYouNeedToProvide;
        service.delivery = serviceObj.delivery;
        service.representativeImage = serviceObj.representativeImage;

        //서비스 이미지 배열 생성
        let serviceImages: Array<Image> = new Array<Image>();
        if (typeof data["photographerServiceImages"] !== "undefined") {
            for (let image of data["photographerServiceImages"]) {
                serviceImages.push(this.assignObjectToModel(image, Image));
            }
        }

        return this.transaction(async entityManager => {

            // let pg = await entityManager.findOneById(Photographer, photographer.id);

            let speciality = await entityManager.findOneById(CommonCode, data["photographerService.speciality"]);

            await entityManager.getRepository(Image).createQueryBuilder("images")
                .where("photographerServiceId = :serviceID", {serviceID: serviceID}).delete().execute();

            //서비스 이미지 저장
            let si: Image[] = [];
            for (let image of serviceImages) {
                await entityManager.save(image);
                si.push(image);
            }

            // service.id = serviceID;
            service.images = si;
            // service.area = area;
            service.speciality = speciality;
            // service.photographer = pg;
            await entityManager.save(service);

            return await entityManager.findOneById(PhotographerService, service.id);
        });

    }

    public async deleteService(photographerID: any, serviceID: any): Promise<any> {
        return await this.getRepository(PhotographerService).createQueryBuilder("service")
            .update({deleted: 1})
            .where("service.photographer = :photographerID", {photographerID: photographerID})
            .andWhere("service.id = :serviceId", {serviceId: serviceID})
            .execute();
    }

    public async saveServiceByUser(userID: any, data: any): Promise<any> {

        const exist = await this.getRepository(UserSavedPhorographer).createQueryBuilder("usp")
            .where("usp.user.id = :userID").setParameter("userID", userID)
            .andWhere("usp.photographerService.id = :serviceID").setParameter("serviceID", data.serviceID)
            .getCount();

        if (exist) {
            return Promise.resolve("already_saved");
        }

        let repo = this.getRepository(UserSavedPhorographer);

        let obj: UserSavedPhorographer = repo.create();
        obj.user = await this.getRepository(User).findOneById(userID);
        obj.photographerService = await this.getRepository(PhotographerService).findOneById(data.serviceID);
        return await repo.save(obj);
    }

    public async getSavedServicesByUser(userID: any): Promise<any> {

        return await this.getRepository(PhotographerService).createQueryBuilder("service")
            .innerJoin("user_saved_photographers", "usp", "usp.photographerServiceID = service.id")
            .innerJoinAndSelect("service.photographer", "photographer")
            .innerJoinAndSelect("photographer.user", "user")
            .where("usp.user.id = :userID").setParameter("userID", userID)
            .andWhere("service.deleted = 0")
            .orderBy("usp.id", "DESC")
            .getMany();

        // return await this.getRepository(UserSavedPhorographer).createQueryBuilder("usp")
        //     .innerJoinAndSelect("usp.photographerService", "service")
        //     .where("usp.user.id = :userID").setParameter("userID", userID)
        //     .orderBy("usp.id", "DESC")
        //     .getMany();
    }

    public async removeServiceByUser(userID: any, serviceID: any): Promise<any> {
        let service = await this.getRepository(UserSavedPhorographer).findOne({"user.id": userID, "photographerService.id": serviceID});
        return await this.getRepository(UserSavedPhorographer).remove(service);
    }

    public async getIsSavedByUser(userID: any, serviceID: any): Promise<any> {
        const exist = await this.getRepository(UserSavedPhorographer).createQueryBuilder("usp")
            .where("usp.user.id = :userID").setParameter("userID", userID)
            .andWhere("usp.photographerService.id = :serviceID").setParameter("serviceID", serviceID)
            .getCount();

        if (exist) {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }

    public async getArea(photographerID: any): Promise<any> {
        return await this.getRepository(PhotographerServiceArea).createQueryBuilder("area")
            .innerJoinAndSelect("area.images", "image")
            .innerJoin("area.photographer", "photographer")
            // .innerJoinAndSelect("area.speciality", "speciality")
            .where("photographer.id = :photographerID", {photographerID: photographerID})
            .getOne();
    }

    public async addArea(photographerID: any, data: any): Promise<any> {

        // let photographer: Photographer = this.assignObjectToModel(data, Photographer);
        let areaObj: PhotographerServiceArea = this.assignObjectToModel(data, PhotographerServiceArea);
        // let area: PhotographerServiceArea = this.assignObjectToModel(data, PhotographerServiceArea);

        let area: PhotographerServiceArea = await this.getRepository(PhotographerServiceArea).createQueryBuilder("area")
            .innerJoin("area.photographer", "photographer")
            // .innerJoinAndSelect("area.speciality", "speciality")
            .where("photographer.id = :photographerID", {photographerID: photographerID})
            .getOne();

        if (typeof area === "undefined" || area === null) {
            area = areaObj;
        } else {
            area.aboutTheLocation = (areaObj.aboutTheLocation === "") ? "" : areaObj.aboutTheLocation;
            area.latitude = areaObj.latitude;
            area.longitude = areaObj.longitude;
            area.placeName = areaObj.placeName;
            area.placeID = areaObj.placeID;
            area.howToGetHere = (areaObj.howToGetHere === "") ? "" : areaObj.howToGetHere;
            area.city = areaObj.city;
        }


        //서비스 이미지 배열 생성
        let areaImages: Array<Image> = new Array<Image>();
        if (typeof data["photographerServiceAreaImages"] !== "undefined") {
            for (let image of data["photographerServiceAreaImages"]) {
                areaImages.push(this.assignObjectToModel(image, Image));
            }
        }

        return this.transaction(async entityManager => {

            let pg = await entityManager.findOneById(Photographer, photographerID);

            // let speciality = await entityManager.findOneById(CommonCode, data["photographerService.speciality"]);

            if (area.id) {
                await entityManager.getRepository(Image).createQueryBuilder("images")
                    .where("photographerServiceAreaId = :areaID", {areaID: area.id}).delete().execute();
            }

            //서비스 이미지 저장
            let si: Image[] = [];
            for (let image of areaImages) {
                await entityManager.save(image);
                si.push(image);
            }

            // service.id = serviceID;
            area.images = si;
            // service.area = area;
            // ar.speciality = speciality;
            area.photographer = pg;

            pg.area = area;

            await entityManager.save(area);
            await entityManager.save(pg);

            return this.getArea(photographerID);
        });

    }

    public async updateArea(photographerID: any, data: any): Promise<any> {

    }

    public async getReviews(photographerServiceID: any): Promise<any> {
        return await this.getRepository(PhotographerServiceReview).createQueryBuilder("review")
            .innerJoin("review.photographerService", "service")
            .innerJoinAndSelect("review.user", "user")
            .where("service.id = :photographerServiceID", {photographerServiceID: photographerServiceID})
            .andWhere("review.review <> ''")
            .orderBy("review.id","DESC")
            .getMany();
    }
}
