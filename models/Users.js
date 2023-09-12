const { Schema, model } = require('mongoose');
const Thought = require('../models/Thought');
// Schema to create User model
const userSchema = new Schema(
  {
    username: 
    {
        type: String,
        unique: true,
        trim: true
    },
    email:
    {
        type: String,
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thoughts',
      },
    ],
    friends: [
        {
          type: Schema.Types.ObjectId,
          ref: 'userSchema',
        },
      ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
    username:  false,
    email: false
  }
);

userSchema 
  .virtual('friendCount')
  // Getter
  .get(function () {
    return this.friends.length;
  });

const User = model('user', userSchema);

module.exports = User;