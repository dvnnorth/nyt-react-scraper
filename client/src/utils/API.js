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

  saveArticle: articleId => axios.put(`/api/save/${articleId}`),

  unsaveArticle: articleId => axios.delete(`/api/save/${articleId}`),

  ///// End Articles /////

  /////   Notes   /////

  getArticleWithNote: articleId => axios.get(`/api/articles/notes/${articleId}`),

  addUpdateNote: (articleId, noteData) => axios.post(`/api/articles/notes/${articleId}`, noteData),

  ///// End Notes /////

  /////   Log   /////

  log: log => axios.post('/api/log', log)

  ///// End Log /////

};