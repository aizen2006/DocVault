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
}, { timestamps: true });

// Indexes for better query performance
recordSchema.index({ owner: 1, createdAt: -1 }); // For fetching user's records sorted by date
recordSchema.index({ fileUploadUrl: 1 }, { unique: true }); // Ensure unique file URLs
recordSchema.index({ categoryTags: 1 }); // For filtering by category
recordSchema.index({ createdAt: -1 }); // For global sorting

export const Record = mongoose.model('Record', recordSchema);