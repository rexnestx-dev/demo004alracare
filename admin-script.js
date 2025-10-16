// ===== ADMIN GLOBAL VARIABLES =====
let currentAdmin = null;
let dataManager = null;
let notificationManager = null;
let calendarManager = null;
let allBookings = [];
let allPatients = [];
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

// ===== ADMIN AUTHENTICATION =====
function initAdmin() {
    dataManager = new DataManager();
    notificationManager = new NotificationManager();
    calendarManager = new CalendarManager();
    
    // Check if already logged in
    const savedAdmin = localStorage.getItem('admin_session');
    if (savedAdmin) {
        currentAdmin = JSON.parse(savedAdmin);
        showAdminDashboard();
    } else {
        showLoginScreen();
    }
    
    setupEventListeners();
    setupNotificationListeners();
    setupCalendarListeners();
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
    updateNotificationCount();
    switchTab('dashboard');
}

function login(username, password) {
    // Simple authentication
    const validCredentials = [
        { username: 'admin', password: 'admin123', name: 'Administrator' },
        { username: 'staff', password: 'staff123', name: 'Staff' }
    ];
    
    const user = validCredentials.find(u => u.username === username && u.password === password);
    
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

// ===== NOTIFICATION SYSTEM INTEGRATION =====
function setupNotificationListeners() {
    // Listen for new notifications
    notificationManager.on('newNotification', (notification) => {
        updateNotificationCount();
        if (notification.type === 'new_booking') {
            showNotification(`📅 Booking baru: ${notification.data.patientName}`, 'info');
            loadDashboardData(); // Refresh data
        }
    });

    // Listen for unread count updates
    notificationManager.on('unreadCountUpdated', (count) => {
        updateNotificationCount();
    });

    // Check for notifications every 30 seconds
    setInterval(() => {
        updateNotificationCount();
    }, 30000);
}

function updateNotificationCount() {
    const unreadCount = notificationManager.getUnreadCount();
    document.getElementById('notificationCount').textContent = unreadCount;
    document.getElementById('sidebarNotificationCount').textContent = unreadCount;
    
    // Update dropdown notifications
    loadDropdownNotifications();
}

function loadDropdownNotifications() {
    const notifications = notificationManager.getNotifications(5);
    const container = document.getElementById('notificationsDropdownList');
    
    if (notifications.length === 0) {
        container.innerHTML = '<div class="notification-item">Tidak ada notifications</div>';
        return;
    }
    
    container.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.read ? '' : 'unread'}" 
             onclick="viewNotification('${notification.id}')">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-time">${formatTimeAgo(notification.timestamp)}</div>
        </div>
    `).join('');
}

function toggleNotifications() {
    const dropdown = document.getElementById('notificationsDropdown');
    dropdown.classList.toggle('show');
}

function viewNotification(notificationId) {
    notificationManager.markAsRead(notificationId);
    updateNotificationCount();
    
    const notification = notificationManager.getNotifications().find(n => n.id === notificationId);
    if (notification && notification.data.bookingId) {
        switchTab('bookings');
        closeModal('notificationsDropdown');
    }
}

function markAllNotificationsAsRead() {
    notificationManager.markAllAsRead();
    updateNotificationCount();
    if (document.getElementById('notificationsTab').classList.contains('active')) {
        loadNotifications();
    }
}

function clearAllNotifications() {
    if (confirm('Apakah Anda yakin ingin menghapus semua notifications?')) {
        const notifications = notificationManager.getNotifications();
        notifications.forEach(notification => {
            notificationManager.deleteNotification(notification.id);
        });
        updateNotificationCount();
        loadNotifications();
        showNotification('Semua notifications telah dihapus', 'success');
    }
}

// ===== CALENDAR SYSTEM INTEGRATION =====
function setupCalendarListeners() {
    calendarManager.on('eventsUpdated', () => {
        if (document.getElementById('calendarTab').classList.contains('active')) {
            loadCalendarView();
            loadMonthEvents();
        }
    });
}

function loadCalendarView() {
    calendarManager.generateCalendarView(currentCalendarYear, currentCalendarMonth, 'calendarView');
    document.getElementById('currentMonthYear').textContent = 
        new Date(currentCalendarYear, currentCalendarMonth).toLocaleDateString('id-ID', { 
            month: 'long', 
            year: 'numeric' 
        });
}

function changeCalendarMonth(direction) {
    currentCalendarMonth += direction;
    if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    } else if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    }
    loadCalendarView();
    loadMonthEvents();
}

function loadMonthEvents() {
    const events = calendarManager.getEventsForMonth(currentCalendarYear, currentCalendarMonth);
    const container = document.getElementById('monthEvents');
    
    if (events.length === 0) {
        container.innerHTML = '<p>Tidak ada appointments bulan ini</p>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="calendar-event-item" onclick="viewEventDetails('${event.id}')">
            <div class="event-date">${formatDate(event.start)}</div>
            <div class="event-time">${new Date(event.start).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
            <div class="event-title">${event.patient.name} - ${event.service.serviceName}</div>
            <div class="status-badge status-${event.status}">${event.status}</div>
        </div>
    `).join('');
}

function viewEventDetails(eventId) {
    const events = calendarManager.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const content = `
        <h2>Detail Appointment</h2>
        <div class="event-details">
            <div class="detail-section">
                <h3>Informasi Appointment</h3>
                <p><strong>Judul:</strong> ${event.title}</p>
                <p><strong>Tanggal:</strong> ${formatDate(event.start)}</p>
                <p><strong>Waktu:</strong> ${new Date(event.start).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.end).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${event.status}">${event.status}</span></p>
            </div>
            
            <div class="detail-section">
                <h3>Data Pasien</h3>
                <p><strong>Nama:</strong> ${event.patient.name}</p>
                <p><strong>Telepon:</strong> ${event.patient.phone}</p>
                <p><strong>Alamat:</strong> ${event.patient.address}</p>
            </div>
            
            <div class="detail-section">
                <h3>Layanan</h3>
                <p><strong>Layanan:</strong> ${event.service.serviceName}</p>
                <p><strong>Deskripsi:</strong> ${event.description}</p>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="action-btn primary" onclick="closeModal('eventModal')">
                Tutup
            </button>
        </div>
    `;
    
    document.getElementById('eventModalContent').innerHTML = content;
    openModal('eventModal');
}

function syncWithGoogleCalendar() {
    showNotification('Fitur Google Calendar sync dalam pengembangan', 'info');
    // Implementation would go here
}

function exportCalendar() {
    calendarManager.exportCalendar();
    showNotification('Calendar berhasil di-export!', 'success');
}

// ===== DASHBOARD FUNCTIONS =====
function loadDashboardData() {
    allBookings = dataManager.getBookings();
    allPatients = dataManager.getPatients();
    
    updateStatistics();
    updateRecentBookings();
    updateStatusChart();
    updateTodayAppointments();
    updateRecentNotifications();
}

function updateStatistics() {
    const stats = dataManager.getStatistics();
    
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

function updateTodayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = allBookings.filter(booking => 
        booking.appointmentInfo.date === today && 
        booking.status === 'confirmed'
    );
    
    const container = document.getElementById('todayAppointments');
    
    if (todayBookings.length === 0) {
        container.innerHTML = '<p class="no-data">Tidak ada appointments hari ini</p>';
        return;
    }
    
    container.innerHTML = todayBookings.map(booking => `
        <div class="appointment-item">
            <div class="appointment-time">${booking.appointmentInfo.time}</div>
            <div class="appointment-details">
                <strong>${booking.patientInfo.name}</strong>
                <span>${booking.serviceInfo.serviceName}</span>
            </div>
            <div class="appointment-actions">
                <button class="action-btn small" onclick="updateBookingStatus('${booking.bookingId}', 'completed')">
                    ✅ Selesai
                </button>
            </div>
        </div>
    `).join('');
}

function updateRecentNotifications() {
    const notifications = notificationManager.getNotifications(3);
    const container = document.getElementById('recentNotifications');
    
    if (notifications.length === 0) {
        container.innerHTML = '<p class="no-data">Tidak ada notifications</p>';
        return;
    }
    
    container.innerHTML = notifications.map(notification => `
        <div class="notification-dashboard-item ${notification.read ? '' : 'unread'}" 
             onclick="viewNotification('${notification.id}')">
            <div class="notification-icon">${getNotificationIcon(notification.type)}</div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-time">${formatTimeAgo(notification.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

function getNotificationIcon(type) {
    const icons = {
        'new_booking': '📅',
        'status_update': '🔄',
        'reminder': '⏰',
        'system': '⚙️'
    };
    return icons[type] || '🔔';
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
            <div class="status-bar">
                <div class="status-progress" style="width: ${(count / allBookings.length) * 100 || 0}%"></div>
            </div>
        </div>
    `).join('');
}

// ===== BOOKINGS MANAGEMENT =====
function loadBookingsTable() {
    const tableBody = document.getElementById('bookingsTable');
    const filteredBookings = filterBookingsData();
    
    if (filteredBookings.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">Tidak ada data booking</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = filteredBookings.map(booking => `
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
}

function filterBookings() {
    loadBookingsTable();
}

function filterBookingsData() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    return allBookings.filter(booking => {
        const statusMatch = !statusFilter || booking.status === statusFilter;
        const dateMatch = !dateFilter || booking.appointmentInfo.date === dateFilter;
        
        return statusMatch && dateMatch;
    });
}

function updateBookingStatus(bookingId, newStatus) {
    const booking = allBookings.find(b => b.bookingId === bookingId);
    if (!booking) return;
    
    const oldStatus = booking.status;
    
    if (dataManager.updateBooking(bookingId, { status: newStatus })) {
        // Update calendar event status
        calendarManager.updateEventStatus('EVT' + bookingId, newStatus);
        
        // Send notification
        notificationManager.notifyStatusUpdate(bookingId, oldStatus, newStatus, booking.patientInfo.name);
        
        allBookings = dataManager.getBookings();
        loadBookingsTable();
        loadDashboardData(); // Refresh dashboard stats
        showNotification(`Status booking ${bookingId} diperbarui!`, 'success');
    } else {
        showNotification('Gagal memperbarui status!', 'error');
    }
}

function viewBookingDetails(bookingId) {
    const booking = dataManager.getBookingById(bookingId);
    if (!booking) return;
    
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
}

function deleteBooking(bookingId) {
    if (confirm(`Apakah Anda yakin ingin menghapus booking ${bookingId}?`)) {
        if (dataManager.deleteBooking(bookingId)) {
            // Also delete calendar event
            calendarManager.deleteEvent('EVT' + bookingId);
            
            allBookings = dataManager.getBookings();
            loadBookingsTable();
            loadDashboardData();
            showNotification(`Booking ${bookingId} berhasil dihapus!`, 'success');
        } else {
            showNotification('Gagal menghapus booking!', 'error');
        }
    }
}

function exportBookings() {
    const bookings = dataManager.getBookings();
    const dataStr = JSON.stringify(bookings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Data bookings berhasil di-export!', 'success');
}

// ===== PATIENTS MANAGEMENT =====
function loadPatientsTable() {
    const tableBody = document.getElementById('patientsTable');
    
    if (allPatients.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">Tidak ada data pasien</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = allPatients.map(patient => {
        const patientBookings = allBookings.filter(b => b.patientInfo.phone === patient.phone);
        
        return `
            <tr>
                <td>${patient.patientId}</td>
                <td>${patient.name}</td>
                <td>${patient.phone}</td>
                <td>${patient.address}</td>
                <td>${patientBookings.length}</td>
                <td>
                    <button class="action-btn" onclick="viewPatientDetails('${patient.patientId}')">
                        👁️ Detail
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewPatientDetails(patientId) {
    const patient = allPatients.find(p => p.patientId === patientId);
    if (!patient) return;
    
    const patientBookings = allBookings.filter(b => b.patientInfo.phone === patient.phone);
    
    const content = `
        <h2>Detail Pasien</h2>
        <div class="patient-details">
            <div class="detail-section">
                <h3>Informasi Pribadi</h3>
                <p><strong>ID Pasien:</strong> ${patient.patientId}</p>
                <p><strong>Nama:</strong> ${patient.name}</p>
                <p><strong>Telepon:</strong> ${patient.phone}</p>
                <p><strong>Alamat:</strong> ${patient.address}</p>
                <p><strong>Tanggal Bergabung:</strong> ${formatDateTime(patient.createdAt)}</p>
            </div>
            
            <div class="detail-section">
                <h3>Riwayat Bookings (${patientBookings.length})</h3>
                ${patientBookings.length > 0 ? `
                    <div class="bookings-list">
                        ${patientBookings.map(booking => `
                            <div class="booking-item">
                                <strong>${booking.serviceInfo.serviceName}</strong>
                                <span> - ${formatDate(booking.appointmentInfo.date)} ${booking.appointmentInfo.time}</span>
                                <span class="status-badge status-${booking.status}">${booking.status}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p>Belum ada riwayat booking</p>'}
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="action-btn primary" onclick="closeModal('patientModal')">
                Tutup
            </button>
        </div>
    `;
    
    document.getElementById('patientModalContent').innerHTML = content;
    openModal('patientModal');
}

// ===== NOTIFICATIONS MANAGEMENT =====
function loadNotifications() {
    const container = document.getElementById('notificationsList');
    const filteredNotifications = filterNotificationsData();
    
    if (filteredNotifications.length === 0) {
        container.innerHTML = '<div class="no-data">Tidak ada notifications</div>';
        return;
    }
    
    container.innerHTML = filteredNotifications.map(notification => `
        <div class="notification-list-item ${notification.read ? '' : 'unread'}">
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-meta">
                    <span class="notification-type type-${notification.type}">${notification.type}</span>
                    <span class="notification-time">${formatDateTime(notification.timestamp)}</span>
                </div>
            </div>
            <div class="notification-actions">
                ${!notification.read ? `
                    <button class="action-btn small" onclick="markNotificationAsRead('${notification.id}')">
                        ✅ Baca
                    </button>
                ` : ''}
                <button class="action-btn small danger" onclick="deleteNotification('${notification.id}')">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

function filterNotifications() {
    loadNotifications();
}

function filterNotificationsData() {
    const typeFilter = document.getElementById('notificationTypeFilter').value;
    const statusFilter = document.getElementById('notificationStatusFilter').value;
    
    let notifications = notificationManager.getNotifications();
    
    if (typeFilter) {
        notifications = notifications.filter(n => n.type === typeFilter);
    }
    
    if (statusFilter === 'unread') {
        notifications = notifications.filter(n => !n.read);
    } else if (statusFilter === 'read') {
        notifications = notifications.filter(n => n.read);
    }
    
    return notifications;
}

function markNotificationAsRead(notificationId) {
    notificationManager.markAsRead(notificationId);
    updateNotificationCount();
    loadNotifications();
}

function deleteNotification(notificationId) {
    if (confirm('Hapus notification ini?')) {
        notificationManager.deleteNotification(notificationId);
        updateNotificationCount();
        loadNotifications();
        showNotification('Notification dihapus', 'success');
    }
}

function exportNotifications() {
    notificationManager.exportNotifications();
    showNotification('Notifications berhasil di-export!', 'success');
}

// ===== REPORTS & ANALYTICS =====
function generateReport() {
    const period = document.getElementById('reportPeriod').value;
    const month = document.getElementById('reportMonth').value;
    
    // Update bookings summary
    const bookingsSummary = document.getElementById('bookingsSummary');
    const periodBookings = filterBookingsByPeriod(allBookings, period, month);
    
    const summaryStats = {
        total: periodBookings.length,
        completed: periodBookings.filter(b => b.status === 'completed').length,
        revenue: periodBookings.filter(b => b.status === 'completed').length * 300000
    };
    
    bookingsSummary.innerHTML = `
        <p>Total Bookings: <strong>${summaryStats.total}</strong></p>
        <p>Completed: <strong>${summaryStats.completed}</strong></p>
        <p>Revenue: <strong>Rp ${summaryStats.revenue.toLocaleString('id-ID')}</strong></p>
        <p>Conversion Rate: <strong>${summaryStats.total > 0 ? Math.round((summaryStats.completed / summaryStats.total) * 100) : 0}%</strong></p>
    `;
    
    // Update popular services
    const popularServices = document.getElementById('popularServices');
    const serviceCounts = {};
    
    periodBookings.forEach(booking => {
        const serviceName = booking.serviceInfo.serviceName;
        serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
    });
    
    const popularList = Object.entries(serviceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    popularServices.innerHTML = popularList.length > 0 ? 
        popularList.map(([service, count]) => `
            <p>${service}: <strong>${count} bookings</strong></p>
        `).join('') : 
        '<p>Tidak ada data</p>';

    // Update notifications stats
    updateNotificationsStats();
    
    // Update calendar stats
    updateCalendarStats();
}

function updateNotificationsStats() {
    const notifications = notificationManager.getNotifications();
    const stats = {
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length,
        byType: {}
    };
    
    notifications.forEach(notification => {
        stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
    });
    
    const container = document.getElementById('notificationsStats');
    container.innerHTML = `
        <p>Total: <strong>${stats.total}</strong></p>
        <p>Belum Dibaca: <strong>${stats.unread}</strong></p>
        ${Object.entries(stats.byType).map(([type, count]) => `
            <p>${type}: <strong>${count}</strong></p>
        `).join('')}
    `;
}

function updateCalendarStats() {
    const events = calendarManager.getEvents();
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
        total: events.length,
        today: events.filter(e => e.start.startsWith(today)).length,
        byStatus: {}
    };
    
    events.forEach(event => {
        stats.byStatus[event.status] = (stats.byStatus[event.status] || 0) + 1;
    });
    
    const container = document.getElementById('calendarStats');
    container.innerHTML = `
        <p>Total Events: <strong>${stats.total}</strong></p>
        <p>Hari Ini: <strong>${stats.today}</strong></p>
        ${Object.entries(stats.byStatus).map(([status, count]) => `
            <p>${status}: <strong>${count}</strong></p>
        `).join('')}
    `;
}

function filterBookingsByPeriod(bookings, period, month) {
    const now = new Date();
    let startDate;
    
    switch (period) {
        case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'quarter':
            startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            break;
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        default:
            return bookings;
    }
    
    return bookings.filter(booking => 
        new Date(booking.bookingDate) >= startDate
    );
}

// ===== SETTINGS & DATA MANAGEMENT =====
function exportAllData() {
    dataManager.exportData();
    showNotification('Semua data berhasil di-export!', 'success');
}

function showImportDialog() {
    openModal('importModal');
}

function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Pilih file terlebih dahulu!', 'error');
        return;
    }
    
    dataManager.importData(file)
        .then(message => {
            showNotification(message, 'success');
            closeModal('importModal');
            loadDashboardData(); // Refresh all data
        })
        .catch(error => {
            showNotification(error, 'error');
        });
}

function showCleanupDialog() {
    if (confirm('Hapus data booking yang lebih lama dari 1 tahun? Tindakan ini tidak dapat dibatalkan.')) {
        const deletedCount = dataManager.cleanupOldData(365);
        showNotification(`${deletedCount} data lama berhasil dihapus!`, 'success');
        loadDashboardData();
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
        case 'calendar':
            loadCalendarView();
            loadMonthEvents();
            break;
        case 'notifications':
            loadNotifications();
            break;
        case 'reports':
            generateReport();
            break;
    }
    
    // Close notifications dropdown
    document.getElementById('notificationsDropdown').classList.remove('show');
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

function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    return formatDate(timestamp);
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
    
    // Settings forms
    document.getElementById('notificationSettingsForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Pengaturan notifications berhasil disimpan!', 'success');
    });
    
    document.getElementById('calendarSettingsForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Pengaturan calendar berhasil disimpan!', 'success');
    });
    
    document.getElementById('clinicSettingsForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Pengaturan klinik berhasil disimpan!', 'success');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.notification-bell') && !e.target.closest('.notifications-dropdown')) {
            document.getElementById('notificationsDropdown').classList.remove('show');
        }
    });
    
    // Data sync listener
    window.addEventListener('clinicDataUpdated', function(e) {
        console.log('Data updated:', e.detail.key);
        // Refresh relevant data when updated from another tab
        if (e.detail.key === 'clinic_bookings') {
            allBookings = dataManager.getBookings();
            if (document.getElementById('bookingsTab').classList.contains('active')) {
                loadBookingsTable();
            }
            loadDashboardData();
        }
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initAdmin();
});

console.log('Klinik Sehat Admin Dashboard initialized!');