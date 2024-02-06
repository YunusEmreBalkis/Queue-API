const { model, Schema } = require('mongoose')

const QueueSchema = new Schema({
    name:{
        type:String,
        minlength:3,
        maxlength:50
    },
    place:{
        type:Schema.Types.ObjectId,
        ref:"Place",
        required:true,
    },
    waitersCount:{
        type:Number,
        default:0
    },
    date:{
        type:Date
    },
    waiters:[{
        type:Schema.Types.ObjectId,
        ref:"User",
    }]
},{
    timestamps: true,
    versionKey: false,
    collection: 'queues',
  })

module.exports = model("Queue",QueueSchema)