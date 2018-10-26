import axios from 'axios';

export default {
  
  /////   Auth   //////

  login: loginInfo => axios.post('/api/login', loginInfo),

  register: registerInfo => axios.post('/api/register', registerInfo),

  ///// End Auth /////

  /////   Articles    /////

  scrapeArticles: () => axios.get('/api/scrape'),

  clearArticles: () => axios.delete('/api/clear'),

  savedArticles: () => axios.get('/api/saved'),

  articles: () => axios.get('/api/articles'),

  ///// End Articles /////

  /////   Log   /////

  log: log => axios.post('/api/log', log)
  
  ///// End Log /////

};