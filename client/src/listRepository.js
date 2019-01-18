export async function getArticleByNameDb(articleName) {
  const response = await fetch('/api/articleByName/' + articleName);
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
}

export async function getListDb(listId) {
  const response = await fetch('/api/lists/' + listId);
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
}

export async function getArticlesDb() {
  const response = await fetch('/api/articles/');
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
}

export async function AddArticleDb(newArticleName) {
  const response = await fetch('/api/article', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: newArticleName,
    }),
  });
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
}

export async function addToListDb(selectedArticleId, listId) {
  const response = await fetch(`/api/list/${listId}/article`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      articleId: selectedArticleId,
      listId: listId,
    }),
  });
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
}

export async function updateListOrder(listId, articles) {
  const response = await fetch(`/api/list/${listId}/articles`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      articles: articles,
    }),
  });
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
}
