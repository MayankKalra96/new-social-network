const { Thought, User, Types } = require('../models');


const ThoughtController = {
  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(userData => {
        if (!userData) {
          res.status(404).json({ message: 'No User found with this id! first error' });
          return;
        }
        res.json(userData);
      })
      .catch(err => res.json(err));
  },
  getAllThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThought) => res.json(dbThought))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(userData => res.json(userData))
      .catch(err => res.json(err));
  },
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
    .select("-__v")
    .then((dbThought) => {
    if (!dbThought) {
      res.status(404).json({ message: "No thought found!" });
      return;
    }
    res.json(dbThought);
    })
    .catch((err) => {
    res.status(400).json(err);
    });
  },
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(deletedthought => {
        if (!deletedthought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        return User.findOneAndUpdate(
          { _id: params.username },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(userData => {
        res.json(userData);
      })
      .catch(err => res.json(err));
  },
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true }
    )
      .then(userData => {
        if (!userData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(userData);
      })
      .catch(err => res.json(err));
  },
};

module.exports = ThoughtController