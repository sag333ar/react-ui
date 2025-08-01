import React, { useState } from 'react'
import { useAioha } from '@aioha/react-provider'
import { LoginModal, LoginModalProps } from './LoginModal.js'
import { UserModal, UserModalProps } from './UserModal.js'
import { SwitchUserModal } from './SwitchUserModal.js'

interface ModalProps extends LoginModalProps, Omit<UserModalProps, 'onSwitchUser'> {
  displayed?: boolean
}

export const AiohaModal = ({
  displayed = false,
  loginTitle,
  loginHelpUrl,
  loginOptions,
  forceShowProviders = [],
  arrangement = 'list',
  isViewExplorerVisible,
  isSwitchUserVisible,
  isLogoutVisible,
  onLogin,
  onClose
}: ModalProps) => {
  const { aioha, user, otherUsers } = useAioha()
  const isInactive = Object.keys(otherUsers).length > 0 && !aioha.isLoggedIn()
  const [switchingUser, setSwitchingUser] = useState<boolean>(isInactive)
  const [addingAcc, setAddingAcc] = useState<boolean>(false)
  return (
    <div
      id="aioha-modal"
      tabIndex={-1}
      className={`${
        displayed ? '' : 'hidden'
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full bg-black bg-opacity-30`}
      onMouseDown={() => onClose(false)}
    >
      <div className={`relative p-4 ${arrangement === 'grid' ? 'md:max-w-xl max-w-md' : 'max-w-md'} max-h-full`}>
        <div
          className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 min-w-sm"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {aioha.isLoggedIn() || Object.keys(otherUsers).length > 0 ? (
            switchingUser ? (
              !addingAcc ? (
                <SwitchUserModal
                  onClose={onClose}
                  onSelect={(newUser: string) => {
                    if (newUser !== user) aioha.switchUser(newUser)
                    setSwitchingUser(false)
                  }}
                  onAddAcc={() => setAddingAcc(true)}
                />
              ) : (
                <LoginModal
                  loginTitle={'Add Account'}
                  loginHelpUrl={loginHelpUrl}
                  loginOptions={loginOptions}
                  arrangement={arrangement}
                  forceShowProviders={forceShowProviders}
                  onLogin={(r) => {
                    setAddingAcc(false)
                    setSwitchingUser(false)
                    if (typeof onLogin === 'function') onLogin(r)
                  }}
                  onClose={onClose}
                  onCancel={() => setAddingAcc(false)}
                />
              )
            ) : (
              <UserModal
                onClose={onClose}
                onSwitchUser={() => setSwitchingUser(true)}
                isLogoutVisible={isLogoutVisible}
                isSwitchUserVisible={isSwitchUserVisible}
                isViewExplorerVisible={isViewExplorerVisible}
              />
            )
          ) : (
            <LoginModal
              loginTitle={loginTitle}
              loginHelpUrl={loginHelpUrl}
              loginOptions={loginOptions}
              arrangement={arrangement}
              forceShowProviders={forceShowProviders}
              onLogin={onLogin}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}
