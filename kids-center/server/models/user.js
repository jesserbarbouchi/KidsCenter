const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
          category: { type: String },
          fullname: { type: String },
          username: { type: String },
          email   : { type: String },
          password: { type: String },
          adresse : { type: String },
          city    : { type: String },
          phone   : { type: String, default : "" },
          connect : { type: Boolean, default: false },
          user_img: { type: String, default : "https://www.propertycentral.co.ke/assets/images/profiles/default.jpg" },
     },{ timestamps: true });

userSchema.statics.login = async function (username, plainTextPassword) {
     const foundUser = await this.findOne({ username });
     if (foundUser) {
          const success = await bcrypt.compare(
               plainTextPassword,
               foundUser.password
          );
          if (success) return foundUser;
          else throw Error("Incorrect username/password");
     }
     else throw Error("Username not exist");
};

userSchema.pre("save", async function (next) {
     this.password = await bcrypt.hash(this.password, 12);
     next();
});

module.exports = mongoose.model("User", userSchema);