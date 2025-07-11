const baseURL = "https://student-record-system.runasp.net/api/Auth/login";

document.getElementById('btnLogin').addEventListener('click', (event) => {
    event.preventDefault();

    const user = document.getElementById('usernameInput').value;
    const pass = document.getElementById('passwordInput').value;

    fetch(`${baseURL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: user,
            password: pass
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }
        return response.json();
    })
    .then((data) => {
        if (data.token) {
            localStorage.setItem('jwtToken', data.token);
            window.location.href = 'Dashboard.html';
        } else {
            throw new Error('No token received');
        }

    })
    .catch(error => {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    });
});