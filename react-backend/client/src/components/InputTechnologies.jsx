import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';

class InputTechnologies extends Component {
  /* istanbul ignore next */
  constructor() {
    super();
    this.state = {
      lastUserAddedTechnology: '',
    };
    this.addTechnology = this.addTechnology.bind(this);
    this.addTechnologyFromAddButton = this.addTechnologyFromAddButton.bind(
      this
    );
    this.removeTechnology = this.removeTechnology.bind(this);
  }

  addTechnologyFromAddButton(event) {
    event.preventDefault();
    this.addTechnology(this.state.lastUserAddedTechnology.toLowerCase());
  }

  addTechnology(lastUserAddedTechnology) {
    const userTechnologies = this.props.userTechnologies.slice();
    const allTechs = this.props.allTechs.slice();
    if (
      !userTechnologies.some(
        element => element.language === lastUserAddedTechnology
      ) &&
      allTechs.includes(lastUserAddedTechnology)
    ) {
      // this.lastUserAddedTechnology.value = '';
      console.log('should be deleted');
      this.props.addTechnology(lastUserAddedTechnology);
    }
    event.preventDefault();
  }

  removeTechnology(event) {
    const index = event.target.id.slice(-1);
    this.props.removeTechnology(index);
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
    // let allTechsJSX = [];
    // for (let i = 0; i < allTechs.length; i += 1) {
    //   allTechsJSX.push(<option value={allTechs[i]} key={i} />);
    // }
    // allTechsJSX = [
    //   <datalist id="technologies" key={0}>
    //     {allTechsJSX}
    //   </datalist>,
    // ];

    return (
      <div className="content-group">
        <h3 className="instructions">input technologies that you know</h3>
        <div style={{ marginTop: '7px' }}>
          <form
            id="addTechnologyForm"
            onSubmit={e => this.addTechnologyFromAddButton(e)}
          >
            {/* <input
              id="userLangInput"
              className="textbox"
              data-lpignore="true"
              list="technologies"
              name="technologies"
              ref={el => {
                this.lastUserAddedTechnology = el;
              }}
            /> */}
            {/* {allTechsJSX} */}
            <Downshift
              onChange={selection => {
                console.log(this.lastUserAddedTechnology.value);
                this.addTechnology(selection);
                this.lastUserAddedTechnology.value = '';
                console.log(this.lastUserAddedTechnology.value);
              }}
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
                      onChange: clearSelection,
                      ref: el => {
                        this.lastUserAddedTechnology = el;
                      },
                    })}
                  />
                  <input type="submit" id="add" value="add" />
                  {isOpen ? (
                    <div
                      style={{
                        display: 'block',
                        position: 'absolute',
                        zIndex: 1,
                        width: "175px"
                      }}
                    >
                      {allTechs
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
