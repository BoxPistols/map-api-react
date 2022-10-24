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
    // tes
    const target = document.getElementById('clear_button')
    if (this.state.place.length > 0) {
      target.style.visibility = 'visible'
    }
  }

  handleClear() {
    this.setState({ place: '' })
    const input = document.getElementById('input')
    input.value = ''
    const target = document.getElementById('clear_button')
    target.style.visibility = 'hidden'
  }

  handleSubmit(e) {
    e.preventDefault()
    if (this.state.place.length > 0) {
      this.props.onSubmit(this.state.place)
    }
  }

  render() {
    return (
      <>
        <form
          onSubmit={(e) => this.handleSubmit(e)}
          className={Style.searchFrame}
          name="searchForm"
        >
          <input
            id="input"
            type="text"
            value={this.state.place}
            onChange={(e) => this.handlePlaceChange(e.target.value)}
            name="searchBox"
          />
          <div
            id="clear_button"
            class={Style.clearButton}
            onClick={() => this.handleClear()}
          ></div>
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
