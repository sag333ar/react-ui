import React from 'react'
import { HiveSignerCb } from '../lib'
import { initAioha} from '@aioha/aioha'
import { AiohaProvider, HiveSignerOcl } from '../lib'
import { Home } from './Home'

const aioha = initAioha({
  hivesigner: { 
    app: 'ipfsuploader.app',
    callbackURL: window.location.origin + '/hivesigner',
    scope: ['login', 'vote']
  },
  hiveauth: {
    name: 'Aioha React'
  }
})


export const App = () => {
  if (window.location.pathname === '/hivesigner')
    return (
      <div className="dark">
        <div className="min-h-screen min-w-full dark:bg-gray-800">
          <HiveSignerCb />
        </div>
      </div>
    )
  return (
    <div className="dark">
      <div className="min-h-screen min-w-full dark:bg-gray-800">
        <AiohaProvider aioha={aioha}>
          {window.location.pathname === '/hivesigner-ocl' ? (
            <HiveSignerOcl onSuccess={() => (window.location.pathname = '/')} />
          ) : (
            <Home />
          )}
        </AiohaProvider>
      </div>
    </div>
  )
}
