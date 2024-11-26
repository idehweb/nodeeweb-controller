// console.log('#model setting')
import bcrypt from 'bcrypt';

export default (mongoose)=>{
    const ModelSchema = new mongoose.Schema({
        name: {
            type: String,
            required: false
        },
        title: {
            type: String,
            required: false
        },
        url: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: false
        },
        theKey: {
            type: String,
            required: false,
        },
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},

    });
    return ModelSchema


};
