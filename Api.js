const axios = require('axios');
const scrapping = require('./webScrapping');
const qs = require('qs');

module.exports = {
  getAllChaptersOfManga: (mangaIdentification) => {
    const options = {
      baseURL: 'https://www.inmanga.com/',
      method: 'GET',
      url: `/chapter/getall?mangaIdentification=${mangaIdentification}`
    };
    return axios.request(options)
    .then(result => result.data)
    .then(result => JSON.parse(result.data))
    .then(result => result.result)
  },
  getChapter: (chapterIdentification) => {
    const options = {
      baseURL: 'https://www.inmanga.com/',
      method: 'GET',
      url: `/chapter/chapterIndexControls?identification=${chapterIdentification}`
    };
    return axios.request(options).then(result => result.data)
    .then(scrapping.chapterPage)
  },
  getMangaDescription: (mangaIdentification, mangaName) => {
    const options = {
      baseURL: 'https://www.inmanga.com/',
      method: 'GET',
      url: `/ver/manga/${mangaName.replace(' ', '-')}/${mangaIdentification}`
    };
    return axios.request(options)
      .then(result => result.data)
      .then(scrapping.mangaPage)
  },
  search: (text, skip) => {
    const options = {
      baseURL: 'https://www.inmanga.com/',
      method: 'POST',
      url: '/manga/getMangasConsultResult',
      data: qs.stringify({
        'filter[generes][]': -1,
        'filter[queryString]': text,
        'filter[skip]': skip,
        'filter[take]': 20,
        'filter[sortby]': 1,
        'filter[broadcastStatus]': 0,
        'filter[onlyFavorites]': false,
      })
    };
    return axios.request(options)
      .then(result => result.data)
      .then(scrapping.searchPage)
  }
}