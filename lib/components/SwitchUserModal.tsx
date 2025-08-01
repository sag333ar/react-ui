import React, { Dispatch, SetStateAction, useState } from 'react'
import { useAioha } from '@aioha/react-provider'
import { CloseIcon } from '../icons/CloseIcon.js'
import { RightAngledArrow, RmRowIcon } from './TableUtils.js'
import { Badge } from './login/ProviderSelection.js'
import { PlusIcon } from '../icons/PlusIcon.js'
import { EditIcon } from '../icons/EditIcon.js'

export interface SwitchUserModalProps {
  onClose: Dispatch<SetStateAction<boolean>>
  onSelect: (user: string) => any
  onAddAcc: () => any
  isAvatarVisible?: boolean
}

export const SwitchUserModal = ({ onClose, onSelect, onAddAcc, isAvatarVisible }: SwitchUserModalProps) => {
  const { aioha, user, provider, otherUsers } = useAioha()
  const [editing, setEditing] = useState(false)
  const onClickUser = (selected: string) => {
    if (editing) {
      selected === user ? aioha.logout() : aioha.removeOtherLogin(selected)
    } else {
      onSelect(selected)
    }
  }
  return (
    <>
      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Switch User</h3>
        <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => onClose(false)}
        >
          <CloseIcon />
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
            {user && (
              <tr
                key={user}
                className="hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => onClickUser(user!)}
              >
                {isAvatarVisible && (
                  <td>
                    <img
                      src={`https://images.hive.blog/u/${user || 'null'}/avatar`}
                      alt="User avatar"
                      className="w-9 h-9 ml-2 rounded-full border border-gray-300 dark:border-gray-600"
                    />
                  </td>
                )}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <Badge>{provider}</Badge>
                </td>
                {editing ? <RmRowIcon w={12} /> : <RightAngledArrow w={12} />}
              </tr>
            )}
            {Object.keys(otherUsers).map((u, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer" onClick={() => onClickUser(u!)}>
                {isAvatarVisible && (
                  <td>
                    <img
                      src={`https://images.hive.blog/u/${u || 'null'}/avatar`}
                      alt="User avatar"
                      className="w-9 h-9 ml-2 rounded-full border border-gray-300 dark:border-gray-600"
                    />
                  </td>
                )}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{u}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <Badge>{otherUsers[u]}</Badge>
                </td>
                {editing ? <RmRowIcon w={12} /> : <RightAngledArrow w={12} />}
              </tr>
            ))}
          </tbody>
        </table>
        {editing ? (
          <div className="flex gap-2 my-5 mx-auto justify-center">
            <button
              type="button"
              className="flex gap-1 items-center justify-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800 enabled:hover:cursor-pointer disabled:hover:cursor-not-allowed"
              onClick={() => setEditing(false)}
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex gap-2 my-5 mx-auto justify-center">
            <button
              type="button"
              className="flex gap-1 items-center justify-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm pl-3.5 pr-4 py-2.5 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800 enabled:hover:cursor-pointer disabled:hover:cursor-not-allowed"
              onClick={() => setEditing(true)}
            >
              <EditIcon />
              Edit
            </button>
            <button
              type="button"
              className="flex gap-1 items-center justify-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm pl-3 pr-4 py-2.5 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800 enabled:hover:cursor-pointer disabled:hover:cursor-not-allowed"
              onClick={onAddAcc}
            >
              <PlusIcon />
              Add account
            </button>
          </div>
        )}
      </div>
    </>
  )
}
