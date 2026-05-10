const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

UserSchema.pre('save', async function() {  
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
  
});

module.exports = mongoose.model('User', UserSchema);