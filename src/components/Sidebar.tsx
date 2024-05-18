import { Button } from '@nextui-org/button';
import { Link } from 'react-router-dom';

import useUser from '../hooks/useUser';
import signOut from '../utils/signOut';

export default function Sidebar() {
  const { data: user } = useUser();

  return (
    <nav className="sticky top-0 flex h-screen w-72 flex-col p-4 outline">
      <div className="flex flex-col gap-2">
        <Link className="underline" to="/">Home</Link>
        <Link className="underline" to="/signin">Sign In</Link>
        <Link className="underline" to="/signup">Sign Up</Link>
      </div>
      <div className="flex gap-2">
        {user ? user.email : 'Not logged in'}
      </div>
      {user && (
        <Button onPress={signOut}>
          Sign Out
        </Button>
      )}
    </nav>
  );
}
