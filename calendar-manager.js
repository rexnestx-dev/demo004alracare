// ===== CALENDAR MANAGER =====
class CalendarManager {
    constructor() {
        this.STORAGE_KEYS = {
            CALENDAR_EVENTS: 'clinic_calendar_events',
            CALENDAR_SETTINGS: 'clinic_calendar_settings'
        };
        this.init();
    }

    init() {
        this.loadDefaultSettings();
    }

    // ===== CALENDAR SETTINGS =====
    loadDefaultSettings() {
        if (!localStorage.getItem(this.STORAGE_KEYS.CALENDAR_SETTINGS)) {
            const defaultSettings = {
                syncEnabled: true,
                autoCreateEvents: true,
                defaultEventDuration: 60, // minutes
                workingHours: {
                    start: '08:00',
                    end: '17:00'
                },
                googleCalendar: {
                    enabled: false,
                    calendarId: ''
                },
                reminders: [
                    { minutes: 60, method: 'notification' }, // 1 hour before
                    { minutes: 1440, method: 'notification' } // 1 day before
                ]
            };
            this.saveSettings(defaultSettings);
        }
    }

    getSettings() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CALENDAR_SETTINGS) || '{}');
        } catch (error) {
            console.error('Error reading calendar settings:', error);
            return {};
        }
    }

    saveSettings(settings) {
        localStorage.setItem(this.STORAGE_KEYS.CALENDAR_SETTINGS, JSON.stringify(settings));
    }

    // ===== EVENT MANAGEMENT =====
    createEventFromBooking(bookingData) {
        const settings = this.getSettings();
        if (!settings.autoCreateEvents) return null;

        const event = {
            id: 'EVT' + bookingData.bookingId,
            bookingId: bookingData.bookingId,
            title: `📅 ${bookingData.serviceInfo.serviceName} - ${bookingData.patientInfo.name}`,
            description: this.generateEventDescription(bookingData),
            start: bookingData.appointmentInfo.datetime,
            end: this.calculateEndTime(bookingData.appointmentInfo.datetime, bookingData.serviceInfo.serviceId),
            allDay: false,
            type: 'appointment',
            status: bookingData.status,
            patient: bookingData.patientInfo,
            service: bookingData.serviceInfo,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            reminders: this.setupReminders(bookingData)
        };

        this.saveEvent(event);
        return event;
    }

    generateEventDescription(bookingData) {
        return `
Pasien: ${bookingData.patientInfo.name}
Telepon: ${bookingData.patientInfo.phone}
Layanan: ${bookingData.serviceInfo.serviceName}
Status: ${bookingData.status}

Catatan: ${bookingData.patientInfo.notes || 'Tidak ada catatan'}

Booking ID: ${bookingData.bookingId}
        `.trim();
    }

    calculateEndTime(startTime, serviceId) {
        const start = new Date(startTime);
        const duration = this.getServiceDuration(serviceId);
        const end = new Date(start.getTime() + duration * 60 * 1000);
        return end.toISOString();
    }

    getServiceDuration(serviceId) {
        const durations = {
            'perawatan1': 60,   // 1 hour
            'perawatan2': 90,   // 1.5 hours
            'perawatan3': 120,  // 2 hours
            'perawatan4': 60,   // 1 hour
            'perawatan5': 30    // 30 minutes
        };
        return durations[serviceId] || 60; // default 1 hour
    }

    setupReminders(bookingData) {
        const settings = this.getSettings();
        return settings.reminders.map(reminder => ({
            ...reminder,
            triggered: false,
            scheduledTime: this.calculateReminderTime(bookingData.appointmentInfo.datetime, reminder.minutes)
        }));
    }

    calculateReminderTime(appointmentTime, minutesBefore) {
        const appointment = new Date(appointmentTime);
        return new Date(appointment.getTime() - minutesBefore * 60 * 1000).toISOString();
    }

    // ===== EVENT STORAGE =====
    saveEvent(event) {
        const events = this.getEvents();
        const existingIndex = events.findIndex(e => e.id === event.id);
        
        if (existingIndex !== -1) {
            events[existingIndex] = { ...events[existingIndex], ...event, updated: new Date().toISOString() };
        } else {
            events.push(event);
        }
        
        localStorage.setItem(this.STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(events));
        this.triggerCalendarEvent('eventsUpdated');
    }

    getEvents(dateFilter = null) {
        try {
            let events = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CALENDAR_EVENTS) || '[]');
            
            if (dateFilter) {
                const filterDate = new Date(dateFilter);
                events = events.filter(event => {
                    const eventDate = new Date(event.start);
                    return eventDate.toDateString() === filterDate.toDateString();
                });
            }
            
            return events.sort((a, b) => new Date(a.start) - new Date(b.start));
        } catch (error) {
            console.error('Error reading calendar events:', error);
            return [];
        }
    }

    getEventsForMonth(year, month) {
        const events = this.getEvents();
        return events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        });
    }

    updateEventStatus(eventId, newStatus) {
        const events = this.getEvents();
        const event = events.find(e => e.id === eventId);
        
        if (event) {
            event.status = newStatus;
            event.updated = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(events));
            this.triggerCalendarEvent('eventUpdated', event);
        }
    }

    deleteEvent(eventId) {
        const events = this.getEvents();
        const filteredEvents = events.filter(e => e.id !== eventId);
        localStorage.setItem(this.STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(filteredEvents));
        this.triggerCalendarEvent('eventDeleted', { id: eventId });
    }

    // ===== CALENDAR VIEW =====
    generateCalendarView(year, month, containerId) {
        const events = this.getEventsForMonth(year, month);
        const calendarHTML = this.buildCalendarHTML(year, month, events);
        
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = calendarHTML;
            this.attachCalendarEventListeners(containerId);
        }
    }

    buildCalendarHTML(year, month, events) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        let html = `
            <div class="calendar-header">
                <h3>${firstDay.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
            </div>
            <div class="calendar-grid">
                <div class="calendar-weekdays">
                    <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
                </div>
                <div class="calendar-days">
        `;

        // Empty cells for days before the first day of month
        for (let i = 0; i < startingDay; i++) {
            html += `<div class="calendar-day empty"></div>`;
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayEvents = events.filter(event => 
                event.start.startsWith(dateStr)
            );
            
            const hasEvents = dayEvents.length > 0;
            const eventCount = dayEvents.length;
            
            html += `
                <div class="calendar-day ${hasEvents ? 'has-events' : ''}" data-date="${dateStr}">
                    <div class="day-number">${day}</div>
                    ${hasEvents ? `<div class="event-indicator">${eventCount} appointment</div>` : ''}
                </div>
            `;
        }

        html += `</div></div>`;
        return html;
    }

    attachCalendarEventListeners(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Day click event
        container.addEventListener('click', (e) => {
            const dayElement = e.target.closest('.calendar-day');
            if (dayElement && !dayElement.classList.contains('empty')) {
                const date = dayElement.dataset.date;
                this.showDayEvents(date);
            }
        });
    }

    showDayEvents(date) {
        const events = this.getEvents(date);
        let eventList = '<p>Tidak ada appointments</p>';
        
        if (events.length > 0) {
            eventList = events.map(event => `
                <div class="calendar-event-item" data-event-id="${event.id}">
                    <strong>${new Date(event.start).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</strong>
                    - ${event.patient.name} (${event.service.serviceName})
                    <span class="status-badge status-${event.status}">${event.status}</span>
                </div>
            `).join('');
        }

        alert(`Appointments untuk ${new Date(date).toLocaleDateString('id-ID')}:\n\n${eventList}`);
    }

    // ===== REMINDER SYSTEM =====
    checkReminders() {
        const events = this.getEvents();
        const now = new Date();

        events.forEach(event => {
            if (event.status === 'confirmed' && event.reminders) {
                event.reminders.forEach(reminder => {
                    if (!reminder.triggered && new Date(reminder.scheduledTime) <= now) {
                        this.triggerReminder(event, reminder);
                        reminder.triggered = true;
                    }
                });
            }
        });

        // Save updated events with triggered reminders
        localStorage.setItem(this.STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(events));
    }

    triggerReminder(event, reminder) {
        const notificationManager = new NotificationManager();
        
        switch (reminder.method) {
            case 'notification':
                notificationManager.createNotification(
                    'reminder',
                    '⏰ Appointment Reminder',
                    `${event.patient.name} - ${event.service.serviceName} dalam ${reminder.minutes} menit`,
                    {
                        eventId: event.id,
                        bookingId: event.bookingId,
                        patientName: event.patient.name,
                        service: event.service.serviceName,
                        time: new Date(event.start).toLocaleTimeString('id-ID')
                    }
                );
                break;
        }
    }

    // ===== EVENT SYSTEM =====
    triggerCalendarEvent(eventName, data = null) {
        window.dispatchEvent(new CustomEvent('calendar:' + eventName, {
            detail: data
        }));
    }

    on(eventName, callback) {
        window.addEventListener('calendar:' + eventName, (e) => callback(e.detail));
    }

    // ===== EXPORT/IMPORT =====
    exportCalendar() {
        const events = this.getEvents();
        const settings = this.getSettings();
        
        const data = {
            events: events,
            settings: settings,
            exportDate: new Date().toISOString(),
            totalEvents: events.length
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `calendar-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Global instance
window.CalendarManager = CalendarManager;

// Initialize reminder checking
setInterval(() => {
    const calendarManager = new CalendarManager();
    calendarManager.checkReminders();
}, 60 * 1000); // Check every minute