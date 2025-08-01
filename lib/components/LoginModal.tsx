import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Providers } from '@aioha/aioha'
import { Arrangement, ProviderSelection } from './login/ProviderSelection.js'
import { UsernameInput } from './login/UsernameInput.js'
import { LoginOptions, LoginResult } from '@aioha/aioha/build/types.js'
import { useAioha } from '@aioha/react-provider'
import { HiveAuthQR } from './login/HiveAuthQR.js'
import { ErrorAlert } from './login/ErrorAlert.js'
import { CloseIcon } from '../icons/CloseIcon.js'
import { ProviderInfo } from './ProviderInfo.js'
import { AccountDiscovery } from './login/AccountDiscovery.js'

export interface LoginModalProps {
  loginTitle?: string
  loginHelpUrl?: string
  loginOptions: LoginOptions
  arrangement?: Arrangement
  forceShowProviders?: Providers[]
  onLogin?: (result: LoginResult) => any
  onCancel?: () => any
  onClose: Dispatch<SetStateAction<boolean>>
  isAvatarVisible?: boolean
}

export const LoginModal = ({
  loginTitle = 'Connect Wallet',
  loginHelpUrl,
  loginOptions,
  arrangement = 'list',
  forceShowProviders = [],
  onCancel,
  onClose,
  onLogin,
  isAvatarVisible
}: LoginModalProps) => {
  const { aioha } = useAioha()
  const [page, setPage] = useState(0)
  const [chosenProvider, setProvider] = useState<Providers>()
  const [error, setError] = useState('')
  const [hiveAuthPl, setHiveAuthPl] = useState<{ payload: string; cancel: () => void }>()
  useEffect(() => {
    aioha.on('hiveauth_login_request', (payload: string, _: any, cancel: () => void) => {
      setError('')
      setHiveAuthPl({ payload, cancel })
      setPage(2)
    })
    return () => {
      aioha.off('hiveauth_login_request')
    }
  })
  const login = async (provider: Providers, username: string, options: LoginOptions) => {
    const loginResult = await aioha.login(provider, username, {
      ...options,
      hiveauth: {
        // TODO: remove after removing the callback function in next core release
        cbWait: () => {}
      }
    })
    if (!loginResult.success) {
      setError(loginResult.error)
      if (provider !== Providers.HiveSigner) setPage(1)
    } else {
      if (typeof onLogin === 'function') onLogin(loginResult)
      onClose(false)
    }
    return loginResult
  }
  return (
    <>
      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{loginTitle}</h3>
        <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => onClose(false)}
        >
          <CloseIcon />
        </button>
      </div>
      <div className="p-4 md:p-5">
        <ErrorAlert error={error} />
        {page === 0 ? (
          <ProviderSelection
            helpUrl={loginHelpUrl}
            forceShow={forceShowProviders}
            arrangement={arrangement}
            onCancel={onCancel}
            onSelected={async (provider) => {
              if (!aioha.isProviderEnabled(provider)) {
                if (ProviderInfo[provider].url) window.open(ProviderInfo[provider].url, '_blank', 'noopener,noreferrer')
                return
              }
              setProvider(provider)
              if (provider === Providers.HiveSigner) {
                await login(provider, '', {})
              } else if (ProviderInfo[provider].discovery) {
                setError('')
                setPage(3)
              } else {
                setError('')
                setPage(1)
              }
            }}
          />
        ) : page === 1 ? (
          <UsernameInput
            isAvatarVisible={isAvatarVisible}
            onPrevious={() => {
              setError('')
              setPage(0)
            }}
            onNext={(username) => login(chosenProvider!, username, loginOptions)}
          />
        ) : page === 2 ? (
          <HiveAuthQR payload={hiveAuthPl!.payload} cancel={hiveAuthPl!.cancel} />
        ) : page === 3 ? (
          <AccountDiscovery
            provider={chosenProvider!}
            onPrevious={() => setPage(0)}
            onNext={(username, info) => login(chosenProvider!, username, { ...loginOptions, paths: info.map((v) => v.path) })}
          />
        ) : null}
      </div>
    </>
  )
}
