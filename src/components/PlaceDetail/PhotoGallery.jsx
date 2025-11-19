import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Style from './PhotoGallery.module.scss'

const PhotoGallery = ({ photos, placeName }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!photos || photos.length === 0) return null

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  // Google Places API の写真URLを取得
  const getPhotoUrl = (photo) => {
    if (!photo.getUrl) return null
    return photo.getUrl({ maxWidth: 800, maxHeight: 600 })
  }

  const currentPhoto = photos[currentIndex]
  const photoUrl = getPhotoUrl(currentPhoto)

  return (
    <div className={Style.gallery}>
      <div className={Style.photoContainer}>
        {photoUrl && (
          <img
            src={photoUrl}
            alt={`${placeName} - ${currentIndex + 1}`}
            className={Style.photo}
          />
        )}

        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className={`${Style.navBtn} ${Style.prev}`}
              aria-label="前の写真"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className={`${Style.navBtn} ${Style.next}`}
              aria-label="次の写真"
            >
              ›
            </button>
          </>
        )}

        <div className={Style.counter}>
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {photos.length > 1 && (
        <div className={Style.thumbnails}>
          {photos.map((photo, index) => {
            const thumbUrl = getPhotoUrl(photo)
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`${Style.thumbnail} ${
                  index === currentIndex ? Style.active : ''
                }`}
                aria-label={`写真 ${index + 1} を表示`}
              >
                {thumbUrl && (
                  <img
                    src={thumbUrl}
                    alt={`${index + 1}`}
                    className={Style.thumbnailImg}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

PhotoGallery.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      getUrl: PropTypes.func,
      height: PropTypes.number,
      width: PropTypes.number,
    })
  ).isRequired,
  placeName: PropTypes.string.isRequired,
}

export default PhotoGallery
