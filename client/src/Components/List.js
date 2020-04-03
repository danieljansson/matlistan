import React, { Component } from 'react';
import queryString from 'query-string';
import AddArticle from './AddArticle';
import {
  getListDb,
  deleteFromList,
  addToListDb,
  getArticlesDb,
} from './../listService';
import './list.css';

export default class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseOverArticle: '',
      listId: '',
      listArticles: [],
      articleToAdd: '',
      allArticles: [],
      lastAddedarticle: '',
    };
  }
  async componentDidMount() {
    await this.getAllArticles();
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

  getAllArticles = async () => {
    getArticlesDb()
      .then(res => {
        this.setState({ allArticles: res.articles });
      })
      .catch(err => console.log(err));
  };

  selectArticle = async article => {
    await this.getAllArticles();
    this.setState({ articleToAdd: article });
  };

  addToList = async event => {
    const { listId, articleToAdd } = this.state;

    event.preventDefault();
    if (articleToAdd) {
      this.setState({ lastAddedarticle: articleToAdd });

      setTimeout(() => {
        this.setState({ lastAddedarticle: '' });
      }, 1000);

      addToListDb(articleToAdd, listId)
        .then(res => {
          this.setState({ articleToAdd: '' });
          this.setState({ selectedArticleId: '' });

          this.getList(listId);
        })
        .catch(err => console.log(err));
    }
  };

  deleteArticleFromList = articleid => {
    const { listId } = this.state;

    deleteFromList(articleid, listId)
      .then(res => {
        this.getList(res.listId);
      })
      .catch(err => console.log(err));
  };

  setMouseOverArticle = id => {
    this.setState({ mouseOverArticle: id });
  };
  clearMouseOverArticle = () => {
    this.setState({ mouseOverArticle: -1 });
  };

  render() {
    const {
      mouseOverArticle,
      listArticles,
      lastAddedarticle,
      allArticles,
    } = this.state;

    const showDeleteButton = itemId => {
      if (mouseOverArticle === itemId) return 'block';
      else return 'none';
    };

    const isNewlyAddedArticle = article => {
      if (lastAddedarticle === article) return 'newlyAdded';
      else return '';
    };

    const sortedListArticle = listArticles.sort((a, b) => {
      return a.sortOrder - b.sortOrder;
    });

    const listItems = sortedListArticle.map((item, i) => {
      return (
        <li
          data-id={i}
          key={item.id}
          onMouseOver={() => this.setMouseOverArticle(item.id)}
          onMouseOut={() => this.clearMouseOverArticle(item.id)}
        >
          <div>
            <span className={isNewlyAddedArticle(item.name)}>{item.name}</span>

            <span
              style={{
                display: showDeleteButton(item.id),
                position: 'relative',
                float: 'right',
              }}
              onClick={() => this.deleteArticleFromList(item.id)}
            >
              &#10006;
            </span>
          </div>
        </li>
      );
    });
    return (
      <div>
        <div>
          <AddArticle
            selectArticle={this.selectArticle}
            addToList={this.addToList}
            allArticles={allArticles}
          />
        </div>
        <div className="shoppinglist">
          <ul onDragOver={this.dragOver}>{listItems}</ul>
        </div>
      </div>
    );
  }
}

// updateListOrder = (
//   articles,
//   sortOrderBefore,
//   sortOrderAfter,
//   updatedArticleId
// ) => {
//   this.state.listArticles.map(a => {
//     //moving down in list
//     if (sortOrderAfter > sortOrderBefore) {
//       if (a.sortOrder < sortOrderBefore && a.sortOrder <= sortOrderAfter) {
//         a.sortOrder--;
//       }
//     } //moving up in list
//     else if (sortOrderAfter < sortOrderBefore) {
//       if (a.sortOrder <= sortOrderBefore && a.sortOrder > sortOrderAfter) {
//         a.sortOrder++;
//       }
//     }

//     return a;
//   });
//   this.state.listArticles.map(a => {
//     if (a.id === updatedArticleId) {
//       a.sortOrder = sortOrderAfter;
//     }
//     return a;
//   });
//   this.setState({ listArticles: articles });
// };

// dragStart = e => {
//   this.dragged = e.currentTarget;
//   e.dataTransfer.effectAllowed = 'move';
//   e.dataTransfer.setData('text/html', this.dragged);
// };
// dragEnd = e => {
//   this.dragged.style.display = 'block';
//   this.dragged.parentNode.removeChild(placeholder);

//   // update state
//   const { articles, updateListOrder } = this.props;
//   var from = Number(this.dragged.dataset.id);
//   var to = Number(this.over.dataset.id);

//   if (from < to) to--;

//   articles.splice(to, 0, articles.splice(from, 1)[0]);
//   const updatedArticleId = articles[to].id;
//   const sortOrderBefore = articles[to].sortOrder;
//   let sortOrderAfter;
//   if (to === 0) {
//     sortOrderAfter = articles[to + 1].sortOrder - 1;
//   } else {
//     sortOrderAfter = articles[to - 1].sortOrder + 1;
//   }

//   updateListOrder(
//     articles,
//     sortOrderBefore,
//     sortOrderAfter,
//     updatedArticleId
//   );
// };
// dragOver = e => {
//   e.preventDefault();
//   this.dragged.style.display = 'none';
//   if (e.target.className === 'placeholder') return;
//   this.over = e.target;
//   e.target.parentNode.insertBefore(placeholder, e.target);
// };
