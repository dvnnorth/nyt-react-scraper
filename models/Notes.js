const mongoose = require('mongoose');

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NotesSchema object
// This is similar to a Sequelize model
const NotesSchema = new Schema({
  // `title` is of type String
  title: String,
  // `body` is of type String
  body: String,
  // reference to a user. Should match the article storing the reference to this note.
  // ensures that the user never sees a note that they have not saved themselves.
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }
});

// This creates our model from the above schema, using mongoose's model method
const Notes = mongoose.model('Notes', NotesSchema);

// Export the Notes model
module.exports = Notes;