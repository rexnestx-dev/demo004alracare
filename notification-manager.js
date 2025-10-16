// ===== NOTIFICATION MANAGER =====
class NotificationManager {
    constructor() {
        this.STORAGE_KEYS = {
            NOTIFICATIONS: 'clinic_notifications',
            UNREAD_COUNT: 'clinic_unread_count'
        };
        this.init();
    }

    init() {
        this.setupAutoCleanup();
    }

    // ===== NOTIFICATION TYPES =====
    createNotification(type, title, message, data = {}) {
        const notification = {
            id: 'NOT' + Date.now() + Math.random().toString(36).substr(2, 5),
            type: type, // 'new_booking', 'status_update', 'system', 'reminder'
            title: title,
            message: message,
            data: data,
            timestamp: new Date().toISOString(),
            read: false,
            priority: this.getPriority(type)
        };

        this.saveNotification(notification);
        this.showBrowserNotification(title, message);
        return notification;
    }

    getPriority(type) {
        const priorities = {
            'new_booking': 'high',
            'status_update': 'medium',
            'reminder': 'medium',
            'system': 'low'
        };
        return priorities[type] || 'low';
    }

    // ===== NOTIFICATION MANAGEMENT =====
    saveNotification(notification) {
        const notifications = this.getNotifications();
        notifications.unshift(notification); // Add to beginning
        localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
        
        // Update unread count
        this.updateUnreadCount();
        
        // Trigger event for UI updates
        this.triggerNotificationEvent('newNotification', notification);
    }

    getNotifications(limit = 50) {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS) || '[]')
                .slice(0, limit);
        } catch (error) {
            console.error('Error reading notifications:', error);
            return [];
        }
    }

    getUnreadNotifications() {
        return this.getNotifications().filter(notification => !notification.read);
    }

    markAsRead(notificationId) {
        const notifications = this.getNotifications();
        const notification = notifications.find(n => n.id === notificationId);
        
        if (notification && !notification.read) {
            notification.read = true;
            localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
            this.updateUnreadCount();
            this.triggerNotificationEvent('notificationRead', notification);
        }
    }

    markAllAsRead() {
        const notifications = this.getNotifications();
        notifications.forEach(notification => {
            notification.read = true;
        });
        localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
        this.updateUnreadCount();
        this.triggerNotificationEvent('allNotificationsRead');
    }

    deleteNotification(notificationId) {
        const notifications = this.getNotifications();
        const filteredNotifications = notifications.filter(n => n.id !== notificationId);
        localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(filteredNotifications));
        this.updateUnreadCount();
        this.triggerNotificationEvent('notificationDeleted', { id: notificationId });
    }

    // ===== UNREAD COUNT MANAGEMENT =====
    updateUnreadCount() {
        const unreadCount = this.getUnreadNotifications().length;
        localStorage.setItem(this.STORAGE_KEYS.UNREAD_COUNT, unreadCount.toString());
        
        // Update browser tab title if there are unread notifications
        this.updateTabTitle(unreadCount);
        
        // Trigger event for UI updates
        this.triggerNotificationEvent('unreadCountUpdated', unreadCount);
    }

    getUnreadCount() {
        return parseInt(localStorage.getItem(this.STORAGE_KEYS.UNREAD_COUNT) || '0');
    }

    updateTabTitle(unreadCount) {
        const baseTitle = 'Klinik Sehat Admin';
        if (unreadCount > 0) {
            document.title = `(${unreadCount}) ${baseTitle}`;
        } else {
            document.title = baseTitle;
        }
    }

    // ===== BROWSER NOTIFICATIONS =====
    showBrowserNotification(title, message) {
        // Check if browser supports notifications
        if (!("Notification" in window)) {
            console.log("Browser tidak mendukung notifications");
            return;
        }

        // Check if permission is already granted
        if (Notification.permission === "granted") {
            this.createBrowserNotification(title, message);
        } else if (Notification.permission !== "denied") {
            // Request permission from user
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    this.createBrowserNotification(title, message);
                }
            });
        }
    }

    createBrowserNotification(title, message) {
        const options = {
            body: message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'klinik-sehat',
            requireInteraction: true
        };

        const notification = new Notification(title, options);

        // Auto close after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);

        // Handle click on notification
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
    }

    // ===== AUTOMATED NOTIFICATIONS =====
    notifyNewBooking(bookingData) {
        return this.createNotification(
            'new_booking',
            '📅 Booking Baru',
            `${bookingData.patientInfo.name} booking ${bookingData.serviceInfo.serviceName}`,
            {
                bookingId: bookingData.bookingId,
                patientName: bookingData.patientInfo.name,
                service: bookingData.serviceInfo.serviceName,
                date: bookingData.appointmentInfo.date,
                time: bookingData.appointmentInfo.time
            }
        );
    }

    notifyStatusUpdate(bookingId, oldStatus, newStatus, patientName) {
        return this.createNotification(
            'status_update',
            '🔄 Status Diupdate',
            `Booking ${patientName}: ${oldStatus} → ${newStatus}`,
            {
                bookingId: bookingId,
                patientName: patientName,
                oldStatus: oldStatus,
                newStatus: newStatus
            }
        );
    }

    notifyAppointmentReminder(bookingData) {
        const appointmentDate = new Date(bookingData.appointmentInfo.datetime);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (appointmentDate.toDateString() === tomorrow.toDateString()) {
            return this.createNotification(
                'reminder',
                '⏰ Reminder Besok',
                `${bookingData.patientInfo.name} ada appointment besok jam ${bookingData.appointmentInfo.time}`,
                {
                    bookingId: bookingData.bookingId,
                    patientName: bookingData.patientInfo.name,
                    time: bookingData.appointmentInfo.time
                }
            );
        }
    }

    // ===== EVENT SYSTEM =====
    triggerNotificationEvent(eventName, data = null) {
        window.dispatchEvent(new CustomEvent('notification:' + eventName, {
            detail: data
        }));
    }

    on(eventName, callback) {
        window.addEventListener('notification:' + eventName, (e) => callback(e.detail));
    }

    // ===== MAINTENANCE =====
    setupAutoCleanup() {
        // Cleanup old notifications every day
        if (!localStorage.getItem('last_notification_cleanup')) {
            this.cleanupOldNotifications();
            localStorage.setItem('last_notification_cleanup', new Date().toISOString());
        }

        // Check for appointment reminders every hour
        setInterval(() => {
            this.checkAppointmentReminders();
        }, 60 * 60 * 1000); // 1 hour
    }

    cleanupOldNotifications() {
        const notifications = this.getNotifications();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentNotifications = notifications.filter(notification => 
            new Date(notification.timestamp) > oneWeekAgo
        );

        localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(recentNotifications));
        this.updateUnreadCount();
    }

    checkAppointmentReminders() {
        const bookings = new DataManager().getBookings();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        bookings.forEach(booking => {
            if (booking.status === 'confirmed') {
                const appointmentDate = new Date(booking.appointmentInfo.datetime);
                if (appointmentDate.toDateString() === tomorrow.toDateString()) {
                    this.notifyAppointmentReminder(booking);
                }
            }
        });
    }

    // ===== EXPORT/IMPORT =====
    exportNotifications() {
        const notifications = this.getNotifications();
        const data = {
            notifications: notifications,
            exportDate: new Date().toISOString(),
            total: notifications.length,
            unread: this.getUnreadCount()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notifications-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Global instance
window.NotificationManager = NotificationManager;