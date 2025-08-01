import React, { useState } from 'react'
import { BackButton } from './BackButton.js'
import { SpinningIcon } from '../../icons/SpinningIcon.js'

interface UsernameInputProps {
  onPrevious: () => any
  onNext: (username: string) => Promise<any>
}

export const UsernameInput = ({ onPrevious, onNext }: UsernameInputProps) => {
  const [username, setUsername] = useState('')
  const [inProgress, setInProgress] = useState(false)
  const proceed = async () => {
    setInProgress(true)
    await onNext(username)
    setInProgress(false)
  }
  return (
    <>
      <div className="mb-3">
        <BackButton onPrevious={onPrevious} />
      </div>
      <div className="inline-flex flex-row gap-1.5 w-full">
        <img
          src={`https://images.hive.blog/u/${username || 'null'}/avatar`}
          alt="User avatar"
          className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null // prevent infinite loop
            target.src = 'https://images.hive.blog/u/null/avatar'
          }}
        />
        <input
          type="text"
          id="small-input"
          className="bg-gray-50 border border-gray-300 text-gray-900 h-auto text-sm rounded-lg focus:outline-hidden focus:border-gray-900 grow p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"
          placeholder="Enter Hive Username"
          autoCapitalize="off"
          value={username}
          onChange={(evt) => setUsername(evt.target.value)}
          onKeyDown={(evt) => (evt.key === 'Enter' ? proceed() : null)}
          disabled={inProgress}
        />
        <button
          type="button"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-hidden hover:bg-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 items-center flex-none dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-500 dark:hover:border-gray-500"
          onClick={proceed}
          aria-label="Proceed"
          disabled={inProgress}
        >
          {inProgress ? (
            <SpinningIcon />
          ) : (
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
