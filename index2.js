const Api = require('./Api');

function getChapter(chapter) {
  return Api.getChapter(chapter.identification)
    .then(pages => ({
      manga: chapter.mangaName,
      chapterNumber: chapter.number,
      pages: pages,
    }))
    .then(console.log)
    .catch(console.log);
}

function getManga(identification, mangaName) {
  return Promise.all([Api.getMangaDescription(identification, mangaName) , Api.getAllChaptersOfManga(identification)])
    .then(([description, chapters]) => ({
      name: mangaName,
      identification,
      description,
      chapters: chapters.map(chapter => ({
        mangaName: mangaName,
        identification: chapter.Identification,
        number: chapter.Number,
        pages: chapter.PagesCount
      }))
    }))
}

function search(text, skip = 0) {
  return Api.search(text,skip)
}

module.exports = {
  // downloadChapter, // ?
  getChapter,
  getManga,
  search
}