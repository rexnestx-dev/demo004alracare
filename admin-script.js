// ===== ADMIN GLOBAL VARIABLES =====
let currentAdmin = null;
let dataManager = null;
let allBookings = [];
let allPatients = [];

// ===== ADMIN AUTHENTICATION =====
function initAdmin() {
    dataManager = new DataManager();
    
    // Check if already logged in
    const savedAdmin = localStorage.getItem('admin_session');
    if (savedAdmin) {
        currentAdmin = JSON.parse(savedAdmin);
        showAdminDashboard();
    } else {
        showLoginScreen();
    }
    
    setupEventListeners();
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showAdminDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    
    // Update greeting
    document.getElementById('adminGreeting').textContent = `Halo, ${currentAdmin.username}!`;
    
    // Load initial data
    loadDashboardData();
    switchTab('dashboard');
}

function login(username, password) {
    console.log('Login attempt:', username, password);
    
    // Simple authentication - FIXED VERSION
    const validCredentials = [
        { username: 'admin', password: 'admin123', name: 'Administrator' },
        { username: 'staff', password: 'staff123', name: 'Staff' }
    ];
    
    const user = validCredentials.find(u => 
        u.username === username && u.password === password
    );
    
    if (user) {
        currentAdmin = user;
        localStorage.setItem('admin_session', JSON.stringify(user));
        showAdminDashboard();
        showNotification('Login berhasil!', 'success');
        return true;
    } else {
        showNotification('Username atau password salah!', 'error');
        return false;
    }
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        currentAdmin = null;
        localStorage.removeItem('admin_session');
        showLoginScreen();
        showNotification('Logout berhasil!', 'success');
    }
}

// ===== DASHBOARD FUNCTIONS =====
function loadDashboardData() {
    try {
        const dataManager = new DataManager();
        allBookings = dataManager.getBookings();
        allPatients = dataManager.getPatients();
        
        console.log('Dashboard - Bookings loaded:', allBookings.length);
        console.log('Dashboard - Patients loaded:', allPatients.length);
        
        updateStatistics();
        updateRecentBookings();
        updateStatusChart();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading data', 'error');
    }
}

function updateStatistics() {
    const stats = {
        totalBookings: allBookings.length,
        totalPatients: allPatients.length,
        pendingBookings: allBookings.filter(b => b.status === 'pending').length,
        revenue: allBookings.filter(b => b.status === 'completed').length * 300000
    };
    
    document.getElementById('totalBookings').textContent = stats.totalBookings;
    document.getElementById('totalPatients').textContent = stats.totalPatients;
    document.getElementById('pendingBookings').textContent = stats.pendingBookings;
    document.getElementById('revenue').textContent = `Rp ${stats.revenue.toLocaleString('id-ID')}`;
}

function updateRecentBookings() {
    const recentBookings = allBookings
        .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
        .slice(0, 5);
    
    const container = document.getElementById('recentBookings');
    
    if (recentBookings.length === 0) {
        container.innerHTML = '<p class="no-data">Tidak ada booking terbaru</p>';
        return;
    }
    
    container.innerHTML = recentBookings.map(booking => `
        <div class="booking-item" onclick="viewBookingDetails('${booking.bookingId}')">
            <div class="booking-info">
                <strong>${booking.patientInfo.name}</strong>
                <span> - ${booking.serviceInfo.serviceName}</span>
            </div>
            <div class="booking-meta">
                <span>${formatDate(booking.appointmentInfo.date)} ${booking.appointmentInfo.time}</span>
                <span class="status-badge status-${booking.status}">${booking.status}</span>
            </div>
        </div>
    `).join('');
}

function updateStatusChart() {
    const statusCounts = {
        pending: allBookings.filter(b => b.status === 'pending').length,
        confirmed: allBookings.filter(b => b.status === 'confirmed').length,
        completed: allBookings.filter(b => b.status === 'completed').length,
        cancelled: allBookings.filter(b => b.status === 'cancelled').length
    };
    
    const container = document.getElementById('statusChart');
    
    container.innerHTML = Object.entries(statusCounts).map(([status, count]) => `
        <div class="status-item">
            <span class="status-label">${status.toUpperCase()}</span>
            <span class="status-count">${count}</span>
        </div>
    `).join('');
}

// ===== BOOKINGS MANAGEMENT =====
function loadBookingsTable() {
    const tableBody = document.getElementById('bookingsTable');
    
    try {
        const dataManager = new DataManager();
        const bookings = dataManager.getBookings();
        
        console.log('Bookings table - Loaded:', bookings.length, 'bookings');
        
        if (bookings.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">Tidak ada data booking</td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = bookings.map(booking => `
            <tr>
                <td>${booking.bookingId}</td>
                <td>${booking.patientInfo.name}</td>
                <td>${booking.serviceInfo.serviceName}</td>
                <td>${formatDate(booking.appointmentInfo.date)}</td>
                <td>${booking.appointmentInfo.time}</td>
                <td>
                    <select onchange="updateBookingStatus('${booking.bookingId}', this.value)" 
                            class="status-select status-${booking.status}">
                        <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <button class="action-btn" onclick="viewBookingDetails('${booking.bookingId}')">
                        👁️ Detail
                    </button>
                    <button class="action-btn danger" onclick="deleteBooking('${booking.bookingId}')">
                        🗑️ Hapus
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading bookings table:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">Error loading data</td>
            </tr>
        `;
    }
}

function updateBookingStatus(bookingId, newStatus) {
    try {
        const dataManager = new DataManager();
        const success = dataManager.updateBooking(bookingId, { status: newStatus });
        
        if (success) {
            // Refresh data
            loadDashboardData();
            if (document.getElementById('bookingsTab').classList.contains('active')) {
                loadBookingsTable();
            }
            showNotification(`Status booking ${bookingId} diperbarui!`, 'success');
        } else {
            showNotification('Gagal memperbarui status!', 'error');
        }
    } catch (error) {
        console.error('Error updating booking status:', error);
        showNotification('Error updating status', 'error');
    }
}

function viewBookingDetails(bookingId) {
    try {
        const dataManager = new DataManager();
        const booking = dataManager.getBookingById(bookingId);
        
        if (!booking) {
            showNotification('Booking tidak ditemukan!', 'error');
            return;
        }
        
        const content = `
            <h2>Detail Booking</h2>
            <div class="booking-details">
                <div class="detail-section">
                    <h3>Informasi Booking</h3>
                    <p><strong>ID:</strong> ${booking.bookingId}</p>
                    <p><strong>Tanggal Booking:</strong> ${formatDateTime(booking.bookingDate)}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${booking.status}">${booking.status}</span></p>
                </div>
                
                <div class="detail-section">
                    <h3>Data Pasien</h3>
                    <p><strong>Nama:</strong> ${booking.patientInfo.name}</p>
                    <p><strong>Telepon:</strong> ${booking.patientInfo.phone}</p>
                    <p><strong>Alamat:</strong> ${booking.patientInfo.address}</p>
                    <p><strong>Catatan:</strong> ${booking.patientInfo.notes || 'Tidak ada'}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Jadwal & Layanan</h3>
                    <p><strong>Tanggal:</strong> ${formatDate(booking.appointmentInfo.date)}</p>
                    <p><strong>Jam:</strong> ${booking.appointmentInfo.time}</p>
                    <p><strong>Layanan:</strong> ${booking.serviceInfo.serviceName}</p>
                    ${booking.serviceInfo.selectedOptions ? `
                        <p><strong>Detail Layanan:</strong></p>
                        <ul>
                            ${booking.serviceInfo.selectedOptions.map(opt => `
                                <li>${opt.name} - ${opt.price}</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="action-btn primary" onclick="closeModal('bookingModal')">
                    Tutup
                </button>
            </div>
        `;
        
        document.getElementById('bookingModalContent').innerHTML = content;
        openModal('bookingModal');
        
    } catch (error) {
        console.error('Error viewing booking details:', error);
        showNotification('Error loading booking details', 'error');
    }
}

function deleteBooking(bookingId) {
    if (confirm(`Apakah Anda yakin ingin menghapus booking ${bookingId}?`)) {
        try {
            const dataManager = new DataManager();
            const success = dataManager.deleteBooking(bookingId);
            
            if (success) {
                // Refresh data
                loadDashboardData();
                if (document.getElementById('bookingsTab').classList.contains('active')) {
                    loadBookingsTable();
                }
                showNotification(`Booking ${bookingId} berhasil dihapus!`, 'success');
            } else {
                showNotification('Gagal menghapus booking!', 'error');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            showNotification('Error deleting booking', 'error');
        }
    }
}

// ===== PATIENTS MANAGEMENT =====
function loadPatientsTable() {
    const tableBody = document.getElementById('patientsTable');
    
    try {
        const dataManager = new DataManager();
        const patients = dataManager.getPatients();
        const bookings = dataManager.getBookings();
        
        console.log('Patients table - Loaded:', patients.length, 'patients');
        
        if (patients.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-data">Tidak ada data pasien</td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = patients.map(patient => {
            const patientBookings = bookings.filter(b => b.patientInfo.phone === patient.phone);
            
            return `
                <tr>
                    <td>${patient.patientId}</td>
                    <td>${patient.name}</td>
                    <td>${patient.phone}</td>
                    <td>${patient.address}</td>
                    <td>${patientBookings.length}</td>
                </tr>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading patients table:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">Error loading data</td>
            </tr>
        `;
    }
}

// ===== UTILITY FUNCTIONS =====
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Activate corresponding menu item
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Load tab-specific data
    switch (tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'bookings':
            loadBookingsTable();
            break;
        case 'patients':
            loadPatientsTable();
            break;
    }
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID');
}

function formatDateTime(dateTimeString) {
    return new Date(dateTimeString).toLocaleString('id-ID');
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        
        if (type === 'error') {
            notification.style.borderLeftColor = '#e74c3c';
        } else if (type === 'success') {
            notification.style.borderLeftColor = '#27ae60';
        } else if (type === 'warning') {
            notification.style.borderLeftColor = '#f39c12';
        } else {
            notification.style.borderLeftColor = '#3498db';
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Login form
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        login(username, password);
    });
    
    // Sidebar navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Auto login for testing (remove in production)
    console.log('Auto-filling login for testing...');
    document.getElementById('adminUsername').value = 'admin';
    document.getElementById('adminPassword').value = 'admin123';
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initAdmin();
    console.log('Klinik Sehat Admin Dashboard initialized!');
});