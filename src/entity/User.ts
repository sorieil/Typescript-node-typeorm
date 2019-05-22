import {Photographer, PhotographerService} from "./Photographer";
import {Album, Booking} from "./Booking";
import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index
} from "typeorm";

// 유저 정보
@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 20})
    @Index()
    accountType: string; // user, photographer, admin

    @Column({length: 50})
    firstName: string;

    @Column({length: 50})
    lastName: string;

    @Column({length: 500, default: ""})
    profileImage: string;

    @Column({length: 20})
    birthDay: string; // yyyy-mm-dd

    @Column({length: 500})
    @Index()
    email: string;

    @Column({length: 50})
    mobileNumber: string;

    @CreateDateColumn()
    @Index()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // 회원 탈퇴시 삭제하지 않고 아래 값을 변경한다.
    @Column({type: "tinyint", default: false})
    @Index()
    withdraw: boolean; // 탈퇴여부

    @Column({
        type: "date",
        nullable: true,
    })
    withdrawedAt: Date;

    @OneToMany((type) => Login, (logins) => logins.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    logins: Login[];

    @OneToMany((type) => Booking, (bookings) => bookings.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    bookings: Booking[];

    @OneToMany((type) => Album, (albums) => albums.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    albums: Album[];

    @OneToMany((type) => Photographer, (photographer) => photographer.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    // @JoinColumn({name: 'photographerId', referencedColumnName: 'id'})
    photographer: Photographer[];

/*    @OneToMany((type) => PhotographerServiceReview, (photographerServiceReviews) => photographerServiceReviews.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    photographerServiceReviews: PhotographerServiceReview[];*/
}

// 로그인 정보
@Entity("logins")
export class Login {

    @PrimaryGeneratedColumn()
    id: number;

    // 서비스에서 사용하는 이메일이 아님.
    @Column({length: 200})
    @Index()
    loginID: string;

    @Column({length: 1000, default: ""})
    @Index()
    loginPassword: string;

    // 외부 서비스 연동 여부(로그인)
    @Column("tinyint", {default: false})
    @Index()
    integrated: boolean;

    // 외부 서비스로 로그인 연동시 해당 토큰
    @Column({length: 500, default: ""})
    @Index()
    integratedToken: string;

    @Column({length: 20, default: "general"})
    integratedServiceName: string;

    @CreateDateColumn()
    @Index()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => User, (user) => user.logins, { cascadeAll: true })
    user: User;

    @Column({length: 100, default: ""})
    @Index()
    firebaseUid: string;
}

@Entity("user_saved_photographers")
export class UserSavedPhorographer {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => User, { cascadeAll: true })
    user: User;

    @ManyToOne((type) => PhotographerService, { cascadeAll: true })
    photographerService: PhotographerService;

    @CreateDateColumn()
    @Index()
    createdAt: Date;

}
