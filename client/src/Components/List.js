import React, { Component } from 'react';
import './list.css';

const placeholder = document.createElement('li');
placeholder.className = 'placeholder';

export default class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseOverArticle: '',
      ...props,
    };
    console.log('listId', props);
  }

  dragStart = e => {
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.dragged);
  };
  dragEnd = e => {
    this.dragged.style.display = 'block';
    this.dragged.parentNode.removeChild(placeholder);

    // update state
    const { articles, updateListOrder } = this.props;
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id);

    if (from < to) to--;

    articles.splice(to, 0, articles.splice(from, 1)[0]);
    const updatedArticleId = articles[to].id;
    const sortOrderBefore = articles[to].sortOrder;
    let sortOrderAfter;
    if (to === 0) {
      sortOrderAfter = articles[to + 1].sortOrder - 1;
    } else {
      sortOrderAfter = articles[to - 1].sortOrder + 1;
    }

    updateListOrder(
      articles,
      sortOrderBefore,
      sortOrderAfter,
      updatedArticleId
    );
  };
  dragOver = e => {
    e.preventDefault();
    this.dragged.style.display = 'none';
    if (e.target.className === 'placeholder') return;
    this.over = e.target;
    e.target.parentNode.insertBefore(placeholder, e.target);
  };

  setMouseOverArticle = id => {
    this.setState({ mouseOverArticle: id });
  };
  clearMouseOverArticle = () => {
    this.setState({ mouseOverArticle: -1 });
  };

  render() {
    const { articles, deleteArticleFromList } = this.props;
    const { mouseOverArticle } = this.state;

    const listItems = articles.map((item, i) => {
      return (
        <li
          data-id={i}
          key={item.id}
          draggable="true"
          onDragEnd={this.dragEnd}
          onDragStart={this.dragStart}
          onMouseOver={() => this.setMouseOverArticle(item.id)}
        >
          <span>{item.name}</span>

          {mouseOverArticle === item.id ? (
            <span onClick={() => deleteArticleFromList(item.id)}>(X)</span>
          ) : (
            ''
          )}
        </li>
      );
    });
    return (
      <div className="shoppinglist">
        {' '}
        <ul onDragOver={this.dragOver}>{listItems}</ul>
      </div>
    );
  }
}
