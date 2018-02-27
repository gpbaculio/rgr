import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    hidden: true
  },
  email: {
    type: String,
    required: false,
    index: true
  },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Todo',
      index: true
    }
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      index: true
    }
  ]
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  collection: 'user'
});

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this
      .encryptPassword(this.password)
      .then((hash) => {
        this.password = hash;
        next();
      })
      .catch(err => next(err));
  } else {
    return next();
  }
});

userSchema.methods = {
  async authenticate(plainTextPassword) {
    try {
      return await bcrypt.compare(plainTextPassword, this.password);
    } catch (err) {
      return false;
    }
  },
  encryptPassword(password) {
    return bcrypt.hash(password, 8);
  }
};

export const UserModel = mongoose.model('userModel', userSchema);
