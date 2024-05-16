import { Button } from '@nextui-org/button';
import { useState } from 'react';

import Auth from './Auth';
import { devServer } from './utils/serverUrl';

export default function App() {
  const [fetchResult, setFetchResult] = useState();

  function fetchData() {
    fetch(`${devServer}/api/project`, {
      credentials: 'include',
    }).then(res => res.json()).then(setFetchResult);
  }

  function signOut() {
    fetch(`${devServer}/auth/signout`, { method: 'POST', credentials: 'include' }).then(res => res.json()).then((data) => {
      localStorage.setItem('isLoggedIn', 'false');
      console.log(data);
    });
  }

  return (
    <div className="min-h-screen w-screen" id="App">
      <Button onPress={fetchData}>Fetch Data</Button>
      <p>isLoggedIn (localStorage):</p>
      <pre>{localStorage.getItem('isLoggedIn') === 'true' ? 'true' : 'false'}</pre>
      <Button onPress={signOut}>Sign Out</Button>

      <p>fetchResult:</p>
      <pre>{JSON.stringify(fetchResult, null, 2)}</pre>
      <Auth mode="signin" />
      {/* <Auth mode="signup" /> */}
    </div>
  );
}
