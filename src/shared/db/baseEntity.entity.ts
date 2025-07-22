import { PrimaryKey, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

export abstract class BaseEntity {
    @PrimaryKey({type: 'string'})
    _id!: ObjectId

    @SerializedPrimaryKey({type: 'string'})
    id!: string
}