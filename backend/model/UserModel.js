import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
    username: { type: String, required: true, },
    email: { type: String, required: true, unique: true },
    locCode: { type: String, required: true },
    power: { type: String, enum: ["admin", "normal"], required: true, default: 'normal' },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);
export default User;


// //user designation
