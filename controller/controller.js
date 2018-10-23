const db = require('../models/index');
const bcrypt = require('bcrypt');

const sendError = (err, res) => {
  if (err) {
    console.log('sending error');
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

    // Create entry in Users table
    const newUser = db.Users({
      username: req.body.username,
      password: hash
    });

    newUser.save()
      .then(user => {
        req.login(user, err => {
          if (err) throw err;
          res.statusCode = 200;
          res.send(user._id);
        });
      })
      .catch(err => sendError(err, res));
  },

  success: (req, res) => {
    db.Users.findOne({ where: { username: req.params.username } })
      .then(response => {
        res.statusCode = 200;
        res.send(response);
      })
      .catch(err => sendError(err, res));
  },


  login: (req, res) => {
    console.log(req.body);
    if (req.isAuthenticated) {
      console.log(req.body.username);
      db.Users.findOne({ where: { username: req.body.username } })
        .then(data => {
          //console.log(req.body.username);
          res.statusCode = 200;
          res.send(data.dataValues.username);
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
      saved: false
    })
      .then(() => {
        // Get the html from nytimes
        request.get('https://www.nytimes.com')

          .then(html => {

            // Load $ cheerio handler
            const $ = cheerio.load(html);

            // articles will hold all of the article objects to be
            // inserted into the database
            let articles = [];

            $('article').each(function () {

              // Save an empty result object
              let result = {};

              // Get the section to exclude the Breifings
              let section = $(this).closest($('section'))
                .attr('data-block-tracking-id');

              if (section !== 'Briefings') {

                // Add the text and href of every link, and
                // save them as properties of the result object
                result.title = $(this)
                  .find('h2')
                  .text();
                // Store the section for display later
                result.section = section;
                // Store the link to the article
                result.link = `https://www.nytimes.com${$(this)
                  .find('a')
                  .attr('href')}`;
                // Store a null note for now
                result.note = null;
              }

              // Only push the article to results if the required
              // fields exist
              if (result.title && result.section && result.link) {
                articles.push(result);
              }
            });

            // Bulk insert all of the article objects
            db.Articles.insertMany(articles, {
              ordered: false
            })
              .then(() => {
                // Get every article
                db.Articles.find({})
                  .then(articles => {
                    // Send the articles
                    res.statusCode = 200;
                    res.send(articles);
                  })
                  .catch(err => errorSend(err, res)); // Send error if caught
              })
              .catch(err => errorSend(err, res)); // Send error if caught
          });
      })
      .catch(err => errorSend(err, res));
  },

  articlesWithNote: (req, res) => {
    db.Articles.findOne({
      _id: req.params.id
    })
      // ..and populate all of the notes associated with it
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
      .catch(err => errorSend(err, res));
  },

  addUpdateNote: (req, res) => {
    // Create a new note and pass the req.body to the entry
    db.Notes.create(req.body)
      .then(note => {
        db.Articles.findOne({
          _id: req.params.id
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
      .catch(err => errorSend(err, res));
  },

  modalBuilder: (req, res) => {
    res.render('modal', {
      content: req.body
    });
  },

  logger: (req, res) => {
    log(req.body.level, req.body.message);
    res.sendStatus(500);
  },

  articleSave: (req, res) => {
    db.Articles.findById(req.params.id)
      .then(article => {
        article.saved = true;
        article.save(() => {
          res.statusCode = 200;
          res.send(article);
        });
      })
      .catch(err => errorSend(err, res));
  },

  deleteArticle: (req, res) => {
    db.Articles.findOne({
      _id: req.params.id
    })
      .then((article) => {
        article.saved = false;
        article.save(() => {
          res.sendStatus(200);
        });
      })
      .catch(err => errorSend(err, res));
  },

  deleteAllArticles: (req, res) => {
    db.Articles.deleteMany({})
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => errorSend(err, res));
  }

};