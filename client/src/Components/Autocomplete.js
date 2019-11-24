import React, { Component, Fragment } from 'react';
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

  componentDidMount() {
    this.inputRef.current.focus();
  }

  // Event fired when the input value is changed
  onChange = e => {
    const { suggestions } = this.props;
    const { userInput } = this.state;

    let userInsertedInput = e.currentTarget.value;

    console.log('userInsertedInput', userInsertedInput);

    if (userInsertedInput.length < 1) {
      this.setState({
        activeSuggestion: -1,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: userInsertedInput,
      });
      return;
    }

    // if (userInput.length - 1 === userInsertedInput.length) {
    //   this.setState({
    //     userInput: userInsertedInput,
    //   });
    //   return;
    // }

    let firstSuggestion = '';

    // Filter our suggestions that don't contain the user's input
    let filteredSuggestions = suggestions.filter(suggestion =>
      suggestion.toLowerCase().startsWith(userInsertedInput.toLowerCase())
    );
    console.log(filteredSuggestions);
    //.sort((a, b) => a.name.localeCompare(b.name));

    if (filteredSuggestions.length > 0) {
      // filteredSuggestions = filteredSuggestions.sort((a, b) =>
      //   a.name.localeCompare(b.name)
      // );

      firstSuggestion = filteredSuggestions[0];
    } else {
      firstSuggestion = userInsertedInput;
    }

    console.log(firstSuggestion, userInsertedInput);
    let startPos = 0;
    if (firstSuggestion !== userInsertedInput) {
      startPos = userInsertedInput.length;
    }
    console.log('startpos', startPos);
    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState(
      {
        activeSuggestion: -1,
        filteredSuggestions,
        showSuggestions: true,
        userInput: firstSuggestion,
        startPos: startPos, // userInsertedInput.length,
        endPos: firstSuggestion.length,
      },
      () => {
        this.selectText(this.state.startPos, this.state.endPos);
      }
    );
  };

  selectText = (startPos, endPos) => {
    if (startPos > 0) {
      this.inputRef.current.setSelectionRange(startPos, endPos);
    }
  };

  // Event fired when the user clicks on a suggestion
  onClick = e => {
    const { selectArticle } = this.props;
    // Update the user input and reset the rest of the state

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    });

    selectArticle(e.currentTarget.innerText);
  };

  // Event fired when the user presses a key down
  onKeyDown = e => {
    const {
      activeSuggestion,
      filteredSuggestions,
      userInput,
      startPos,
    } = this.state;
    const { selectArticle } = this.props;

    if (e.keyCode === DELETE || e.keyCode === BACKSPACE) {
      console.log('e.currentTarget.innerText', e.currentTarget);
      if (startPos > 0) {
        const userInputShort = userInput.substring(0, startPos);

        this.setState({
          activeSuggestion: -1,
          showSuggestions: true,
          userInput: userInputShort,
          startPos: 0,
        });
        e.preventDefault();
      }
    }
    // User pressed the enter key, update the input and close the
    // suggestions
    if (e.keyCode === ENTER) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: '',
      });

      selectArticle(userInput);
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
              if (index === 0) return;

              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = 'suggestion-active';
              }

              return (
                <li className={className} key={index} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      }
      // else {
      //   suggestionsListComponent = (
      //     <div className="no-suggestions">
      //       <em>No suggestions, you're on your own!</em>
      //     </div>
      //   );
      // }
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
