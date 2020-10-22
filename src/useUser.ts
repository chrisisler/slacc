import { useState, useEffect } from 'react';
import { User } from 'firebase/app';

import { auth } from './firebase';

export const useUser = (): [
  User | null,
  React.Dispatch<React.SetStateAction<User | null>>
] => {
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      setUser(user);
    });
  }, []);

  return [user, setUser];
};
