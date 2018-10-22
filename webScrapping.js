const cheerio = require('cheerio');

function chapterPage(page) {
  const dom = cheerio.load(page);
  const listOfOptions = dom('#PageList');
  const result = [];
  if (listOfOptions.length > 0) {
    const options = listOfOptions.children();
    for (let i = 0; i < (options.length / 2); i++) {
      const id = options[i].attribs.value;
      const pageNumber = options[i].children[0].data;
      result.push({
        id,
        pageNumber,
        page: `https://www.inmanga.com/page/getPageImage/?identification=${id}`,
      });
    }
  }
  return result;
}

function mangaPage(page) {
  const dom = cheerio.load(page);
  return dom('.panel-body').text();
}

function searchPage(page) {
  const dom = cheerio.load(page);
  const listOfMangas = dom('a');
  const result = [];
  listOfMangas.each((i,element) => {
    const mangaName = dom(element).find('h4').find('em').get(0).next.data.trim();
    const state = dom(element).find('span.label').get(0).children[0].data.trim();
    result.push({
      identification: dom(element).attr('href').split('/').pop(),
      mangaName,
      state
    })
  })
  return result;
}

module.exports = {
  chapterPage,
  mangaPage,
  searchPage
}