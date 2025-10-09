// path: server/models/userModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please provide a name'], 
        trim: true,
    },
    email: { 
        type: String, 
        required: [true, 'Please provide an email'], 
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { 
        type: String, 
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false, // Do not send password to client by default
    },
    photoUrl: {
        type: String,
        default: 'https://i.ibb.co/4pDNDk1/avatar.png', // A default avatar
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare candidate password with the stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
