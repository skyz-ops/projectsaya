document.addEventListener('DOMContentLoaded', () => {
    const db = new Database();
    const usersTable = document.getElementById('usersTable');
    
    // Isi tabel user
    function renderUsers() {
        usersTable.innerHTML = '';
        db.users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${user.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${user.id}">Hapus</button>
                </td>
            `;
            usersTable.appendChild(tr);
        });
        
        // Tambahkan event listener untuk tombol aksi
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = parseInt(e.target.getAttribute('data-id'));
                editUser(userId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = parseInt(e.target.getAttribute('data-id'));
                deleteUser(userId);
            });
        });
    }
    
    function editUser(userId) {
        const user = db.users.find(u => u.id === userId);
        if (!user) return;
        
        const newName = prompt('Edit nama:', user.name);
        if (newName && newName !== user.name) {
            user.name = newName;
            db.save();
            renderUsers();
            alert('User berhasil diupdate!');
        }
    }
    
    function deleteUser(userId) {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            db.users = db.users.filter(u => u.id !== userId);
            db.save();
            renderUsers();
            alert('User berhasil dihapus!');
        }
    }
    
    renderUsers();
});