import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const analysisResultSchema = new mongoose.Schema({
    // To store results from the single product optimization
    singleProductAnalysis: {
        type: Object,
        default: null,
    },
    // To store results from the aggregate business forecast
    aggregateAnalysis: {
        type: Object,
        default: null,
    },
    // To store the raw file info if needed later
    singleProductFile: {
        originalName: String,
        uploadDate: Date,
    },
    aggregateFile: {
        originalName: String,
        uploadDate: Date,
    }
});

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6,
    },
    analysis: {
        type: analysisResultSchema,
        default: () => ({})
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
