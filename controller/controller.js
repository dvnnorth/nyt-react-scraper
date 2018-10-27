const db = require('../models/index');
const bcrypt = require('bcrypt');
const cheerio = require('cheerio');
const request = require('request-promise');
const winston = require('../config/winston');

const sendError = (err, res) => {
  if (err) {
    winston.log({ level: 0, message: err.toString() });
    res.statusCode = 500;
    res.send(err);
  }
};

module.exports = {

  /////////////////////////// AUTH ////////////////////////////////

  register: (req, res) => {
    // Get password and generate salt and hashed password
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    db.Users.findOne({ username: req.body.username })
      .then(user => {
        if (user === null) {
          // Create entry in Users table
          const newUser = db.Users({
            username: req.body.username,
            password: hash
          });
          // Save the user
          newUser.save()
            .then(user => {
              req.login(user, err => {
                if (err) throw err;
                res.statusCode = 200;
                res.send(user._id);
              });
            })
            .catch(err => sendError(err, res));
        }
        else {
          res.statusCode = 409;
          res.send('Error: User already exists');
        }
      })
      .catch(err => sendError(err, res));
  },

  login: (req, res) => {
    if (req.isAuthenticated) {
      db.Users.findOne({ username: req.body.username })
        .then(user => {
          res.statusCode = 200;
          res.send(user.username);
        })
        .catch(err => sendError(err, res));
    }
    else {
      res.sendStatus(401);
    }
  },

  logout: (req, res) => {
    req.logout();
    if (process.env.NODE_ENV === 'production') {
      res.redirect('/');
    }
    else {
      res.redirect('http://localhost:3000');
    }
  },

  user: (req, res) => {
    if (req.user) {
      res.statusCode = 200;
      res.send(req.user.username);
    }
    else {
      res.statusCode = 401;
      res.send();
    }
  },

  //////////////////////// END AUTH ///////////////////////////////

  scrape: (req, res) => {

    // Clear the unsaved articles
    db.Articles.deleteMany({
      saved: false,
      user: req.user._id
    })
      .then(() => {

        // Do a query here to get every title of every saved article. Then, in the promise,
        // do all of the below, but for every article that has a title that matches something in saved,
        // don't add it to the articles array to be bulk added

        db.Articles.find({
          saved: true,
          user: req.user._id
        })
          .then(savedArticles => {

            const savedTitles = savedArticles.map(article => article.title);

            // Get the html from nytimes
            request.get('https://www.nytimes.com')
              .then(html => {

                // Load $ cheerio handler
                const $ = cheerio.load(html);

                // articles will hold all of the article objects to be
                // inserted into the database
                let articles = [];

                $('article').each((i, element) => {

                  // Save an empty result object
                  let result = {};

                  // Get the section to exclude the Breifings
                  let section = $(element).closest($('section'))
                    .attr('data-block-tracking-id');

                  if (section !== 'Briefings') {

                    // Add the text and href of every link, and
                    // save them as properties of the result object
                    result.title = $(element)
                      .find('h2')
                      .text();
                    // Store the section for display later
                    result.section = section;
                    // Store the link to the article
                    result.link = `https://www.nytimes.com${$(element)
                      .find('a')
                      .attr('href')}`;
                    // Store a null note for now
                    result.note = null;
                    result.user = req.user._id;
                  }

                  // Only push the article to results if the required
                  // fields exist and it isn't already saved
                  if (result.title && result.section && result.link && !savedTitles.includes(result.title)) {
                    articles.push(result);
                  }
                });

                // Bulk insert all of the article objects
                db.Articles.insertMany(articles, {
                  ordered: false
                })
                  .then(() => {
                    // Get every article
                    db.Articles.find({
                      user: req.user._id
                    })
                      .then(articles => {
                        // Send the articles
                        res.statusCode = 200;
                        res.send(articles);
                      })
                      .catch(err => sendError(err, res)); // Send error if caught
                  })
                  .catch(err => sendError(err, res)); // Send error if caught
              });

          })
          .catch(err => sendError(err, res));
      })
      .catch(err => sendError(err, res));
  },

  articles: (req, res) => {
    db.Articles.find({
      user: req.user._id
    })
      .then(articles => {
        res.statusCode = 200;
        res.send(articles);
      })
      .catch(err => sendError(err, res));
  },

  saved: (req, res) => {
    db.Articles.find({
      user: req.user._id,
      saved: true
    })
      .then(articles => {
        res.statusCode = 200;
        res.send(articles);
      })
      .catch(err => sendError(err, res));
  },

  articlesWithNote: (req, res) => {
    db.Articles.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      // ..and populate note associated with it
      .populate('note')
      .then(article => {
        // If we were able to successfully find an Article with the
        //  given id, send it back to the client
        if (article) {
          res.json(article);
        } else {
          res.sendStatus(404);
        }
      })
      .catch(err => sendError(err, res));
  },

  addUpdateNote: (req, res) => {
    // Create a new note and pass the req.body to the entry
    req.body.user = req.user._id; // Make sure note has current user ID in session as its "user" property
    db.Notes.create(req.body)
      .then(note => {
        db.Articles.findOne({
          _id: req.params.id,
          user: req.user._id
        } /*, { note: note._id }, { new: true }*/)
          .then(article => {
            if (article) {
              article.note = note._id;
              article.new = true;
              article.save(() => {
                res.sendStatus(200);
              });
            } else {
              res.sendStatus(404);
            }
          });
      })
      .catch(err => sendError(err, res));
  },

  logger: (req, res) => {
    winston.log(req.body.level, req.body.message);
    res.sendStatus(204);
  },

  articleSave: (req, res) => {
    db.Articles.findById({
      _id: req.params.id,
      user: req.user._id
    })
      .then(article => {
        article.saved = true;
        article.save(() => {
          res.statusCode = 200;
          res.send(article);
        });
      })
      .catch(err => sendError(err, res));
  },

  unsaveArticle: (req, res) => {
    db.Articles.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .then((article) => {
        article.saved = false;
        article.save(() => {
          res.sendStatus(200);
          res.send(article);
        });
      })
      .catch(err => sendError(err, res));
  },

  deleteAllArticles: (req, res) => {
    db.Articles.deleteMany({
      user: req.user._id
    })
      .then(() => {
        db.Notes.deleteMany({
          user: req.user._id
        })
          .then(() => {
            res.sendStatus(200);
          })
          .catch(err => sendError(err, res));
      })
      .catch(err => sendError(err, res));
  }

};