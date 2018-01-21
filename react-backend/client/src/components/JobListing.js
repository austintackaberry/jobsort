import React, { Component } from 'react';

class JobListing extends Component {
  /* istanbul ignore next */
  constructor() {
    super()
    this.state = {
      fullDescriptionVisible: false,
      hidden: false
    };
    this.handleDescriptionLengthToggle = this.handleDescriptionLengthToggle.bind(this);
    this.handleHideClick = this.handleHideClick.bind(this);
  }

  handleDescriptionLengthToggle(event) {
    let fullDescriptionVisible = this.state.fullDescriptionVisible;
    if (fullDescriptionVisible) {
      event.target.parentElement.parentElement.scrollIntoView(true);
      document.getElementById('show-full-descriptions').style.display = "inline-block";
    }
    else {
      document.getElementById('show-short-descriptions').style.display = "inline-block";
    }
    this.setState({fullDescriptionVisible:!fullDescriptionVisible});
    event.preventDefault();
  }

  handleHideClick(event) {
    let hidden = this.state.hidden;
    this.setState({hidden:!hidden});
    document.getElementById('unhide-all').style.display = "inline-block";
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
      document.getElementById('unhide-all').style.display = "none";
    }
    else if (updateListings.showShortDescriptions) {
      if (fullDescriptionVisible) {
        this.setState({fullDescriptionVisible:false});
      }
      document.getElementById('show-full-descriptions').style.display = "inline-block";
      document.getElementById('show-short-descriptions').style.display = "none";
    }
    else if (updateListings.showFullDescriptions) {
      if (!fullDescriptionVisible) {
        this.setState({fullDescriptionVisible: true});
      }
      document.getElementById('show-full-descriptions').style.display = "none";
      document.getElementById('show-short-descriptions').style.display = "inline-block";
    }
  }

  render() {
    let fullDescriptionVisible = this.state.fullDescriptionVisible;
    let listing = this.props.listing;
    let hidden = this.state.hidden;
    let index = this.props.index;
    let text;
    if (fullDescriptionVisible) {
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
    if (hidden) {return (null);}
    return (
      <div className="job-listing">
        <button id="hide" className="exit" data-value={index} onClick={this.handleHideClick}>&#10006;</button>
        {source}
        {listing.url ? (
          <h4><a href={listing.url}>{listing.title}</a></h4>
        ) : (
          <h4>{listing.title}</h4>
        )}
        <p className="listing-item">{listing.companyName}</p>
        <p className="listing-item">{listing.location}</p>
        <p className="listing-item">{listing.postTimeStr}</p>
        <p className="listing-item">{listing.type}</p>
        <p className="listing-item">Technologies: {listing.descriptionHasTech.join(' ')}</p>
        <p className="listing-item">{text}<a data-value={index} onClick={this.handleDescriptionLengthToggle}>read {fullDescriptionVisible ? 'less' : 'more'}</a></p>
      </div>
    );
  }
}

export default JobListing;
