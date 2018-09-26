// Modules for Express server
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Init Express app
const app = express();

// Import routes
const apiRoutes = require('./routes/apiRoutes');

// Set Listening Port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Call routes
apiRoutes(app);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// MongoDB Mongoose connection
const mongoDBURI = process.env.MONGODB_URI || 'mongodb://localhost/nyt-react-scraper';
mongoose.connect(mongoDBURI, { useNewUrlParser: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}, Mongoose connected to MongoDB`));
  })
  .catch(err => console.log(err));

