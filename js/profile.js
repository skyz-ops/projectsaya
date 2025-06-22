const currentUser = checkAuth();
if (!currentUser) return;

// Isi form dengan data user
document.getElementById("profileName").value = currentUser.name;
document.getElementById("profileEmail").value = currentUser.email;

// Handle submit form
document.getElementById("profileForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const newName = document.getElementById("profileName").value;
    
    // Update data user
    currentUser.name = newName;
    const userIndex = db.users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        db.users[userIndex] = currentUser;
        db.save();
        alert("Profil berhasil diperbarui!");
        window.location.reload();
    }
});