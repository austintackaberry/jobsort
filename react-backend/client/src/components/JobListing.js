import React, { Component } from 'react';

class JobListing extends Component {
  /* istanbul ignore next */
  constructor() {
    super()
    this.state = {
      fullDescriptionVisible: false,
      hidden: false
    };
    // this.handleDescriptionLengthToggle = this.handleDescriptionLengthToggle.bind(this);
    this.handleHideClick = this.handleHideClick.bind(this);
  }

  // handleDescriptionLengthToggle(event) {
  //   let fullDescriptionVisible = this.state.fullDescriptionVisible;
  //   if (fullDescriptionVisible) {
  //     const listingEl = event.target.parentElement.parentElement;
  //     const ListingElDistFromTop = listingEl.getBoundingClientRect().top;
  //     if (ListingElDistFromTop < 0) {
  //       listingEl.scrollIntoView({block: 'start',  behavior: 'smooth'});
  //     }
  //     this.props.descriptionClicked('read less');
  //   }
  //   event.preventDefault();
  // }

  handleHideClick(event) {
    let hidden = this.state.hidden;
    this.setState({hidden:!hidden});
    this.props.onHideClick();
    event.preventDefault();
  }

  componentWillReceiveProps(nextProps) {
    let updateListings = nextProps.updateListings;
    let hidden = this.state.hidden;
    let fullDescriptionVisible = this.state.fullDescriptionVisible;
    if (updateListings.unhideAll) {
      if (hidden) {
        this.setState({hidden:false});
      }
    }
    if (updateListings.showShortDescriptions) {
      if (fullDescriptionVisible) {
        this.setState({fullDescriptionVisible:false});
      }
    }
    if (updateListings.showFullDescriptions) {
      if (!fullDescriptionVisible) {
        this.setState({fullDescriptionVisible: true});
      }
    }
  }

  render() {
    let fullDescriptionVisible = this.state.fullDescriptionVisible;
    let listing = this.props.listing;
    let hidden = this.state.hidden;
    let index = this.props.index;
    if (hidden) {return (null);}
    return (
      <div className="job-listing">
        <button className="exit" data-value={index} onClick={this.handleHideClick}>&#10006;</button>
        {listing.url ? (
          <h4><a className="listing-url" href={listing.url}>{listing.title}</a></h4>
        ) : (
          <h4>{listing.title}</h4>
        )}
        <p className="listing-item">{listing.companyName}</p>
        <p className="listing-item">{listing.location}</p>
        <p className="listing-item">{listing.postTimeStr}</p>
        <p className="listing-item">{listing.type}</p>
        <p className="listing-item">Technologies: {listing.descriptionHasTech.join(' ')}</p>
        {listing.readMoreOrLess === "read less" ?
          <p className="listing-item full-description"><span dangerouslySetInnerHTML={{__html: listing.descriptionShown}}></span><a className="read-less" data-value={index} onClick={this.props.handleReadLessClick.bind(null, index)}>{listing.readMoreOrLess}</a></p>
        :
          <p className="listing-item short-description">{listing.descriptionShown}<a className="read-more" data-value={index} onClick={this.props.handleReadMoreClick.bind(this, index)}>{listing.readMoreOrLess}</a></p>
        }
      </div>
    );
  }
}

export default JobListing;
