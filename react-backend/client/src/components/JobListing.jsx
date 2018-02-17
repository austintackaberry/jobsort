import React from 'react';
import PropTypes from 'prop-types';

function JobListing(props) {
  const { listing, index } = props;
  if (listing.hidden) {
    return null;
  }
  return (
    <div className="job-listing">
      <button
        className="exit"
        data-value={index}
        onClick={props.handleHideListing(index)}
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
            /* eslint-disable */
            dangerouslySetInnerHTML={{ __html: listing.descriptionShown }}
            /* eslint-enable */
          />
          <button
            className="read-less"
            data-value={index}
            onClick={event => props.handleReadLessClick(index, event)}
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
            onClick={() => props.handleReadMoreClick(index)}
          >
            {listing.readMoreOrLess}
          </button>
        </p>
      )}
    </div>
  );
}

JobListing.propTypes = {
  listing: PropTypes.shape({
    distance: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    fullPostText: PropTypes.string,
    descriptionText: PropTypes.string,
    compensation: PropTypes.string,
    location: PropTypes.string,
    hidden: PropTypes.bool,
    readMore: PropTypes.bool,
    rankscore: PropTypes.number,
    descriptionHasTech: PropTypes.array,
  }).isRequired,
  index: PropTypes.number.isRequired,
  handleHideListing: PropTypes.func.isRequired,
  handleReadLessClick: PropTypes.func.isRequired,
  handleReadMoreClick: PropTypes.func.isRequired,
};

export default JobListing;
