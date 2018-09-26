const cheerio = require('cheerio');
const request = require('request-promise');
const db = require('../models');

module.exports = (app, log) => {

  app.get('/api/scrape', (req, res) => {

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
  });

  // Get article with note
  app.get('/api/articles/notes/:id', (req, res) => {
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
  });

  // Add / update note info
  app.post('/api/articles/notes/:id', (req, res) => {
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
  });

  // Modal builder
  app.post('/api/modal', (req, res) => {
    res.render('modal', {
      content: req.body
    });
  });

  // Front end log route
  app.post('/api/log', (req, res) => {
    log(req.body.level, req.body.message);
    res.sendStatus(500);
  });

  // Save an article
  app.put('/api/save/:id', (req, res) => {
    db.Articles.findById(req.params.id)
      .then(article => {
        article.saved = true;
        article.save(() => {
          res.statusCode = 200;
          res.send(article);
        });
      })
      .catch(err => errorSend(err, res));
  });

  // Unsave an article
  app.delete('/api/save/:id', (req, res) => {
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
  });

  // Delete all articles
  app.delete('/api/clear', (req, res) => {
    db.Articles.deleteMany({})
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => errorSend(err, res));
  });
};

// errorSend is a simple error handling function to DRY up code
let errorSend = (err, res) => {
  if (err) {
    res.statusCode = 500;
    res.send(err);
  }
};