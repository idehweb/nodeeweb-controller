console.log('#model test')
export default (mongoose)=>{
    const TestSchema = new mongoose.Schema({
        description: {},
        title: {},
        slug: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        button: {
            type: String,
            default: "send",
        },
        createdAt: {type: Date, default: new Date()},
        updatedAt: {type: Date, default: new Date()},
        active: {type: Boolean, default: true},
        elements: [],
        responses:[],
        status: {type: String, default: 'processing'},
        classes: {type: String},
        sort: {type: Number, default: 1},
        view:{type: Number, default: 1},
        category:{type: mongoose.Schema.Types.ObjectId, ref: 'TestCategory'}


    });
    return TestSchema

};
