import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Style from './SearchForm.module.scss'

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
      <>
        <form
          onSubmit={(e) => this.handleSubmit(e)}
          className={Style.searchFrame}
        >
          <input
            type="text"
            value={this.state.place}
            onChange={(e) => this.handlePlaceChange(e.target.value)}
          />
          <div class={Style.clearButton} onClick={() => alert()}></div>
          <button type="submit" value="検索">
            検索
          </button>
        </form>
      </>
    )
  }
}

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
export default SearchForm
