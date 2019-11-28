import React, { Component } from 'react';
import { addToListDb, getArticlesDb } from './../listService';
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
    this.getArticles();
  }

  getArticles = async () => {
    getArticlesDb()
      .then(res => {
        this.setState({ allArticles: res.articles });
      })
      .catch(err => console.log(err));
  };

  selectArticle = async article => {
    this.getArticles();
    this.setState({ articleToAdd: article });
  };

  addToList = async event => {
    event.preventDefault();
    if (this.state.articleToAdd) {
      addToListDb(this.state.articleToAdd, this.props.listId)
        .then(res => {
          this.setState({ articleToAdd: '' });
          this.setState({ selectedArticleId: '' });

          this.props.getList(res.listId);
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <div className="autocomplete">
        <form onSubmit={this.addToList}>
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
