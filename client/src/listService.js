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

export async function addArticleDb(newArticleName) {
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

export async function addToListDb(selectedArticleName, listId) {
  const response = await fetch(`/api/list/${listId}/article`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      article: selectedArticleName,
      listId: listId,
    }),
  });
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
}

export async function deleteFromList(articleId, listId) {
  const response = await fetch(`/api/list/${listId}/article`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      article: articleId,
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
