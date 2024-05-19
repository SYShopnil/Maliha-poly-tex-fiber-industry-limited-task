import { IsDefined, IsEmpty } from "class-validator";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "../user/user.entity";
import { Element } from "../elements/element.entity";

@Entity({ name: "text" })
export class Text extends BaseEntity {
  @IsDefined()
  @IsEmpty({
    always: true,
    message: "Text Id required!!!",
  })
  @PrimaryColumn({ name: "textId", type: "varchar" })
  textId: string; //col - 1

  @Column({
    type: "boolean",
    name: "isDelete",
    default: false,
  })
  public isDelete!: boolean; //col - 2

  @Column({ type: "datetime", name: "create_at" })
  create_at: Date; //col - 3

  @Column({ type: "datetime", name: "update_at" })
  update_at: Date; //col - 4

  @BeforeInsert()
  setCreateAt() {
    this.create_at = new Date();
  }

  @BeforeUpdate()
  setUpdateAt() {
    this.update_at = new Date();
  }

  @JoinColumn({ name: "owner" })
  @ManyToOne(() => User, (user) => user.texts)
  public owner: User;

  @OneToMany(() => Element, (element) => element.text)
  public elements: Element[];
}
