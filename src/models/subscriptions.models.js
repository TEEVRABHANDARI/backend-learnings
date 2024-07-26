import mongoose, { Schema } from "mongoose";
import User  from "./users.models";


const subscriptionSchema = new Schema ( 
{
    subscriber:{ // wjo is subscribing
        type: Schema.Types.ObjectId,
        ref: User
    },

    channel:{ //which channel is subscribed
        type:Schema.Types.ObjectId,
        ref: User
    }

},{timeStamps: true}
)

export const Subsciption = mongoose.model(subscriptionSchema)