import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import './autocomplete.css';
import { DELETE, BACKSPACE, ENTER, UP, DOWN } from './../utils/keycodeMapper';

class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();

    this.state = {
      // The active selection's index
      activeSuggestion: -1,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: '',
      //startPos
      startPos: 0,
      //endPos
      endPos: 0,
    };
  }

  // Event fired when the input value is changed
  onChange = e => {
    const { suggestions } = this.props;
    let userInput = e.currentTarget.value;
    let firstSuggestion = '';

    console.log('onchange', userInput);

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(suggestion =>
      suggestion.toLowerCase().startsWith(userInput.toLowerCase())
    );
    if (filteredSuggestions.length > 0) {
      firstSuggestion = filteredSuggestions[0];
    } else {
      firstSuggestion = '';
    }

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState(
      {
        activeSuggestion: -1,
        filteredSuggestions,
        showSuggestions: true,
        userInput: firstSuggestion,
        startPos: userInput.length,
        endPos: firstSuggestion.length,
      },
      () => {
        this.selectText(this.state.startPos, this.state.endPos);
      }
    );
  };

  selectText = (startPos, endPos) => {
    this.inputRef.current.setSelectionRange(startPos, endPos);
  };

  // Event fired when the user clicks on a suggestion
  onClick = e => {
    const { selectArticle } = this.props;
    // Update the user input and reset the rest of the state
    console.log('e', e.currentTarget.innerText);
    const article = this.state.filteredSuggestions.find(
      a => a.name === e.currentTarget.innerText
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    });

    selectArticle(article);
  };

  // Event fired when the user presses a key down
  onKeyDown = e => {
    const {
      activeSuggestion,
      filteredSuggestions,
      userInput,
      startPos,
      endPos,
    } = this.state;
    const { selectArticle } = this.props;

    if (e.keyCode === DELETE || e.keyCode === BACKSPACE) {
      console.log(e.currentTarget.value);
      const userInputShort = userInput.substring(0, startPos);
      console.log('userInput', userInputShort);
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: userInputShort,
      });
      e.preventDefault();
    }
    // User pressed the enter key, update the input and close the
    // suggestions
    if (e.keyCode === ENTER) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: '',
      });
      const article = filteredSuggestions[activeSuggestion];

      selectArticle(article);
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === UP) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === DOWN) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = 'suggestion-active';
              }

              return (
                <li
                  className={className}
                  id={suggestion.id}
                  key={suggestion.id}
                  onClick={onClick}
                >
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions, you're on your own!</em>
          </div>
        );
      }
    }

    return (
      <Fragment>
        <input
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
          ref={this.inputRef}
        />
        {suggestionsListComponent}
      </Fragment>
    );
  }
}

export default Autocomplete;
