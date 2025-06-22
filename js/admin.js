// Hanya admin yang boleh akses
const currentUser = checkAuth("admin");
if (!currentUser) return;

// Render daftar user
function renderUsers() {
    const users = db.users.filter(u => u.role !== "admin"); // Jangan tampilkan admin lain
    const table = document.getElementById("usersTable").getElementsByTagName('tbody')[0];
    table.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn-delete" data-id="${user.id}">Hapus</button>
            </td>
        </tr>
    `).join("");
}

// Handle hapus user
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const userId = parseInt(e.target.dataset.id);
        if (confirm("Hapus user ini?")) {
            db.users = db.users.filter(u => u.id !== userId);
            db.save();
            renderUsers();
        }
    }
});

renderUsers();