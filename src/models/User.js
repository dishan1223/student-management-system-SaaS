import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    plan :{
        type : String,
        default : "Free",
    },
    planExpiryDate : {
        type : Date,
        default : new Date(),
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});


// encrypt password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// compare password function
userSchema.methods.comparePassword = async function (userPassword) {
	return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model('User', userSchema);
export default User; 
