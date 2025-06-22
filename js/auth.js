// Database sederhana menggunakan localStorage
class Database {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.sessions = JSON.parse(localStorage.getItem('sessions')) || [];
        
        // Buat admin default jika belum ada
        if (!this.users.some(u => u.role === 'admin')) {
            this.createUser({
                name: 'Admin',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin'
            });
        }
    }
    
    createUser(user) {
        user.id = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
        user.createdAt = new Date().toISOString();
        this.users.push(user);
        this.save();
        return user;
    }
    
    getUserByEmail(email) {
        return this.users.find(u => u.email === email);
    }
    
    validateUser(email, password) {
        const user = this.getUserByEmail(email);
        if (!user) return null;
        return user.password === password ? user : null;
    }
    
    createSession(userId) {
        const session = {
            id: this.sessions.length > 0 ? Math.max(...this.sessions.map(s => s.id)) + 1 : 1,
            userId,
            token: this.generateToken(),
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 hari
        };
        this.sessions.push(session);
        this.save();
        return session;
    }
    
    getSession(token) {
        const session = this.sessions.find(s => s.token === token);
        if (!session || new Date(session.expiresAt) < new Date()) return null;
        return session;
    }
    
    getUserFromSession(token) {
        const session = this.getSession(token);
        if (!session) return null;
        return this.users.find(u => u.id === session.userId);
    }
    
    generateToken() {
        return 'token-' + Math.random().toString(36).substr(2) + Date.now().toString(36);
    }
    
    save() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('sessions', JSON.stringify(this.sessions));
    }
}

const db = new Database();

// Fungsi utilitas
function showMessage(element, message, isError = true) {
    element.textContent = message;
    element.className = 'message ' + (isError ? 'error' : 'success');
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const messageEl = document.getElementById('loginMessage');
        
        const user = db.validateUser(email, password);
        if (user) {
            const session = db.createSession(user.id);
            localStorage.setItem('authToken', session.token);
            
            // Redirect berdasarkan role
            if (user.role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/user';
            }
        } else {
            showMessage(messageEl, 'Email atau password salah!');
        }
    });
}

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const messageEl = document.getElementById('registerMessage');
        
        // Validasi
        if (password !== confirmPassword) {
            showMessage(messageEl, 'Password tidak cocok!');
            return;
        }
        
        if (password.length < 8) {
            showMessage(messageEl, 'Password minimal 8 karakter!');
            return;
        }
        
        if (db.getUserByEmail(email)) {
            showMessage(messageEl, 'Email sudah terdaftar!');
            return;
        }
        
        // Buat user baru
        const newUser = db.createUser({
            name,
            email,
            password, // Dalam produksi nyata, password harus di-hash
            role: 'user'
        });
        
        // Buat session dan login
        const session = db.createSession(newUser.id);
        localStorage.setItem('authToken', session.token);
        window.location.href = '/user';
    });
}