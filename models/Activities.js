const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    type:{
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true, 
        ref:'User',
        
    },
    targetUserId: {
        type: String,
        ref:'User',
     //  required: true,
    },
    postId: {
        type: String,
        ref:'Post',
    //  required: true,
    },
},{
    timestamps: true,
});

module.exports = mongoose.model('Activity', activitySchema);