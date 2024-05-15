import {
  IsAlpha,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEmpty,
  Matches,
} from "class-validator";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @IsEmpty({
    always: true,
    message: "User Id required!!!",
  })
  @PrimaryColumn({ name: "user_id" })
  user_id: string; //col - 1

  @Column({
    type: "varchar",
    length: 30,
    name: "first_name",
  })
  @IsDefined()
  @IsEmpty({
    always: true,
    message: "First name required!!!",
  })
  @IsAlpha()
  public first_name!: string; //col - 2

  @Column({
    type: "varchar",
    length: 25,
    name: "last_name",
  })
  @IsDefined()
  @IsEmpty({
    always: true,
    message: "Last name required!!!",
  })
  @IsAlpha()
  public last_name!: string; //col - 3

  @Column({
    type: "varchar",
    length: 10,
    name: "role",
  })
  @IsDefined()
  @IsEmpty({
    always: true,
    message: "User Role required!!!",
  })
  @IsAlpha()
  public role!: string; //col - 4

  @Column({
    type: "varchar",
    length: 50,
  })
  @IsDefined()
  @IsEmpty({
    always: true,
    message: "Email required!!!",
  })
  @IsAlpha()
  @Matches(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    { message: "Email pattern not match" }
  )
  @IsEmail({}, { message: "Invalid email message" })
  public email!: string; //col - 5

  @Column({
    type: "varchar",
    length: 200,
    name: "password",
  })
  @IsEmpty({
    always: true,
    message: "Password required!!!",
  })
  @IsDefined()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: "Password pattern not match",
  })
  public password!: string; //col - 6

  @Column({
    type: "boolean",
    default: false,
    name: "is_active",
  })
  @IsBoolean({ message: "Is Active will be Boolean" })
  public is_active!: boolean; //col - 7

  @Column({ type: "datetime", name: "create_at" })
  create_at: Date; //col - 8

  @Column({ type: "datetime", name: "update_at" })
  update_at: Date; //col - 9

  @BeforeInsert()
  setCreateAt() {
    this.create_at = new Date();
  }

  @BeforeUpdate()
  setUpdateAt() {
    this.update_at = new Date();
  }

  @Column({
    type: "varchar",
    length: 100,
    name: "profile_pic",
  })
  @IsDefined()
  @IsEmpty({
    always: true,
    message: "Profile Image required!!!",
  })
  @IsAlpha()
  public profile_pic!: string; //col - 10
}
