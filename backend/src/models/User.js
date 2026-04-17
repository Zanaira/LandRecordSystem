import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    full_name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["Admin", "Clerk"], required: true,default :'Clerk' },
    password: { type: String, required: true, minlength: 8, select: false }, 
  },
  { timestamps: true }
);

// Hash password if modified/new
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Compare candidate vs stored hash
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
