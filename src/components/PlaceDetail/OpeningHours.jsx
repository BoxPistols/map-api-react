import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Style from './OpeningHours.module.scss'

const OpeningHours = ({ openingHours }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!openingHours) return null

  const { weekday_text } = openingHours

  if (!weekday_text || weekday_text.length === 0) return null

  // 今日の曜日を取得 (0 = 日曜日, 6 = 土曜日)
  const today = new Date().getDay()
  // weekday_text は月曜日から始まるので調整
  const todayIndex = today === 0 ? 6 : today - 1

  return (
    <div className={Style.container}>
      <div className={Style.header}>
        <h3 className={Style.title}>📅 営業時間</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={Style.toggleBtn}
          aria-expanded={isExpanded}
        >
          {isExpanded ? '閉じる' : '詳細を見る'}
        </button>
      </div>

      {/* 今日の営業時間（常に表示） */}
      <div className={Style.todayHours}>
        <span className={Style.dayLabel}>今日:</span>
        <span className={Style.hours}>
          {weekday_text[todayIndex]?.replace(/^[^:]+:\s*/, '')}
        </span>
      </div>

      {/* 全ての営業時間（展開時のみ表示） */}
      {isExpanded && (
        <div className={Style.allHours}>
          {weekday_text.map((dayHours, index) => {
            const isToday = index === todayIndex
            // 曜日と時間を分割
            const parts = dayHours.split(': ')
            const day = parts[0]
            const hours = parts[1] || ''

            return (
              <div
                key={index}
                className={`${Style.hourRow} ${isToday ? Style.today : ''}`}
              >
                <span className={Style.day}>{day}</span>
                <span className={Style.time}>{hours}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

OpeningHours.propTypes = {
  openingHours: PropTypes.shape({
    open_now: PropTypes.bool,
    weekday_text: PropTypes.arrayOf(PropTypes.string),
    periods: PropTypes.array,
  }),
}

export default OpeningHours
