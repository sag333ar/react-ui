import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Providers } from '@aioha/aioha'
import { Arrangement, ProviderSelection } from './login/ProviderSelection.js'
import { UsernameInput } from './login/UsernameInput.js'
import { LoginOptions, LoginResult } from '@aioha/aioha/build/types.js'
import { useAioha } from '@aioha/react-provider'
import { HiveAuthQR } from './login/HiveAuthQR.js'
import { ErrorAlert } from './login/ErrorAlert.js'
import { CloseIcon } from '../icons/CloseIcon.js'
import { AllProviders, ExtraProviders, ProviderInfo } from './ProviderInfo.js'
import { AccountDiscovery } from './login/AccountDiscovery.js'
import { PrivateKeyLogin } from './login/PrivateKeyLogin.js'
import { PlaintextKeyProvider } from '@aioha/aioha/build/providers/custom/plaintext.js'

export interface LoginModalProps {
  loginTitle?: string
  loginHelpUrl?: string
  loginOptions: LoginOptions
  arrangement?: Arrangement
  forceShowProviders?: AllProviders[]
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
  const [chosenProvider, setProvider] = useState<AllProviders>()
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
  const login = async (provider: AllProviders, username: string, options: LoginOptions) => {
  if (provider === Providers.Custom && options.key) {
    aioha.registerCustomProvider(new PlaintextKeyProvider(options.key))
  }

  const loginResult = await aioha.login(Providers.Custom, username, {
    ...options,
    hiveauth: {
      cbWait: () => {}
    }
  });
  console.log(loginResult);
  if (!loginResult.success) {
    setError(loginResult.error)
    if (provider !== Providers.HiveSigner) setPage(0)
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
              if (provider === ExtraProviders.PrivateKey) {
                setProvider(provider)
                setError('')
                setPage(4)
                return
              }
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
            onNext={(username) => login(chosenProvider as Providers, username, loginOptions)}
          />
        ) : page === 2 ? (
          <HiveAuthQR payload={hiveAuthPl!.payload} cancel={hiveAuthPl!.cancel} />
        ) : page === 3 ? (
          <AccountDiscovery
            provider={chosenProvider as Providers}
            onPrevious={() => setPage(0)}
            onNext={(username, info) =>
              login(chosenProvider as Providers, username, { ...loginOptions, paths: info.map((v) => v.path) })
            }
          />
        ) : page === 4 ? (
          <PrivateKeyLogin
            onPrevious={() => {
              setError('')
              setPage(0)
            }}
            onNext={(username, key) => login(Providers.Custom, username, { key })}
          />
        ) : null}
      </div>
    </>
  )
}
