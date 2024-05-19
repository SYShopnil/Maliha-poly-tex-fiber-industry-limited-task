import { IsDefined, IsEmpty } from "class-validator";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Text } from "../text/text.entity";

@Entity({ name: "element" })
export class Element extends BaseEntity {
  @IsDefined()
  @IsEmpty({
    always: true,
    message: "Element Id required!!!",
  })
  @PrimaryColumn({ name: "elementId", type: "varchar" })
  elementId: string; //col - 1 (PK)

  @IsDefined()
  @IsEmpty({
    always: true,
    message: "is checked field required!!!",
  })
  @Column({
    type: "boolean",
    name: "isChecked",
    default: false,
  })
  public isChecked!: boolean; //col - 2

  @IsDefined()
  @IsEmpty({
    always: true,
    message: "Element Value required!!!",
  })
  @Column({
    type: "int",
    name: "value",
    default: false,
  })
  public value!: number; ///col - 3

  @Column({ type: "datetime", name: "create_at" })
  create_at: Date; //col - 4

  @Column({ type: "datetime", name: "update_at" })
  update_at: Date; //col - 5

  @BeforeInsert()
  setCreateAt() {
    this.create_at = new Date();
  }

  @BeforeUpdate()
  setUpdateAt() {
    this.update_at = new Date();
  }

  @JoinColumn({ name: "text" })
  @ManyToOne(() => Text, (text) => text.elements)
  public text: Text;
}
