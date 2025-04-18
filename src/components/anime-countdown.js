// components/AnimeCountdown.jsx
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * Given a Unix timestamp (seconds) in the future, returns an object
 * with days, hours, minutes, and seconds remaining.
 */
function getTimeUnits(trialEnd) {
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.max(trialEnd - now, 0);
  const days = Math.floor(diff / (24 * 3600));
  const hours = Math.floor((diff % (24 * 3600)) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return { days, hours, minutes, seconds };
}

export default function AnimeCountdown({ trialEnd }) {
  // Pass the raw subscription.trial_end here – do NOT sum it with trial_start
  // trialEnd must be the timestamp when the trial actually ends.

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refs = {
    days: useRef(null),
    hours: useRef(null),
    minutes: useRef(null),
    seconds: useRef(null),
  };

  useEffect(() => {
    // Initialize the display
    let last = getTimeUnits(trialEnd);
    Object.entries(last).forEach(([unit, val]) => {
      const el = refs[unit].current;
      if (el) el.textContent = String(val).padStart(2, '0');
    });

    const tick = () => {
      const next = getTimeUnits(trialEnd);

      Object.entries(next).forEach(([unit, newVal]) => {
        const oldVal = last[unit];
        const el = refs[unit].current;
        if (el && newVal !== oldVal) {
          anime.remove(el); // clear any in‑flight animations
          anime({
            targets: el,
            innerHTML: [
              String(oldVal).padStart(2, '0'),
              String(newVal).padStart(2, '0'),
            ],
            round: 1,
            easing: 'easeOutQuad',
            duration: 800,
          });
        }
      });

      last = next;
    };

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [refs, trialEnd]);

  const Cell = ({ label, unit }) => (
    <div className='flex flex-col text-center'>
      <p
        ref={refs[unit]}
        className="block text-xl text-primary"
      >00</p>
      <p className='text-primary'>{label}</p>
    </div>
  );

  return (
    <div className="flex items-center justify-center space-x-6">
      <small className="hidden dark:block text-sm font-medium text-primary">
        Trial Ends In:
      </small>
      <small className="dark:hidden text-sm font-medium text-primary">
        Trial Ends In:
      </small>
      <div className="flex items-end space-x-4">
        <Cell unit="days" label="Days" />
        <Cell unit="hours" label="Hours" />
        <Cell unit="minutes" label="Minutes" />
        <Cell unit="seconds" label="Seconds" />
      </div>
    </div>
  );
}