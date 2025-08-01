import React, { useState } from 'react'
import { useAioha, AiohaModal } from '../lib'
import { KeyTypes } from '@aioha/aioha'
import { ChainIcon } from './Icons'

export const Home = () => {
  const [aiohaModalDisplayed, setAiohaModalDisplayed] = useState(false)
  const { user } = useAioha()
  return (
    <>
      <button
        type="button"
        className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:outline-hidden focus:ring-gray-100 hover:cursor-pointer font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        onClick={() => setAiohaModalDisplayed(true)}
      >
        {user ?? (
          <div className="inline-flex">
            <ChainIcon />
            Connect Wallet
          </div>
        )}
      </button>
      <AiohaModal
        displayed={aiohaModalDisplayed}
        loginOptions={{
          msg: 'Hello World',
          keyType: KeyTypes.Posting
        }}
        arrangement="grid"
        onClose={setAiohaModalDisplayed}
        isViewExplorerVisible={true}
        isSwitchUserVisible={true}
        isLogoutVisible={true}
        // onClickLogoutBtn={
        //   () => {
        //     console.log('Logout button clicked')
        //   }
        // }
        isAvatarVisible={true}
      />
    </>
  )
}
