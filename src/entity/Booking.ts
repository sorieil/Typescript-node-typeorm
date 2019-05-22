import {User} from "./User";
import {Photographer, PhotographerService, PhotographerServiceReview} from "./Photographer";
import {Message} from "./Message";
import {CommonCode, Image} from "./Common";
import {
    Entity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn,
    CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, Index
} from "typeorm";

@Entity("bookings")
@Index("bookings_area_gps", ["latitude", "longitude"])
export class Booking {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("date")
    @Index()
    date: Date;

    @Column({length: 11})
    @Index()
    startTime: number;

    @Column({length: 11})
    @Index()
    endTime: number;

    @Column({length: 100, default: ""})
    placeID: string;

    @Column({length: 100, default: ""})
    placeName: string;

    @Column({length: 500, default: ""})
    address: string;

    @Column("float")
    price: number;

    @Column("text")
    description: string;

    @Column({length: 15})
    @Index()
    status: string; // request, rejected, accepted, needToUpload(?)

    @Column({length: 20, default: ""})
    latitude: string;

    @Column({length: 20, default: ""})
    longitude: string;

    @ManyToOne((type) => User, (user) => user.bookings, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    user: User;

    @ManyToOne((type) => Photographer, (photographer) => photographer.bookings, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    photographer: Photographer;

    @ManyToOne((type) => PhotographerService,    (photographerService) => photographerService.booings, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    photographerService: PhotographerService;

    @OneToOne((type) => Message, (message) => message.booking, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    message: Message;

    @OneToOne((type) => Album, (album) => album.booking, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    album: Album;

    @OneToOne((type) => PhotographerServiceReview, (review) => review.booking, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    review: PhotographerServiceReview;

    @CreateDateColumn()
    @Index()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({nullable: true, length: 6})
    requestedAt: Date;

    @Column({nullable: true, length: 6})
    rejectedAt: Date;

    @Column({nullable: true, length: 6})
    acceptedAt: Date;

    @Column({nullable: true, length: 6})
    needToUploadAt: Date;

    @Column({nullable: true, length: 6})
    completedAt: Date;

    @ManyToOne( (type) => CommonCode, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    cancel: CommonCode;
}

@Entity("albums")
export class Album {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne( (type) => Booking, (booking) => booking.album, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    @JoinColumn()
    booking: Booking;

    @ManyToOne((type) => User, (user) => user.albums, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    user: User;

    // 아래부분이 애매하다. 서비스로 해야할지 포토그래퍼로 해야할지..
    @ManyToOne((type) => PhotographerService, (photographerService) => photographerService.booings, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    photographerService: PhotographerService;

    // 촬영이 종료되고 최종 사진 업로드
    @OneToMany( (type) => Image, (images) => images.album, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    images: Image[];

    @CreateDateColumn()
    @Index()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
