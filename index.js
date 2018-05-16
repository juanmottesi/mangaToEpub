const axios = require('axios');
const cheerio = require('cheerio');
const Epub = require("epub-gen");

function getAllChapters(manga) {
  const options = {
    baseURL: 'https://www.inmanga.com/',
    method: 'GET',
    url: `/chapter/getall?mangaIdentification=${manga.mangaIdentification}`
  };
  return axios.request(options)
    .then(result => result.data)
    .then(result => JSON.parse(result.data).result)
    .catch(console.log)
}

function selectChapters(chapters, chaptersNumbers) {
  const selectedChapters = chapters.filter(chapter => chaptersNumbers.includes(chapter.Number));
  return selectedChapters ? Promise.resolve(selectedChapters) : Promise.reject(new Error('Chapters Numbers not found'));
}

function scraping(page) {
  const dom = cheerio.load(page);
  const listOfOptions = dom('#PageList');
  const result = [];
  if (listOfOptions.length > 0) {
    const options = listOfOptions.children();
    for(let i = 0; i < (options.length / 2); i++) {
      const id = options[i].attribs.value;
      const pageNumber = options[i].children[0].data;
      result.push({
        id,
        pageNumber
      });
    }
  }
  return result;
}

function collectImagesIdentifierOf(manga, chapter) {
  const options = {
    baseURL: 'https://www.inmanga.com/',
    method: 'GET',
    url: `/ver/manga/${manga.urlName}/${chapter.Number}/${chapter.Identification}`
  };
  // const regex = new RegExp(, 'g');
  return axios.request(options)
    .then(result => result.data)
    .then((page) => {
      const pages = scraping(page);
      return {
        manga: manga,
        chapterNumner: chapter.Number,
        pages: pages,
        }
    })
}

function createData(information) {
  const sortedPages = information.pages.sort((a, b) => parseInt(a.pageNumber) - parseInt(b.pageNumber));
  return `<div> ${sortedPages.reduce((res, page) => res.concat(`<img src="https://www.inmanga.com//page/getPageImage/?identification=${page.id}"></img>`), '')} </div>`
}

function createEpub(information) {
  const option = {
    title: `${information.manga.name} - ${information.chapterNumner}`,
    author: information.manga.name,
    content: [{ data: createData(information) }]
  }
  return new Epub(option, `${information.manga.name} - ${information.chapterNumner}.epub`);
}

function chapterFromTo(x, y) {
  return Array(y - x + 1).fill().map((e, i) => i + x);
}

function execute(manga, chaptersNumbers) {
  getAllChapters(manga)
    .then(chapters => selectChapters(chapters, chaptersNumbers))
    .then(selectedChapters => {
      selectedChapters.forEach(chapter => {
        collectImagesIdentifierOf(manga, chapter)
          .then(createEpub)
          .catch(console.log);
      });
    })
    .catch(console.log); 
}

execute({ name: 'Bleach', mangaIdentification: '92ef1c08-d79b-4485-ba5c-2588a7fd25b4' }, chapterFromTo(1,50))
