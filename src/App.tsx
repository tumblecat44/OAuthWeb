// Frontend (React + TypeScript)
// src/App.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [githubUser, setGithubUser] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    // 서버에서 GITHUB_CLIENT_ID 값을 가져옵니다.
    axios.get('http://localhost:4000/mykey')
      .then(response => {
        // 받은 값으로 clientId 설정
        setClientId(response.data.key);
      })
      .catch(error => {
        console.error('Error fetching GitHub client ID:', error);
      });
  }, []);

  useEffect(() => {
    // URL에서 코드 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // 백엔드로 코드 전송
      axios.post('http://localhost:4000/api/github/callback', { code })
        .then(response => {
          setGithubUser(response.data.login);
        })
        .catch(error => {
          console.error('Error during GitHub authentication:', error);
        });
    }
  }, []);

  const handleLogin = () => {
    if (clientId) {
      // GitHub OAuth 앱의 client_id를 사용하여 GitHub 로그인 페이지로 리다이렉트
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`;
    } else {
      console.error('Client ID is not available');
    }
  };

  return (
    <div className="App">
      <h1>GitHub OㅇㅇAuth Demo</h1>
      {githubUser ? (
        <div>
          <h2>Welcome, {githubUser}!</h2>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with GitHub</button>
      )}
    </div>
  );
}

export default App;
