const db = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const controller = require('../controller/controller.js');
const winston = require('../config/winston');

// Create the authenticationMiddleware function to validate requests
const authenticationMiddleware = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    else {
      res.sendStatus(401);
    }
  };
};

module.exports = app => {

  ////////////////////////// Auth ///////////////////////////////////////
  //local strategy used for signing in users
  passport.use(
    new LocalStrategy((username, password, done) => {
      // Retrieve a User object from the database using mongoose 
      // by username
      //where: { username: username } 
      db.Users.findOne({ username: username })
        .then((res) => {
          // res is the response from mongoose in the promise
          // If there's no response, give error message
          if (!res) return done(null, false, { message: 'Incorrect username' });
          // Content (User object) is in res.dataValues
          let user = res;
          // Password in the user.password field is already hashed. Store in variable hash
          let hash = user.password;
          // Compare the password (using the hash in session)
          bcrypt.compare(password, hash, (err, res) => {
            // res is the results of the comparison (true or false)
            if (err) return done(err);
            if (res) {
              return done(null, user);
            }
            else {
              return done(null, false, { message: 'Incorrect password' });
            }
          });
        })
        .catch(err => sendError(err, res));
    })
  );

  // Serialize and deserialize the user into / out of the session
  passport.serializeUser((user, done) => done(null, user.username));

  passport.deserializeUser((username, done) => {
    db.Users.findOne({ username: username })
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });

  app.post('/api/register', controller.register);

  app.post('/api/login', passport.authenticate('local'), controller.login);

  app.get('/api/logout', controller.logout);

  app.get('/api/user', controller.user);
  ////////////////////////// End Auth ///////////////////////////////////////

  // Scrape articles (clear all unsaved and grab new ones from NYT)
  app.get('/api/scrape', authenticationMiddleware(), controller.scrape);

  // Get all articles for a user
  app.get('/api/articles', authenticationMiddleware(), controller.articles);

  // Get all saved articles for a user
  app.get('/api/saved', authenticationMiddleware(), controller.saved);

  // Get article with note
  app.get('/api/articles/notes/:id', authenticationMiddleware(), controller.articlesWithNote);

  // Add / update note info
  app.post('/api/articles/notes/:id', authenticationMiddleware(), controller.addUpdateNote);

  // Front end log route
  app.post('/api/log', authenticationMiddleware(), controller.logger);

  // Save an article
  app.put('/api/save/:id', authenticationMiddleware(), controller.articleSave);

  // Unsave an article
  app.delete('/api/save/:id', authenticationMiddleware(), controller.unsaveArticle);

  // Delete all articles
  app.delete('/api/clear', authenticationMiddleware(), controller.deleteAllArticles);
};

// sendError is a simple error handling function to DRY up code
const sendError = (err, res) => {
  if (err) {
    winston.log({ level: 'error', message: err.toString() });
    res.statusCode = 500;
    res.send(err);
  }
};