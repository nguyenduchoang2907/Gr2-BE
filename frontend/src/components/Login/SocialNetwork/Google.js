import React, { useEffect } from 'react';
import accountApi from 'apis/accountApi';

function LoginGoogle() {
  const onLoginWithGoogle = async (response) => {
    try {
      const idToken = response.credential;

      const apiResponse = await accountApi.postLoginWithGoogle(idToken);
      console.log('Server Response:', apiResponse.data);
      alert('Đăng nhập thành công!');
    } catch (error) {
      console.error('Login Failed:', error.response?.data || error.message);
      alert('Đăng nhập thất bại!');
    }
  };

  useEffect(() => {
    if (window.google?.accounts?.id) {
      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '', // Check fallback
        callback: onLoginWithGoogle,
      });

      // Render the sign-in button
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { theme: 'outline', size: 'large' } // Button style
      );
    } else {
      console.error('Google Identity Services SDK is not loaded.');
    }
  }, []);

  return (
    <div>
      {/* <h1>Đăng nhập bằng Google</h1> */}
      <div id="googleSignInButton"></div>
    </div>
  );
}

export default LoginGoogle;
