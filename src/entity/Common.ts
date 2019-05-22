import {PhotographerService, PhotographerServiceArea} from "./Photographer";
import {Album} from "./Booking";
import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, ClosureEntity, TreeChildren,
    TreeParent, TreeLevelColumn
} from "typeorm"

/*@Entity("languages")
export class Language {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 20})
    @Index()
    language: string

}*/

@ClosureEntity("cities")
export class City {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string; //country or city

    @TreeChildren({ cascadeInsert: true, cascadeUpdate: true })
    children: City;

    @TreeParent()
    parent: City;

    @TreeLevelColumn()
    level: number;
}

@Entity()
export class Image {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 500})
    @Index()
    imageName: string;

    @Column({length: 1000})
    path: string;

    @Column("int")
    width: number;

    @Column("int")
    height: number;

    @Column("bigint")
    size: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(type => PhotographerService, photographerService => photographerService.images)
    photographerService: PhotographerService;

    @ManyToOne(type => PhotographerServiceArea, photographerServiceArea => photographerServiceArea.images)
    photographerServiceArea: PhotographerServiceArea;

    @ManyToOne(type => Album, album => album.images)
    album: Album;
}

@Entity("landing_page")
export class LandingPage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    urls: string;

    @Column({length: 100})
    description: string;

    @CreateDateColumn()
    createdAt: Date;
}

@Entity("common_codes")
export class CommonCode {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50})
    @Index()
    codeType: string;

    @Column({length: 100})
    codeName: string;

    @Column("int")
    @Index()
    seq: number
}
