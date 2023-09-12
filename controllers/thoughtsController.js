const { Thought, Reaction} = require('../models/Thought');
const User = require('../models/Users');

module.exports = {
  async getThoughts(req, res) {
    try {
      const  thoughts = await  Thought.find();
      res.json( thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async addThoughts(req, res) {
    try {
      let user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      const dbThoughtData = await Thought.create({
        thoughtText: req.body.thoughtText,
        username: user.username
      });

      user = await User.findOneAndUpdate(
        {  _id: req.params.userId },
        { $addToSet: { thoughts: dbThoughtData._id} },
        { runValidators: true, new: true }
      )

      res.json(user);

    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const  thoughts = await  Thought.findOne(
        { _id: req.params.thoughtId }
      );
      res.json( thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async updateThought(req, res) {
    try {
      const  thoughts = await  Thought.findOneAndUpdate(
        {  _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      )
      if (!thoughts) {
        return res.status(404).json({ message: 'No thoughts with this id!' });
      }
      res.json( thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteThought(req, res) {
    try {
      const thoughts = await Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .select('-__v');
        
      if (!thoughts) {
        return res.status(404).json({ message: 'No thoughts with that ID' });
      }

      const user = await User.findOneAndUpdate(
        { username: thoughts.username},
        { $pull:{ thoughts: req.params.thoughtId }},
        { runValidators: true, new: true }
      )

      res.json({ message: 'thoughts successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async addReaction(req, res) {
    try {
      let thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      const dbReactionData = await Reaction.create({
        reactionBody: req.body.reactionBody,
        username: thought.username
      });

      thought = await Thought.findOneAndUpdate(
        {  _id: req.params.thoughtId },
        { $addToSet: { reactions: dbReactionData} },
        { runValidators: true, new: true }
      )

     
      res.json(thought);

    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteReaction(req, res) {}
};
