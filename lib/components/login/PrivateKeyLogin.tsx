import React, { useState } from 'react';
import { BackButton } from './BackButton';
import { SpinningIcon } from '../../icons/SpinningIcon';

interface PrivateKeyLoginProps {
  isAvatarVisible?: boolean;
  onPrevious: () => any;
  onNext: (username: string, key: string) => Promise<any>;
}

export const PrivateKeyLogin = ({ isAvatarVisible = false, onPrevious, onNext }: PrivateKeyLoginProps) => {
  const [username, setUsername] = useState('');
  const [key, setKey] = useState('');
  const [inProgress, setInProgress] = useState(false);

  const proceed = async () => {
    setInProgress(true);
    await onNext(username, key);
    setInProgress(false);
  };

  return (
    <>
      <div className="mb-3">
        <BackButton onPrevious={onPrevious} />
      </div>
      <div className="space-y-4">
        <div className="inline-flex flex-row gap-1.5 w-full items-center">
          {isAvatarVisible && (
            <img
              src={`https://images.hive.blog/u/${username || 'null'}/avatar`}
              alt="User avatar"
              className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.onerror = null
                target.src = 'https://images.hive.blog/u/null/avatar'
              }}
            />
          )}
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 h-auto text-sm rounded-lg focus:outline-none focus:border-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"
            placeholder="Enter Hive Username"
            autoCapitalize="off"
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
            disabled={inProgress}
          />
        </div>
        <input
          type="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 h-auto text-sm rounded-lg focus:outline-none focus:border-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"
          placeholder="Enter Private Posting Key"
          value={key}
          onChange={(evt) => setKey(evt.target.value)}
          disabled={inProgress}
        />
        <button
          type="button"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={proceed}
          disabled={inProgress || !username || !key}
        >
          {inProgress ? <SpinningIcon /> : 'Login'}
        </button>
      </div>
    </>
  );
};
