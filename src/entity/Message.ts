import {User} from "./User";
import {Photographer, PhotographerService} from "./Photographer";
import {Booking} from "./Booking";
import {
    Entity, Column, CreateDateColumn, OneToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,
    OneToOne, JoinColumn, Index
} from "typeorm";

@Entity("messages")
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, { cascadeAll: true })
    user: User;

    @ManyToOne(type => Photographer, { cascadeAll: true })
    photographer: Photographer;

    @ManyToOne(type => PhotographerService, { cascadeAll: true })
    photographerService: PhotographerService;

    @OneToMany(type => MessageDetail, details => details.meta, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    details: MessageDetail[]

    @OneToOne(type => Booking, booking => booking.message, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    @JoinColumn()
    booking: Booking;

    @CreateDateColumn()
    createdAt: Date;
}

@Entity("message_details")
export class MessageDetail {

    @PrimaryGeneratedColumn()
    id: number;

    //메세지 주체
    @Column({length: 20})
    @Index()
    writerType: string; // user, photographer

    @Column("text")
    message: string;

    @Column({type: "tinyint", default: false})
    @Index()
    isRead: boolean; // writerType 에 따라 읽는 주체가 달라진다

    @CreateDateColumn()
    @Index()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(type => Message, meta => meta.details, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    meta: Message;

}