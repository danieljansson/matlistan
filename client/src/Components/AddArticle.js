import React, { Component } from 'react';
import Autocomplete from './Autocomplete';

class AddArticle extends Component {
  render() {
    return (
      <div className="autocomplete">
        <form onSubmit={this.props.addToList}>
          <Autocomplete
            suggestions={this.props.allArticles}
            selectArticle={this.props.selectArticle}
          />
          <button type="submit">Add</button>
        </form>
      </div>
    );
  }
}

export default AddArticle;
