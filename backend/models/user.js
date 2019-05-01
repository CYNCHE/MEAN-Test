const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



const userSchema = mongoose.Schema ({
  // unique here is not a validator, it's here for peroformance issue
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// check the uniqueness of the email address
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model("User", userSchema);
