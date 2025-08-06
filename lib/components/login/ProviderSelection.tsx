import React, { ReactNode } from 'react'
import { Providers } from '@aioha/aioha'
import { useAioha } from '@aioha/react-provider'
import { ProviderInfo } from '../ProviderInfo.js'
import { CloseIcon } from '../../icons/CloseIcon.js'

type ProviderCb = (provider: Providers) => any
export type Arrangement = 'list' | 'grid'

export const Badge = ({ children }: { children?: ReactNode }) => {
  return (
    <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 bg-gray-200 rounded-sm dark:bg-gray-700 dark:text-gray-400">
      {children}
    </span>
  )
}

const ProviderBtn = ({ provider, forceShow, onClick }: { provider: Providers; forceShow: boolean; onClick: ProviderCb }) => {
  const { aioha } = useAioha()
  const { name, icon, iconDark, loginBadge } = ProviderInfo[provider]
  const isEnabled = provider === Providers.Custom ? true : aioha.isProviderEnabled(provider)
  return isEnabled || (forceShow && aioha.isProviderRegistered(provider)) ? (
    <li>
      <a
        className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow-sm hover:cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
        onClick={() => onClick(provider)}
      >
        <svg aria-hidden="true" className={`h-5 aspect-square`}>
          <image href={icon} className={`h-5 ${iconDark ? 'block dark:hidden' : ''}`} />
          {iconDark ? <image href={iconDark} className={`h-5 hidden dark:block`} /> : null}
        </svg>
        <span className="flex-1 ms-3 whitespace-nowrap">{name}</span>
        {loginBadge ? <Badge>{loginBadge}</Badge> : null}
      </a>
    </li>
  ) : null
}

const ProviderBtnGrid = ({ provider, forceShow, onClick }: { provider: Providers; forceShow: boolean; onClick: ProviderCb }) => {
  const { aioha } = useAioha()
  const { name, icon, iconDark } = ProviderInfo[provider]
  const isEnabled = provider === Providers.Custom ? true : aioha.isProviderEnabled(provider)
  return isEnabled || (forceShow && aioha.isProviderRegistered(provider)) ? (
    <a
      className="flex flex-col items-center w-34 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow-sm hover:cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
      onClick={() => onClick(provider)}
    >
      <svg aria-hidden="true" className={`h-12 aspect-square`}>
        <image href={icon} className={`h-12 ${iconDark ? 'block dark:hidden' : ''}`} />
        {iconDark ? <image href={iconDark} className={`h-12 hidden dark:block`} /> : null}
      </svg>
      <span className="mt-4 text-base font-bold dark:text-white whitespace-nowrap">{name}</span>
    </a>
  ) : null
}

const ProvidersSeq: Providers[] = [
  Providers.Keychain,
  Providers.PeakVault,
  Providers.HiveAuth,
  Providers.HiveSigner,
  Providers.Ledger,
  Providers.Custom
] // in this particular order

export const ProviderSelection = ({
  helpUrl,
  forceShow,
  onSelected,
  arrangement,
  onCancel
}: {
  helpUrl?: string
  forceShow: Providers[]
  onSelected: ProviderCb
  arrangement: Arrangement
  onCancel?: () => any
}) => {
  return (
    <>
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Connect with one of our available Hive wallet providers.
      </p>
      {arrangement === 'list' ? (
        <ul className="mt-4 mb-2 space-y-3">
          {ProvidersSeq.map((p, i) => (
            <ProviderBtn key={i} provider={p} forceShow={forceShow.includes(p)} onClick={onSelected} />
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 mb-2">
          {ProvidersSeq.map((p, i) => (
            <ProviderBtnGrid key={i} provider={p} forceShow={forceShow.includes(p)} onClick={onSelected} />
          ))}
        </div>
      )}
      {helpUrl ? (
        <a
          href={helpUrl}
          target="_blank"
          className="inline-flex items-center mt-2 text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
        >
          <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Need help connecting a wallet?
        </a>
      ) : null}
      {typeof onCancel === 'function' ? (
        <button
          type="button"
          className="flex gap-2 items-center justify-center my-3 ml-auto mr-auto text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800 enabled:hover:cursor-pointer disabled:hover:cursor-not-allowed"
          onClick={onCancel}
        >
          <CloseIcon srDesc="Cancel button" />
          Cancel
        </button>
      ) : null}
    </>
  )
}
