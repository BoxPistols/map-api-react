import React, { Component } from 'react'

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      place: '東京タワー',
    }
  }
  handlePlaceChange(place) {
    this.setState({ place })
  }
  render() {
    return (
      <div>
        <form>
          <input
            type="text"
            value={this.state.place}
            onChange={(e) => this.handlePlaceChange(e.target.value)}
          />
          <input type="submit" value="検索" />
        </form>
      </div>
    )
  }
}

export default Search
