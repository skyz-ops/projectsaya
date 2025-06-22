const currentUser = checkAuth();
if (!currentUser) return;

// Handle ganti password
document.getElementById("passwordForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (currentUser.password !== currentPassword) {
        alert("Password saat ini salah!");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Password baru tidak cocok!");
        return;
    }

    // Update password
    currentUser.password = newPassword;
    const userIndex = db.users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        db.users[userIndex] = currentUser;
        db.save();
        alert("Password berhasil diubah!");
        e.target.reset();
    }
});

// Handle hapus akun
document.getElementById("deleteAccountBtn")?.addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin menghapus akun ini? Aksi ini tidak dapat dibatalkan!")) {
        db.users = db.users.filter(u => u.id !== currentUser.id);
        db.sessions = db.sessions.filter(s => s.userId !== currentUser.id);
        db.save();
        localStorage.removeItem("authToken");
        alert("Akun berhasil dihapus!");
        window.location.href = "index.html";
    }
});