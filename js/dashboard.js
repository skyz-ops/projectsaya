// Cek apakah user sudah login
const user = checkAuth();
if (!user) {
    window.location.href = "index.html";
} else {
    // Update UI
    document.getElementById("userName")?.textContent = user.name;
    document.getElementById("userAvatar")?.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
}

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.href = "index.html?logout=true";
});