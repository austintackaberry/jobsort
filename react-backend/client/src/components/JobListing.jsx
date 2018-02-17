import React, { Component } from 'react';

class JobListing extends Component {
  render() {
    const { listing, index } = this.props;
    if (listing.hidden) {
      return null;
    }
    return (
      <div className="job-listing">
        <button
          className="exit"
          data-value={index}
          onClick={this.props.handleHideListing(index)}
        >
          &#10006;
        </button>
        {listing.url ? (
          <h4>
            <a className="listing-url" href={listing.url}>
              {listing.title}
            </a>
          </h4>
        ) : (
          <h4>{listing.title}</h4>
        )}
        <p className="listing-item">{listing.companyName}</p>
        {listing.location !== '0' && (
          <p className="listing-item">{listing.location}</p>
        )}
        <p className="listing-item">{listing.postTimeStr}</p>
        <p className="listing-item">{listing.type}</p>
        <p className="listing-item">
          Technologies: {listing.descriptionHasTech.join(' ')}
        </p>
        {listing.readMoreOrLess === 'read less' ? (
          <p className="listing-item full-description">
            <span
              dangerouslySetInnerHTML={{ __html: listing.descriptionShown }}
            />
            <button
              className="read-less"
              data-value={index}
              onClick={this.props.handleReadLessClick.bind(this, index)}
            >
              {listing.readMoreOrLess}
            </button>
          </p>
        ) : (
          <p className="listing-item short-description">
            {listing.descriptionShown}
            <button
              className="read-more"
              data-value={index}
              onClick={this.props.handleReadMoreClick.bind(null, index)}
            >
              {listing.readMoreOrLess}
            </button>
          </p>
        )}
      </div>
    );
  }
}

export default JobListing;
