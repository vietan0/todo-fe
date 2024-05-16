import { Button } from '@nextui-org/button';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import useUserStore from '../store/useUserStore';
import getUser from '../utils/getUser';
import signOut from '../utils/signOut';

export default function Nav() {
  const user = useUserStore(state => state.user);
  const markSignIn = useUserStore(state => state.markSignIn);
  const markSignOut = useUserStore(state => state.markSignOut);

  useEffect(() => {
    (async () => {
      const result = await getUser();
      if (result.status === 'success')
        markSignIn(result.user);
    })();
  }, []);

  return (
    <nav className="flex h-14 items-center justify-between px-4 outline">
      <div className="flex gap-2">
        <Link className="underline" to="/">Home</Link>
        <Link className="underline" to="/signin">Sign In</Link>
        <Link className="underline" to="/signup">Sign Up</Link>
      </div>
      <div className="flex gap-2">
        Current user:
        {' '}
        {user ? user.email : 'Not logged in'}
      </div>
      {user && (
        <Button onPress={async () => {
          const result = await signOut();
          if (result.status === 'success')
            markSignOut();
        }}
        >
          Sign Out
        </Button>
      )}
    </nav>
  );
}
