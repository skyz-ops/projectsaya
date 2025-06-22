// Fungsi untuk memeriksa session
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/index';
        return null;
    }
    
    const db = new Database();
    const user = db.getUserFromSession(token);
    
    if (!user) {
        localStorage.removeItem('authToken');
        window.location.href = '/index';
        return null;
    }
    
    return user;
}

// Update UI dengan data user
const user = checkAuth();
if (user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        window.location.href = '/index';
    });
}