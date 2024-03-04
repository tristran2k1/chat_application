import { BeforeInsert, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('profile')
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column()
    dob: Date;

    @Column()
    username: string

    @BeforeInsert()
    usernameToLowerCase() {
        this.username = this.username.toLowerCase();
    }
}