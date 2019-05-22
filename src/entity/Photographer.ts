import {CommonCode, Image} from "./Common";
import {User} from "./User";
import {Booking} from "./Booking";
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity("photographers")
export class Photographer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    aboutMe: string;

    @Column("int")
    experience: number;

    @ManyToMany((type) => CommonCode, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    @JoinTable()
    languages: CommonCode[];

    @OneToMany((type) => PhotographerHoliday, (holidaies) => holidaies.photographer, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    holidaies: PhotographerHoliday[];

    @OneToMany((type) => PhotographerAvailability, (availability) => availability.photographer, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    availability: PhotographerAvailability[];

    @OneToMany((type) => PhotographerService, (services) => services.photographer, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    services: PhotographerService[];

    @OneToOne((type) => PhotographerServiceArea, (area) => area.photographer, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    @JoinColumn()
    area: PhotographerServiceArea;

    @OneToMany((type) => Booking, (bookings) => bookings.photographer, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    bookings: Booking[];

    @OneToOne((type) => User, (user) => user.photographer, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    @JoinColumn()
    user: User;
}

@Entity("photographer_services")
export class PhotographerService {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => CommonCode, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    speciality: CommonCode;

    @Column("int")
    minimumHours: number;

    @Column({length: 10})
    currency: string;

    @Column("float")
    @Index()
    price: number;

    @Column("text")
    aboutService: string;

    @Column("tinyint")
    promoteOnLandingPage: boolean;

    @Column("text")
    whatYouNeedToProvide: string;

    @Column("text")
    delivery: string;

    @Column({length: 500, default: ""})
    representativeImage: string; //서비스 대표 이미지

    @Column({type: "tinyint", default: false})
    @Index()
    deleted: boolean;

    @Column("float")
    averageRating: number;

    @CreateDateColumn()
    @Index()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => Photographer, (photograpger) => photograpger.services, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    photographer: Photographer;

    @OneToMany((type) => Image, (images) => images.photographerService, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    images: Image[];

    @OneToMany((type) => Booking, (booking) => booking.photographerService, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    booings: Booking[];

    @OneToMany((type) => PhotographerServiceReview, (reviews) => reviews.photographerService, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    reviews: PhotographerServiceReview[];
}

@Entity("photographer_service_areas")
@Index("photographer_service_area_gps", ["latitude", "longitude"])
export class PhotographerServiceArea {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 20, default: ""})
    latitude: string;

    @Column({length: 20, default: ""})
    longitude: string;

    @Column({length: 500, default: ""})
    address: string;

    @Column({length: 100, default: ""})
    @Index()
    city: string;

    @Column({length: 100, default: ""})
    placeID: string;

    @Column({length: 100, default: ""})
    placeName: string;

    @Column("text")
    aboutTheLocation: string;

    @Column("text")
    howToGetHere: string;

    // @Column("text")
    // bySearch: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany((type) => Image, (images) => images.photographerServiceArea, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    images: Image[];

    @OneToOne((type) => Photographer, (photographer) => photographer.area, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    @JoinColumn()
    photographer: Photographer;
}

@Entity("photographer_service_reviews")
export class PhotographerServiceReview {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("float")
    grade: number; //평점

    @Column("text")
    review: string;

    @Column("text")
    report: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne((type) => Booking, (booking) => booking.album, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    @JoinColumn()
    booking: Booking;

    @ManyToOne((type) => User, {cascadeAll: true})
    user: User;

    @ManyToOne((type) => Photographer, {cascadeAll: true})
    photographer: Photographer;

    @ManyToOne((type) => PhotographerService, (photographerService) => photographerService.reviews, {cascadeAll: true})
    photographerService: PhotographerService;
}

@Entity("photographer_holidaies")
export class PhotographerHoliday {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    year: number;

    @Column()
    @Index()
    month: number;

    @Column({length: 500})
    @Index()
    daies: string;

    @ManyToOne((type) => Photographer, (photographer) => photographer.holidaies)
    photographer: Photographer;
}

@Entity()
// @Index("photographer_availability_hours", ["startTime", "endTime"])
export class PhotographerAvailability {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    dayOfWeek: number;

    @Column("int")
    @Index()
    am: number;

    @Column("int")
    @Index()
    pm: number;

    @Column({length: 48, default: "000000000000000000000000000000000000000000000000"})
    @Index()
    timeBits: string;

    @ManyToOne((type) => Photographer, (photographer) => photographer.availability)
    photographer: Photographer;

}
