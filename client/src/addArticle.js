import React, { Component } from 'react';
import {
  addToListDb,
  AddArticleDb,
  getArticlesDb,
  getListDb,
} from './listRepository';
import Autocomplete from './Autocomplete';

class AddArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleToAdd: '',
      potentialArticles: [],
      allArticles: [],
    };
  }

  componentDidMount() {
    this.getArticlesNotInList();
  }

  IdExistsInList = (id, list) => {
    return list.some(a => a.id === id);
  };

  getArticlesNotInList = (articles, list) => {
    return articles.filter(a => {
      return !this.IdExistsInList(a.id, list);
    });
  };

  getArticlesNotInList = async () => {
    getArticlesDb()
      .then(res => {
        const articles = res.articles;
        getListDb(this.props.listId)
          .then(res => {
            const filteredArticles = articles.filter(a => {
              return !this.IdExistsInList(a.id, res.express.articles);
            });
            this.setState({ allArticles: filteredArticles });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  selectArticle = async article => {
    this.getArticlesNotInList();
    this.setState({ articleToAdd: article });
  };

  addToList = async event => {
    event.preventDefault();
    if (this.state.articleToAdd.id) {
      addToListDb(this.state.articleToAdd.id, this.props.listId)
        .then(res => {
          this.setState({ articleToAdd: '' });
          this.setState({ selectedArticleId: '' });

          this.props.getList(res.listId);
        })
        .catch(err => console.log(err));
    } else {
      AddArticleDb(this.state.articleToAdd.name)
        .then(res => {
          addToListDb(res.id, this.props.listId)
            .then(res => {
              this.setState({ articleToAdd: '' });
              this.setState({ selectedArticleId: '' });

              this.props.getList(res.listId);
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.addToList}>
          {/* <input
            onChange={e => this.getArticleByName(e)}
            value={this.state.articleToAdd}
          /> */}
          <Autocomplete
            suggestions={this.state.allArticles}
            selectArticle={this.selectArticle}
          />
          <button type="submit">Add</button>
        </form>
      </div>
    );
  }
}

export default AddArticle;
