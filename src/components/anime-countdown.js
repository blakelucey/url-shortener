// components/AnimeCountdown.jsx
import React from 'react'
import Countdown, { zeroPad } from 'react-countdown'

// Shown when the countdown reaches zero
const Completionist = () => <span>Trial Ended!</span>

export default function AnimeCountdown({ trialEnd }) {
  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    if (completed) return <Completionist />

    return (
      // ← one row instead of column
      <div className="flex items-center justify-center space-x-6">
        {/* Label and countdown side-by-side */}
        <p className="text-sm font-medium text-primary">Trial Ends In:</p>

        {/* Day cell */}
        <div className="flex flex-col items-center">
          <span className="block text-lg  font-semibold">
            {zeroPad(days)}
          </span>
          <span className="text-xs lowercase">Days</span>
        </div>

        {/* Hour cell */}
        <div className="flex flex-col items-center">
          <span className="block text-lg  font-semibold">
            {zeroPad(hours)}
          </span>
          <span className="text-xs lowercase">Hours</span>
        </div>

        {/* Minute cell */}
        <div className="flex flex-col items-center">
          <span className="block text-lg  font-semibold">
            {zeroPad(minutes)}
          </span>
          <span className="text-xs lowercase">Minutes</span>
        </div>

        {/* Second cell */}
        <div className="flex flex-col items-center">
          <span className="block text-lg font-semibold">
            {zeroPad(seconds)}
          </span>
          <span className="text-xs lowercase">Seconds</span>
        </div>
      </div>
    )
  }

  return (
    <Countdown
      date={trialEnd * 1000} // seconds → ms
      renderer={renderer}
    />
  )
}