import React from 'react'

export default function Loader({ active }) {
  return (
    <div className={`preloader-wrap ${active ? 'active' : ''}`}>
      <div className="preloader-content">
        <img src="/saras.gif" alt="Loading..." className="preloader-gif" />
        <div className="preloader-progress-bar"></div>
      </div>
    </div>
  )
}
