import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import db from '../models/index';
const router = express.Router();


router.get('/api/scrape', (req, res) => {

  // Clear the unsaved articles
  db.Articles.deleteMany({
    saved: false
  })
    .then(() => {
      // Get the html from nytimes
      axios.get('https://www.nytimes.com')

        .then(results => {

          // Load $ cheerio handler
          const $ = cheerio.load(results.data);

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

// errorSend is a simple error handling function to DRY up code
let errorSend = (err, res) => {
  if (err) {
    res.statusCode = 500;
    res.send(err);
  }
};

export default router;
