import React, { Component } from 'react';

class JobListing extends Component {
  /* istanbul ignore next */
  constructor() {
    super()
    this.handleHideClick = this.handleHideClick.bind(this);
  }

  render() {
    let listing = this.props.listing;
    let index = this.props.index;
    if (listing.hidden) {return (null);}
    return (
      <div className="job-listing">
        <button className="exit" data-value={index} onClick={this.props.handleHideListing(index)}>&#10006;</button>
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
