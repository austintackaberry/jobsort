import React, { Component } from 'react';

class JobListing extends Component {
  constructor() {
    super()
    this.state = {readMore: false};
    this.handleReadMoreLessClick = this.handleReadMoreLessClick.bind(this);
  }

  handleReadMoreLessClick(event) {
    let readMore = this.state.readMore;
    this.setState({readMore:!readMore});
  }

  render() {
    let readMore = this.state.readMore;
    let listing = this.props.listing;
    let index = this.props.index;
    let text = '';
    if (readMore) {
      // text = listing.descriptionText;
      text = <p dangerouslySetInnerHTML={{__html: listing.descriptionHTML}} />;
    }
    else {
      text = listing.descriptionText.slice(0,200);
      text = text.slice(0,text.lastIndexOf(" "));
      text = text.concat('...');
    }
    let source;
    if (listing.source === 'hackerNews') {
      source = <span className="source hacker-news">hn who's hiring</span>;
    }
    else if (listing.source === 'stackOverflow') {
      source = <span className="source stack-overflow">stack overflow</span>;
    }
    else if (listing.source === 'github') {
      source = <span className="source github">github</span>;
    }
    return (
      <div className="job-listing">
        <button id="hide" href="javascript: void(0)" className="exit" data-value={index} onClick={this.handleHideClick}>&#10006;</button>
        {source}
        <h4><a href={listing.url}>{listing.title}</a></h4>
        <p className="listing-item">{listing.companyName}</p>
        <p className="listing-item">{listing.location}</p>
        <p className="listing-item">{listing.postTimeStr}</p>
        <p className="listing-item">{listing.type}</p>
        <p className="listing-item">Technologies: {listing.descriptionHasTech.join(' ')}</p>
        <p className="listing-item">{text}<a href="javascript: void(0)" data-value={index} onClick={this.handleReadMoreLessClick}>read {readMore ? 'less' : 'more'}</a></p>
      </div>
    )
  }
}

export default JobListing;
