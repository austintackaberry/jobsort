import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import glamorous, {Div} from 'glamorous';
import {css} from 'glamor';
import matchSorter from 'match-sorter';

class InputTechnologies extends Component {
  /* istanbul ignore next */
  constructor() {
    super();
    this.state = {
      inputValue: '',
    };
    this.addTechnology = this.addTechnology.bind(this);
    this.removeTechnology = this.removeTechnology.bind(this);
    this.stateReducer = this.stateReducer.bind(this);
  }

  addTechnology(lastUserAddedTechnology) {
    if (lastUserAddedTechnology === undefined) {
      lastUserAddedTechnology = this.state.inputValue;
    }
    const userTechnologies = this.props.userTechnologies.slice();
    const allTechs = this.props.allTechs.slice();
    if (
      !userTechnologies.some(
        element => element.language === lastUserAddedTechnology
      ) &&
      allTechs.includes(lastUserAddedTechnology)
    ) {
      this.setState({ inputValue: '' });
      this.props.addTechnology(lastUserAddedTechnology);
    }
  }

  removeTechnology(event) {
    const index = event.target.id.slice(-1);
    this.props.removeTechnology(parseInt(index));
  }

  stateReducer(state, changes) {
    console.log(changes);
    switch (changes.type) {
      case Downshift.stateChangeTypes.changeInput:
        if (this.state.inputValue === "") {
          return {
            ...changes,
            isOpen:false
          }
        }
        return changes
      default:
        return changes
    }
  }

  render() {
    const userTechnologies = this.props.userTechnologies.slice();
    const userTechnologiesJSX = [];
    for (let i = 0; i < userTechnologies.length; i += 1) {
      userTechnologiesJSX.push(
        <div className="user-lang-div" key={userTechnologies[i].id}>
          <button
            id={`langButt${i}`}
            className="exit"
            onClick={this.removeTechnology}
          >
            &#10006;
          </button>
          <span className="user-lang-span">{userTechnologies[i].language}</span>
        </div>
      );
    }

    const allTechs = this.props.allTechs.slice();

    return (
      <div className="content-group">
        <h3 className="instructions">input technologies that you know</h3>
        <div style={{ marginTop: '7px' }}>
          <form
            id="addTechnologyForm"
            onSubmit={(event)=>event.preventDefault()}
          >
          <Downshift
            stateReducer={this.stateReducer}
            onChange={selection => {
              this.addTechnology(selection);
            }}
            inputValue={this.state.inputValue}
            render={({
              getInputProps,
              getItemProps,
              getLabelProps,
              isOpen,
              inputValue,
              highlightedIndex,
              selectedItem,
              clearSelection,
            }) => (
              <div style={{ display: 'inline-block', position: 'relative' }}>
                  <label {...getLabelProps()} />
                  <input
                    {...getInputProps({
                      className: 'textbox',
                      'data-lpignore': 'true',
                      name: 'technologies',
                      list: 'technologies',
                      placeholder: 'technology',
                      onChange: e => {
                        this.setState({ inputValue: e.target.value });
                        clearSelection();
                      },
                      onKeyDown: e => {
                        if (e.key === "Enter") {
                          this.addTechnology();
                        }
                      }
                    })}
                  />
                  <input type="submit" id="add" value="add" />
                  {isOpen ? (
                    <div
                      style={{
                        display: 'block',
                        position: 'absolute',
                        zIndex: 1,
                        width: '175px',
                      }}
                    >
                      {matchSorter(allTechs, inputValue)
                        .filter(i => !inputValue || i.includes(inputValue))
                        .map((item, index) => (
                          <div
                            {...getItemProps({
                              key: item,
                              index,
                              item,
                              style: {
                                backgroundColor:
                                  highlightedIndex === index
                                    ? 'lightgray'
                                    : 'white',
                                fontWeight:
                                  selectedItem === item ? 'bold' : 'normal',
                              },
                            })}
                          >
                            {item}
                          </div>
                        ))}
                    </div>
                  ) : null}
              </div>
            )}
          />
        </form>
        </div>
        {userTechnologiesJSX}
      </div>
    );
  }
}

InputTechnologies.propTypes = {
  userTechnologies: PropTypes.arrayOf(PropTypes.object).isRequired,
  allTechs: PropTypes.arrayOf(PropTypes.string).isRequired,
  addTechnology: PropTypes.func.isRequired,
  removeTechnology: PropTypes.func.isRequired,
};

export default InputTechnologies;
