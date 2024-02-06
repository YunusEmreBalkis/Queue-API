const { model, Schema } = require('mongoose')


const addressObject = {
    city:{
        type:String,
        trim:true
    },
    country:{
        type:String,
        trim:true
    },
    town:{
        type:String,
        trim:true
    },
}
const analyticObject = {
    date:{
        type:Date,
    },
    count:{
        type:Number,
    },
}


const PlaceSchema = new Schema({
    name:{
        type:String,
        minlength:3,
        maxlength:50
    },
    status:{
        type:String,
        enum:["pending","confirmed"]
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    bannedUsers:[{
        type:Schema.Types.ObjectId,
        ref:"User",
    }],
    address:addressObject,
    analyticData:[analyticObject],
},{
    timestamps: true,
    versionKey: false,
    collection: 'places',
  })

module.exports = model("Place",PlaceSchema)