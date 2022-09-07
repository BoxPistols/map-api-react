import React, { Component } from 'react'
import PropTypes from 'prop-types'

class SearchForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      place: '東京タワー',
    }
  }
  handlePlaceChange(place) {
    this.setState({ place })
  }
  handleSubmit(e) {
    e.preventDefault()
    this.props.onSubmit(this.state.place)
  }
  render() {
    return (
      <div>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input
            type="text"
            value={this.state.place}
            onChange={(e) => this.handlePlaceChange(e.target.value)}
          />
          <button type="submit" value="検索">
            検索
          </button>
        </form>
      </div>
    )
  }
}

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
export default SearchForm
