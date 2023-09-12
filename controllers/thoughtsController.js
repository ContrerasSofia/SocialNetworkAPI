const { Thought} = require('../models');
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
  async deleteThought(req, res) {},
  async addReaction(req, res) {},
  async deleteReaction(req, res) {}
};
