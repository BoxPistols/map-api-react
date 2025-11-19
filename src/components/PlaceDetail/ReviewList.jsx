import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Style from './ReviewList.module.scss'

const ReviewList = ({ reviews }) => {
  const [showAll, setShowAll] = useState(false)

  if (!reviews || reviews.length === 0) return null

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.round(rating))
  }

  return (
    <div className={Style.container}>
      <h3 className={Style.title}>💬 レビュー</h3>

      <div className={Style.reviewList}>
        {displayedReviews.map((review, index) => (
          <div key={index} className={Style.review}>
            <div className={Style.reviewHeader}>
              <div className={Style.authorInfo}>
                {review.profile_photo_url && (
                  <img
                    src={review.profile_photo_url}
                    alt={review.author_name}
                    className={Style.avatar}
                  />
                )}
                <div className={Style.authorDetails}>
                  <div className={Style.authorName}>{review.author_name}</div>
                  <div className={Style.timeAgo}>
                    {review.relative_time_description}
                  </div>
                </div>
              </div>
              <div className={Style.rating}>{renderStars(review.rating)}</div>
            </div>

            <div className={Style.reviewText}>{review.text}</div>

            {review.author_url && (
              <a
                href={review.author_url}
                target="_blank"
                rel="noopener noreferrer"
                className={Style.viewMore}
              >
                レビューの詳細を見る →
              </a>
            )}
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className={Style.toggleBtn}
        >
          {showAll ? '閉じる' : `もっと見る (${reviews.length - 3}件)`}
        </button>
      )}
    </div>
  )
}

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      author_name: PropTypes.string.isRequired,
      author_url: PropTypes.string,
      profile_photo_url: PropTypes.string,
      rating: PropTypes.number.isRequired,
      relative_time_description: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      time: PropTypes.number,
    })
  ).isRequired,
}

export default ReviewList
