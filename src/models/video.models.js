import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose(Schema(
    {
        videoFile:{
          type:String,
          required:true,
        },
        thumbnail:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        duration:{
            type:Number,
            required:true,
        },
        views:{
            type:Number,
            default:0,
        },
        title:{
            type:String,
            required:true,  
            index:true,
            trim:true,
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        isPublished:{
            type:Boolean,
            default:true
        }
    },
    {timestamps: true}
)) 

videoSchema.plugin(mongooseAggregatePaginate) //aggregation pipelines
// we can add our own plugins in mongoose
export const Video = mongoose.model("Video", videoSchema)