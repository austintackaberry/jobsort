import React, { Component } from 'react';
import JobListing from "./JobListing.js";

class SearchResults extends Component {

  render() {
    if (this.props.jobListings[0] === "no results found") {
      return (
        <p>no results found</p>
      );
    }
    return (
      <div>
        {!this.props.updateListings.showFullDescriptions && <button className="listing-options show-full-descriptions" ref="showFullDescriptions" id="show-full-descriptions" onClick={() => this.props.onFullDescriptionClick()}>show full descriptions</button>}
        {!this.props.updateListings.showShortDescriptions && <button className="listing-options show-short-descriptions" id="show-short-descriptions" onClick={() => this.props.onShortDescriptionClick()}>show short descriptions</button>}
        {!this.props.updateListings.unhideAll && <button className="listing-options unhide-all" id="unhide-all" onClick={() => this.props.onUnhideAllClick()}>unhide all</button>}
        <div id="listing-container">
          {this.props.jobListings.map((listing, index) => {
            return (
              <JobListing
                updateListings={this.props.updateListings}
                listing={listing}
                index={index}
                onHideClick={() => this.props.onHideClick()}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

export default SearchResults;
