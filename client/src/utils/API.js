import axios from 'axios';

export default {
  
  ///// Auth //////
  login: loginInfo => axios.post('/api/login', loginInfo),

  scrapeArticles: () => axios.get('/api/scrape'),

  clearArticles: () => axios.delete('/api/clear'),
};