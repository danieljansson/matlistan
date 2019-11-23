import React, { Component } from 'react';
import queryString from 'query-string';
import { getListDb } from './listService';
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
    const parsed = queryString.parse(window.location.search);
    console.log('parsed', parsed, window.location.search, 'asdf');
    this.setState({ listId: parsed.listId });
    this.getList(parsed.listId);
  }
  getList = listId => {
    getListDb(listId)
      .then(res => {
        console.log('res', res.express.articles);
        this.setState({ listArticles: res.express.articles });

        console.log('articles', this.state.listArticles);
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
    console.log('listarticle', this.state.listArticles);
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
        />
      </div>
    );
  }
}

export default App;
