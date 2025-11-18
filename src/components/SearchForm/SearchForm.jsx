import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Style from './SearchForm.module.scss'

function SearchForm({ onSubmit }) {
  const [place, setPlace] = useState('東京タワー')
  const [searchType, setSearchType] = useState('geocode')
  const [isComposing, setIsComposing] = useState(false)
  const inputRef = useRef(null)

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
    // IME変換中はSubmitしない
    if (isComposing) {
      return
    }
    if (place.length > 0) {
      onSubmit(place, searchType)
    }
  }

  function handleSearchTypeChange(e) {
    setSearchType(e.target.value)
  }

  // IME変換の開始を検知
  function handleCompositionStart() {
    setIsComposing(true)
  }

  // IME変換の終了を検知
  function handleCompositionEnd() {
    setIsComposing(false)
  }

  // Cmd+K (macOS) または Ctrl+K (Windows/Linux) で検索フォームにフォーカス
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className={Style.searchContainer}>
      <div className={Style.searchTypeSelector}>
        <label className={Style.radioLabel}>
          <input
            type="radio"
            value="geocode"
            checked={searchType === 'geocode'}
            onChange={handleSearchTypeChange}
          />
          <span>住所検索</span>
        </label>
        <label className={Style.radioLabel}>
          <input
            type="radio"
            value="places"
            checked={searchType === 'places'}
            onChange={handleSearchTypeChange}
          />
          <span>場所検索</span>
        </label>
      </div>
      <form
        onSubmit={handleSubmit}
        className={Style.searchFrame}
        name="searchForm"
      >
        <input
          id="input"
          ref={inputRef}
          type="text"
          value={place}
          onChange={handlePlaceChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          name="searchBox"
          placeholder={
            searchType === 'places'
              ? '例: 東京タワーの近くのカフェ'
              : '例: 東京タワー'
          }
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
    </div>
  )
}

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default SearchForm
