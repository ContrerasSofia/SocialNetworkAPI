const { Schema, model, Types} = require('mongoose');

// Schema to create Post model
const ReactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
      },
      reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
      },
    createdAt: {
        type: Date,
        default: Date.now,
      },
      username: {
        type: String,
        maxLength: 280,
        required: true,
      },
    },
    {
      toJSON: {
        virtuals: true,
      },
      id: false,
    });
  

const ThoughtSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      maxLength: 280,
      required: true,
    },
    thoughtText: {
      type: String,
      minLength: 1,
      maxLength: 280,
    },
    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual property `responses` that gets the amount of response per video
ThoughtSchema
  .virtual('getReactionCount')
  // Getter
  .get(function () {
    return this.reactions.length;
  });

// Initialize our Video model
const Thought = model('Thought', ThoughtSchema);
const Reaction = model('Reaction', ReactionSchema);
module.exports = {Thought, Reaction}
