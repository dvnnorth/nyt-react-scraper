const cheerio = require('cheerio');
const request = require('request-promise');
const db = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const controller = require('../controller/controller.js');

// Create the authenticationMiddleware function to validate requests
const authenticationMiddleware = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) return next();
    else {
      res.statusCode = 401;
      res.redirect('/');
    }
  };
};

module.exports = (app, log) => {

  ////////////////////////// Auth ///////////////////////////////////////
  //local strategy used for signing in users
  passport.use(
    new LocalStrategy((username, password, done) => {
      // Retrieve a User object from the database using Sequelize 
      // by username
      //where: { username: username } 
      db.Users.findOne({ where: { username: username } })
        .then((res) => {
          //console.log(res);
          // res is the response from Sequelize in the promise
          // If there's no response, give error message
          if (!res) return done(null, false, { message: 'Incorrect username' });
          // Content (User object) is in res.dataValues
          let user = res.dataValues;
          // Password in the user.password field is already hashed. Store in variable hash
          let hash = user.password;
          // Compare the password (using the hash in session)
          bcrypt.compare(password, hash, (err, res) => {
            // res is the results of the comparison (true or false)
            if (err) return done(err);
            if (res) {
              //console.log(user);
              usernamed = user.username;
              return done(null, user);
            }
            else {
              return done(null, false, { message: 'Incorrect password' });
            }
          });
        });
    })
  );

  // Serialize and deserialize the user into / out of the session
  passport.serializeUser((user, done) => done(null, user.username));

  passport.deserializeUser((username, done) => {
    db.Users.findOne({ where: { username: username } })
      .then(res => {
        done(null, res.dataValues);
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

  app.get('/api/scrape', authenticationMiddleware(), controller.scrape);

  // Get article with note
  app.get('/api/articles/notes/:id', authenticationMiddleware(), controller.articlesWithNote);

  // Add / update note info
  app.post('/api/articles/notes/:id', authenticationMiddleware(), controller.addUpdateNote);

  // Modal builder
  app.post('/api/modal', authenticationMiddleware(), controller.modalBuilder); 

  // Front end log route
  app.post('/api/log', authenticationMiddleware(), controller.logger);

  // Save an article
  app.put('/api/save/:id', authenticationMiddleware(), controller.articleSave);

  // Unsave an article
  app.delete('/api/save/:id', authenticationMiddleware(), controller.deleteArticle);

  // Delete all articles
  app.delete('/api/clear', authenticationMiddleware(), controller.deleteAllArticles);
};

// errorSend is a simple error handling function to DRY up code
let errorSend = (err, res) => {
  if (err) {
    res.statusCode = 500;
    res.send(err);
  }
};