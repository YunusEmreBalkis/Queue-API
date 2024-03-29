const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide a name"],
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:[true,"Please provide a email"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Please provide a email"],
        minlength:6
    },
    role:{
        type:String,
        enum:["admin","user","worker","owner"],
        default:"user",
    },
    wishList: [{
        type:mongoose.Types.ObjectId,
        ref:"Place"
    }],
    placeForWork: {
        type:mongoose.Types.ObjectId,
        ref:"Place"
    },
    placeOfCurrentQueue:{
        type:Number,
        default: 0
    },
    currentWaitingQueue:{
        type:mongoose.Types.ObjectId,
        ref:"Queue",
    },
},{
    timestamps: true,
    versionKey: false,
    collection: 'users',
  })

  UserSchema.pre("save", async function (){
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

UserSchema.methods.comparePassword = async function(canditatePassword){
    const isMatch = await bcrypt.compare(canditatePassword,this.password);
    return isMatch;
}

module.exports = mongoose.model("User",UserSchema)