import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
    fileName:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    categoryTags:{
        type:String,
        enum:["Document", "Images" , "Audio" , "PDF" , "Spreadsheet" , "PPT" ,],
        required:true,
    },
    fileUploadUrl:{
        type:String,
        required:true,
        unique:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
},{ timestamps:true });

export const Record = mongoose.model('Record',recordSchema)