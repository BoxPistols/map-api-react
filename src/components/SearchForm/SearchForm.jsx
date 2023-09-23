import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Style from './SearchForm.module.scss'

function SearchForm({ onSubmit }) {
  const [place, setPlace] = useState('東京タワー')

  function handlePlaceChange(e) {
    setPlace(e.target.value)
    const target = document.getElementById('clear_button')
    if (e.target.value.length > 0) {
      target.style.visibility = 'visible'
    }
  }

  function handleClear() {
    setPlace('')
    const input = document.getElementById('input')
    input.value = ''
    const target = document.getElementById('clear_button')
    target.style.visibility = 'hidden'
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (place.length > 0) {
      onSubmit(place)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={Style.searchFrame}
        name="searchForm"
      >
        <input
          id="input"
          type="text"
          value={place}
          onChange={handlePlaceChange}
          name="searchBox"
        />
        <button type="submit" value="検索">
          検索
        </button>
        <div
          id="clear_button"
          className={Style.clearButton}
          onClick={handleClear}
        ></div>
      </form>
    </>
  )
}

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default SearchForm
