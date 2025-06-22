class Database {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.sessions = JSON.parse(localStorage.getItem('sessions')) || [];
        
        // Buat admin default jika belum ada
        if (!this.users.some(u => u.role === 'admin')) {
            this.createUser({
                name: "Admin",
                email: "admin@admin.com",
                password: "admin123",
                role: "admin"
            });
        }
    }

    createUser(user) {
        user.id = this.users.length + 1;
        this.users.push(user);
        this.save();
    }

    validateUser(email, password) {
        return this.users.find(u => u.email === email && u.password === password);
    }

    createSession(userId) {
        const session = {
            id: this.sessions.length + 1,
            userId,
            token: `token-${Date.now()}`,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 hari
        };
        this.sessions.push(session);
        this.save();
        return session;
    }

    getCurrentUser() {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        
        const session = this.sessions.find(s => s.token === token && new Date(s.expiresAt) > new Date());
        if (!session) return null;
        
        return this.users.find(u => u.id === session.userId);
    }

    save() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('sessions', JSON.stringify(this.sessions));
    }
}

const db = new Database();

// Fungsi untuk redirect berdasarkan role
function checkAuth(requiredRole) {
    const user = db.getCurrentUser();
    if (!user) {
        window.location.href = "index.html";
        return null;
    }
    if (requiredRole && user.role !== requiredRole) {
        window.location.href = user.role === "admin" ? "admin.html" : "user.html";
        return null;
    }
    return user;
}

// Handle Login
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
        alert("Harap verifikasi reCAPTCHA!");
        return;
    }

    const user = db.validateUser(email, password);
    if (user) {
        const session = db.createSession(user.id);
        localStorage.setItem("authToken", session.token);
        window.location.href = user.role === "admin" ? "admin.html" : "user.html";
    } else {
        document.getElementById("loginError").textContent = "Email atau password salah!";
    }
});

// Handle Register
document.getElementById("registerForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;
    const recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
        alert("Harap verifikasi reCAPTCHA!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Password tidak cocok!");
        return;
    }

    if (db.users.some(u => u.email === email)) {
        alert("Email sudah terdaftar!");
        return;
    }

    db.createUser({ name, email, password, role: "user" });
    alert("Registrasi berhasil! Silakan login.");
    window.location.href = "index.html";
});