import React, { Component } from 'react';
import queryString from 'query-string';
import { getListDb, deleteFromList } from './listService';
import AddArticle from './Components/AddArticle';
import List from './Components/List';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listArticles: [],
      listId: '',
    };
  }
  componentDidMount() {
    const { listId } = queryString.parse(window.location.search);
    this.setState({ listId: listId });
    this.getList(listId);
  }
  getList = listId => {
    getListDb(listId)
      .then(res => {
        this.setState({ listArticles: res.express.articles });
      })
      .catch(err => console.log(err));
  };

  deleteArticleFromList = articleid => {
    const { listId } = this.state;
    deleteFromList(articleid, listId)
      .then(res => {
        this.getList(res.listId);
      })
      .catch(err => console.log(err));
  };

  updateListOrder = (
    articles,
    sortOrderBefore,
    sortOrderAfter,
    updatedArticleId
  ) => {
    this.state.listArticles.map(a => {
      //moving down in list
      if (sortOrderAfter > sortOrderBefore) {
        if (a.sortOrder < sortOrderBefore && a.sortOrder <= sortOrderAfter) {
          a.sortOrder--;
        }
      } //moving up in list
      else if (sortOrderAfter < sortOrderBefore) {
        if (a.sortOrder <= sortOrderBefore && a.sortOrder > sortOrderAfter) {
          a.sortOrder++;
        }
      }

      return a;
    });
    this.state.listArticles.map(a => {
      if (a.id === updatedArticleId) {
        a.sortOrder = sortOrderAfter;
      }
      return a;
    });
    this.setState({ listArticles: articles });
  };

  render() {
    const { listId, listArticles } = this.state;

    return (
      <div className="App">
        <AddArticle listId={listId} getList={this.getList} />
        <List
          articles={listArticles.sort((a, b) => a.sortOrder - b.sortOrder)}
          updateListOrder={this.updateListOrder}
          deleteArticleFromList={this.deleteArticleFromList}
        />
      </div>
    );
  }
}

export default App;
