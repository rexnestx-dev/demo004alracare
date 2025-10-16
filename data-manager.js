// ===== SHARED DATA MANAGER =====
class DataManager {
    constructor() {
        this.STORAGE_KEYS = {
            BOOKINGS: 'clinic_bookings',
            PATIENTS: 'clinic_patients',
            SETTINGS: 'clinic_settings',
            SERVICES: 'clinic_services'
        };
        
        this.init();
    }

    init() {
        this.setupCrossTabSync();
        this.initializeDefaultData();
    }

    // ===== BOOKINGS MANAGEMENT =====
    getBookings() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.BOOKINGS) || '[]');
        } catch (error) {
            console.error('Error reading bookings:', error);
            return [];
        }
    }

    saveBookings(bookings) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
            this.triggerStorageEvent(this.STORAGE_KEYS.BOOKINGS);
            return true;
        } catch (error) {
            console.error('Error saving bookings:', error);
            return false;
        }
    }

    addBooking(bookingData) {
        const bookings = this.getBookings();
        bookings.push(bookingData);
        return this.saveBookings(bookings);
    }

    updateBooking(bookingId, updates) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(booking => booking.bookingId === bookingId);
        
        if (index !== -1) {
            bookings[index] = { ...bookings[index], ...updates, lastUpdated: new Date().toISOString() };
            return this.saveBookings(bookings);
        }
        return false;
    }

    deleteBooking(bookingId) {
        const bookings = this.getBookings();
        const filteredBookings = bookings.filter(booking => booking.bookingId !== bookingId);
        return this.saveBookings(filteredBookings);
    }

    getBookingById(bookingId) {
        const bookings = this.getBookings();
        return bookings.find(booking => booking.bookingId === bookingId);
    }

    // ===== PATIENTS MANAGEMENT =====
    getPatients() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PATIENTS) || '[]');
        } catch (error) {
            console.error('Error reading patients:', error);
            return [];
        }
    }

    savePatients(patients) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
            this.triggerStorageEvent(this.STORAGE_KEYS.PATIENTS);
            return true;
        } catch (error) {
            console.error('Error saving patients:', error);
            return false;
        }
    }

    findOrCreatePatient(phone, patientData) {
        const patients = this.getPatients();
        let patient = patients.find(p => p.phone === phone);
        
        if (!patient) {
            patient = {
                patientId: 'PT' + Date.now(),
                phone: phone,
                ...patientData,
                createdAt: new Date().toISOString(),
                bookings: []
            };
            patients.push(patient);
            this.savePatients(patients);
        }
        
        return patient;
    }

    // ===== STATISTICS & ANALYTICS =====
    getStatistics() {
        const bookings = this.getBookings();
        const patients = this.getPatients();
        
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const recentBookings = bookings.filter(booking => 
            new Date(booking.bookingDate) >= lastMonth
        );

        return {
            totalBookings: bookings.length,
            totalPatients: patients.length,
            pendingBookings: bookings.filter(b => b.status === 'pending').length,
            confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
            completedBookings: bookings.filter(b => b.status === 'completed').length,
            weeklyBookings: bookings.filter(b => new Date(b.bookingDate) >= lastWeek).length,
            monthlyBookings: recentBookings.length,
            revenue: this.calculateRevenue(recentBookings)
        };
    }

    calculateRevenue(bookings) {
        return bookings.reduce((total, booking) => {
            if (booking.status === 'completed') {
                // Simple revenue calculation - in real app, use actual prices
                return total + 300000; // Average service price
            }
            return total;
        }, 0);
    }

    // ===== DATA SYNCHRONIZATION =====
    setupCrossTabSync() {
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('clinic_')) {
                console.log('Data updated from another tab:', e.key);
                // Trigger custom event for UI updates
                window.dispatchEvent(new CustomEvent('clinicDataUpdated', {
                    detail: { key: e.key, newValue: e.newValue }
                }));
            }
        });
    }

    triggerStorageEvent(key) {
        // This helps sync data across tabs
        window.dispatchEvent(new StorageEvent('storage', {
            key: key,
            newValue: localStorage.getItem(key),
            oldValue: localStorage.getItem(key),
            storageArea: localStorage,
            url: window.location.href
        }));
    }

    // ===== DATA EXPORT/IMPORT =====
    exportData() {
        const data = {
            bookings: this.getBookings(),
            patients: this.getPatients(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `klinik-sehat-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.bookings) {
                        this.saveBookings(data.bookings);
                    }
                    if (data.patients) {
                        this.savePatients(data.patients);
                    }
                    
                    resolve('Data imported successfully');
                } catch (error) {
                    reject('Invalid data format');
                }
            };
            reader.onerror = () => reject('Error reading file');
            reader.readAsText(file);
        });
    }

    // ===== DATA INITIALIZATION =====
    initializeDefaultData() {
        // Initialize empty arrays if not exists
        if (!localStorage.getItem(this.STORAGE_KEYS.BOOKINGS)) {
            this.saveBookings([]);
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.PATIENTS)) {
            this.savePatients([]);
        }
    }

    // ===== DATA CLEANUP =====
    cleanupOldData(daysOld = 365) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        const bookings = this.getBookings();
        const recentBookings = bookings.filter(booking => 
            new Date(booking.bookingDate) >= cutoffDate
        );
        
        this.saveBookings(recentBookings);
        return bookings.length - recentBookings.length;
    }
}

// Global instance
window.DataManager = DataManager;