import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true,
    },
    createAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "Username is Required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
        match: [/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email address"]
    },
    password:{
        type: String,
        required: [true, "Password is Required"],
    },
    verifyCode:{
        type: String,
        required: [true, "VerifyCode is Required"],
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, "verify Code Expiry is Must"],
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
})
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema) 

export default UserModel;