// Example: For splash animation or local token check
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const splash = document.getElementById('splash');

  if (splash) {
    splash.classList.add('fade-in');
    setTimeout(() => splash.classList.add('fade-out'), 2000);
  }

  if (token) {
    console.log('User is logged in with token:', token);
    // You can optionally auto-redirect or fetch user data here
  } else {
    console.log('No token found. User not logged in.');
  }
});
