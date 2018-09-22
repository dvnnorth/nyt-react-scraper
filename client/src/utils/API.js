import axios from 'axios';

export default {
  scrapeArticles: () => axios.get('/api/scrape')
};