const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const articles = [
  { id: 1, name: 'morötter', sortOrder: 1 },
  { id: 2, name: 'mandel', sortOrder: 2 },
  { id: 3, name: 'maränger', sortOrder: 3 },
  { id: 4, name: 'köttfärs', sortOrder: 4 },
  { id: 5, name: 'mjöl', sortOrder: 5 },
  { id: 6, name: 'bröd', sortOrder: 6 },
  { id: 7, name: 'mjölk', sortOrder: 7 },
  { id: 8, name: 'ägg', sortOrder: 8 },
  { id: 9, name: 'smör', sortOrder: 9 },
  { id: 10, name: 'ost', sortOrder: 10 },
  { id: 11, name: 'parmesan', sortOrder: 11 },
  { id: 12, name: 'kyckling', sortOrder: 12 },
  { id: 13, name: 'potatis', sortOrder: 13 },
  { id: 14, name: 'paprika', sortOrder: 14 },
  { id: 15, name: 'sallad', sortOrder: 15 },
  { id: 16, name: 'saffran', sortOrder: 16 },
  { id: 17, name: 'falukorv', sortOrder: 17 },
  { id: 18, name: 'tacokrydda', sortOrder: 18 },
  { id: 19, name: 'tortilla', sortOrder: 19 },
  { id: 20, name: 'majs', sortOrder: 20 },
  { id: 20, name: 'pepparrot', sortOrder: 21 },
];

const lists = [
  {
    id: 1,
    articles: [],
  },
];

app.get('/api/lists/:id', (req, res) => {
  const listId = parseInt(req.params.id);
  list = getList(listId);
  res.send({ express: list });
});

app.get('/api/articleByName/:name?', (req, res) => {
  const { name } = req.params;
  const filteredList = articles.filter(article => {
    return article.name.startsWith(name);
  });

  res.send({
    express: filteredList,
  });
});

app.get('/api/articles/', (req, res) => {
  res.send({
    articles: articles.map(article => {
      return article.name;
    }),
  });
});

app.post('/api/article', (req, res) => {
  if (req.body.name === '') {
    res.status(400).send({
      success: 'false',
      message: 'Name is empty',
    });
  }
  const article = articles.find(article => {
    return article.name === req.body.name;
  });
  if (!article) {
    const articleWithmaxId = articles.sort((a, b) => b.id - a.id)[0];
    const articleWithmaxSortOrder = articles.sort(
      (a, b) => b.sortOrder - a.sortOrder
    )[0];

    articles.push({
      id: articleWithmaxId.id + 1,
      name: req.body.name,
      sortOrder: articleWithmaxSortOrder.sortOrder + 1,
    });

    res.send({ id: articleWithmaxId.id + 1 });
  }
  res.status(400).send({
    success: 'false',
    message: 'Article with that name already exists',
  });
});

app.post('/api/list/:listId/article', (req, res) => {
  const { listId } = req.params;
  const article = getArticle(req.body.articleId);
  list = getList(parseInt(listId));

  if (list.articles.filter(a => a.id === article.id).length === 0) {
    list.articles.push(article);
  }

  res.send({ listId: req.body.listId });
});

const getArticle = articleId => {
  const article = articles.find(article => {
    return article.id === articleId;
  });
  return article;
};
const getList = listId => {
  const list = lists.find(list => {
    return list.id === listId;
  });
  return list;
};

app.listen(port, () => console.log(`Listening on port ${port}`));
