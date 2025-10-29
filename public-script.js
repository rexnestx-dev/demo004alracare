// ===== GLOBAL VARIABLES =====
let currentService = null;
let isModalTransitioning = false;

// ===== SERVICE DETAILS DATA =====
const serviceDetails = {
    perawatan1: {
        title: "Perawatan Luka Modern",
        description: "Pilih jenis perawatan luka yang Anda butuhkan",
        type: "checkbox",
        options: [
            {
                id: "Perawatan Luka di Klinik",
                name: "Perawatan Luka di Klinik",
                price: "Rp 150.000",
                image: "./images/L_PERAWATANLIKADIKLINIK.webp",
            },
            {
                id: "Perawatan Luka Ke Rumah",
                name: "Perawatan Luka Ke Rumah di Area Pontianak",
                price: "Rp 200.000",
                image: "./images/L_PERAWATANLUKAKERUMAHPASIENDIAREAPONTIANAK_1.webp",
            },
            {
                id: "L_SENDALDIABETES",
                name: "Sendal Diabetes",
                price: "Rp 500.000",
                image: "./images/L_SENDALDIABETES.webp",
            }
        ]
    },
    perawatan2: {
        title: "Perawatan Kecantikan",
        description: "Pilih jenis perawatan kecantikan yang Anda butuhkan",
        type: "checkbox",
        options: [
            {
                id: "A_BABAK(NEVUSOFOTA)",
                name: "Babak (Nevusofota)",
                price: "Rp 350.000",
                image: "./images/A_BABAK(NEVUSOFOTA).webp",
            },
            {
                id: "A_BB_GLOW",
                name: "BB Glow",
                price: "Rp 380.000",
                image: "./images/A_BB_GLOW.webp",
            },
            {
                id: "A_BEKASCACAR(SMALLPOXSCAR)",
                name: "Bekas Cacar (Smallpox scar)",
                price: "Rp 550.000",
                image: "./images/A_BEKASCACAR(SMALLPOXSCAR).webp",
            },
            {
                id: "A_BEKASLUKACEKUNG(SCAR)",
                name: "Bekas Luka Cekung (Scar)",
                price: "Rp 550.000",
                image: "./images/A_BEKASLUKACEKUNG(SCAR).webp",
            },
            {
                id: "A_BLOODSPOT",
                name: "Blood spot_1-10",
                price: "Rp 500.000",
                image: "./images/A_BLOODSPOT.webp",
            },
            {
                id: "A_TOMPEL3X3CM",
                name: "Tompel 3x3cm",
                price: "Rp 500.000",
                image: "./images/A_TOMPEL.webp",
            },
            {
                id: "A_XENTALASMA",
                name: "Xentalasma",
                price: "Rp 500.000",
                image: "./images/A_XENTALASMA.webp",
            }
        ]
    },
    perawatan3: {
        title: "Sunat Modern",
        description: "Pilih metode sunat yang sesuai dengan kebutuhan",
        type: "checkbox",
        options: [
            {
                id: "S_RING",
                name: "Sunat Ring",
                price: "Rp 1.200.000",
                image: "./images/S_RING.webp",
            }
        ]
    },
    perawatan4: {
        title: "Hipnoterapi",
        description: "Pilih jenis terapi hipnoterapi yang sesuai dengan kebutuhan Anda",
        type: "checkbox",
        options: [
            {
                id: "H_BERHENTIJUDOL",
                name: "Berhenti Judol",
                price: "Rp 500.000",
                image: "./images/H_BERHENTIJUDOL.webp",
            },
            {
                id: "H_BERHENTIMEROKOK",
                name: "Berhenti Merokok",
                price: "Rp 500.000",
                image: "./images/H_BERHENTIMEROKOK.webp",
            }
        ]
    },
    perawatan5: {
        title: "Skincare",
        description: "Pilih produk skincare yang sesuai dengan kebutuhan kulit Anda",
        type: "checkbox",
        options: [
            {
                id: "SK_BBCREAMACNE",
                name: "BB Cream Acne",
                price: "Rp 160.000",
                image: "./images/SK_BBCREAMACNE.webp",
            },
            {
                id: "SK_FACIALSOAPSALICID",
                name: "Facial Soap Salicid",
                price: "Rp 170.000",
                image: "./images/SK_FACIALSOAPSALICID.webp",
            }
        ]
    }
};

// ===== IMAGE ORIENTATION DETECTION =====
function detectImageOrientation(imgSrc, callback) {
    const img = new Image();
    
    // Set timeout untuk mencegah hanging
    const timeout = setTimeout(() => {
        callback({
            isPortrait: false,
            isLandscape: true,
            isSquare: false,
            width: 400,
            height: 300,
            aspectRatio: 4/3
        });
    }, 3000);
    
    img.onload = function() {
        clearTimeout(timeout);
        const isPortrait = this.height > this.width;
        const isLandscape = this.width > this.height;
        const isSquare = this.width === this.height;
        
        callback({
            isPortrait,
            isLandscape,
            isSquare,
            width: this.width,
            height: this.height,
            aspectRatio: this.width / this.height
        });
    };
    
    img.onerror = function() {
        clearTimeout(timeout);
        // Fallback jika gambar gagal load
        callback({
            isPortrait: false,
            isLandscape: true,
            isSquare: false,
            width: 400,
            height: 300,
            aspectRatio: 4/3
        });
    };
    
    img.src = imgSrc;
}

function getImageContainerClass(orientation) {
    if (orientation.isPortrait) return 'portrait';
    if (orientation.isLandscape) return 'landscape';
    return 'square';
}

// ===== IMPROVED IMAGE LOADING =====
function loadImageWithFallback(imgElement, src, alt) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            imgElement.src = src;
            imgElement.alt = alt;
            resolve({
                success: true,
                width: this.width,
                height: this.height
            });
        };
        img.onerror = function() {
            // Fallback image
            imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjhmOGY4IiByeD0iMjAiLz4KPHRleHQgeD0iMjAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2NjYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
            imgElement.alt = 'Gambar tidak tersedia';
            resolve({
                success: false,
                width: 400,
                height: 400
            });
        };
        img.src = src;
    });
}

// ===== IMPROVED MODAL MANAGEMENT =====
const modalManager = {
    openModal: function(modalId) {
        if (isModalTransitioning) return;
        isModalTransitioning = true;
        
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        
        // Reset scroll position
        modal.scrollTop = 0;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '15px';
        
        // Smooth opening
        setTimeout(() => {
            modal.classList.add('show');
            isModalTransitioning = false;
        }, 10);
    },
    
    closeModal: function(modalId) {
        if (isModalTransitioning) return;
        isModalTransitioning = true;
        
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';
            
            // Clear modal content to prevent glitches
            if (modalId === 'serviceModal') {
                document.getElementById('serviceModalContent').innerHTML = '';
            }
            isModalTransitioning = false;
        }, 300);
    },
    
    closeAll: function() {
        if (isModalTransitioning) return;
        isModalTransitioning = true;
        
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
            
            setTimeout(() => {
                modal.style.display = 'none';
                
                // Clear service modal content
                if (modal.id === 'serviceModal') {
                    document.getElementById('serviceModalContent').innerHTML = '';
                }
            }, 300);
        });
        
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
        
        setTimeout(() => {
            isModalTransitioning = false;
        }, 350);
    }
};

// ===== IMPROVED SERVICE NAVIGATION =====
function navigateToService(serviceId) {
    if (isModalTransitioning) return;
    
    // Close any existing modals smoothly
    modalManager.closeAll();
    
    // Small delay to allow modal to close completely
    setTimeout(() => {
        showServiceDetail(serviceId);
    }, 350);
}

// ===== IMPROVED SERVICE DETAIL MODAL FUNCTIONS =====
function showServiceDetail(serviceId) {
    if (isModalTransitioning) return;
    
    const service = serviceDetails[serviceId];
    if (!service) return;

    // Show loading state immediately
    const modalContent = document.getElementById('serviceModalContent');
    modalContent.innerHTML = `
        <div class="loading-state">
            <div class="loading-icon">⏳</div>
            <h3>Memuat Layanan...</h3>
            <p>Sedang memuat detail layanan yang dipilih</p>
        </div>
    `;

    modalManager.openModal('serviceModal');

    if (service.type === "checkbox") {
        // Buat array promises untuk mendeteksi semua orientasi gambar
        const orientationPromises = service.options.map(option => {
            return new Promise((resolve) => {
                detectImageOrientation(option.image, (orientation) => {
                    resolve({
                        option,
                        orientation
                    });
                });
            });
        });

        // Tunggu semua gambar selesai di-deteksi
        Promise.all(orientationPromises)
            .then(results => {
                renderServiceOptions(service, results);
            })
            .catch(error => {
                console.error('Error loading service details:', error);
                showErrorState(service);
            });
    }
}

function renderServiceOptions(service, results) {
    const optionsHTML = results.map(({ option, orientation }) => {
        const containerClass = getImageContainerClass(orientation);
        
        return `
            <div class="option-card" onclick="toggleOptionSelection('${option.id}')">
                <div class="option-header">
                    <div class="option-checkbox">
                        <input type="checkbox" id="${option.id}" name="service-option" value="${option.id}" 
                               onclick="event.stopPropagation(); updateSelectionSummary('${service.title}')">
                    </div>
                    <div class="option-image-container ${containerClass}">
                        <img src="${option.image}" alt="${option.name}" 
                             loading="lazy"
                             onload="this.style.opacity='1'"
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjhmOGY4IiByeD0iMjAiLz4KPHRleHQgeD0iMjAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2NjYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K'; this.style.opacity='1'"
                             style="opacity: 0; transition: opacity 0.3s ease">
                    </div>
                    <div class="option-title">
                        <h3>${option.name}</h3>
                    </div>
                </div>
                
                <div class="option-details">
                    <div class="option-price">
                        <strong>💰 Harga:</strong> ${option.price}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const content = `
        <div class="service-modal-header">
            <h2>${service.title}</h2>
            <p class="service-description">${service.description}</p>
            <p class="selection-info">✅ Pilih satu atau beberapa perawatan dengan mengklik card-nya</p>
        </div>
        
        <div class="options-container">
            ${optionsHTML}
        </div>
        
        <div class="selection-summary" id="selectionSummary" style="display: none;">
            <h4>📋 Perawatan yang Dipilih:</h4>
            <div id="selectedOptionsList"></div>
            <div class="total-price">
                <strong>💰 Total Estimasi: <span id="totalPrice">Rp 0</span></strong>
            </div>
        </div>
        
        <div class="service-modal-footer">
            <button class="cta-button secondary" onclick="modalManager.closeAll()">
                ← Kembali
            </button>
            <button class="cta-button" id="bookingBtn" onclick="proceedToBooking('${service.title}')" disabled>
                📅 Lanjut ke Booking
            </button>
        </div>
    `;

    // Smooth transition for content update
    const modalContent = document.getElementById('serviceModalContent');
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.innerHTML = content;
        modalContent.style.opacity = '1';
        
        if (service.type === "checkbox") {
            attachCheckboxListeners(service.title);
        }
    }, 200);
}

function showErrorState(service) {
    const modalContent = document.getElementById('serviceModalContent');
    modalContent.innerHTML = `
        <div class="error-state">
            <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
            <h3>Gagal Memuat Layanan</h3>
            <p>Terjadi kesalahan saat memuat detail layanan. Silakan coba lagi.</p>
            <button class="cta-button" onclick="showServiceDetail('${service.title}')" style="margin-top: 1rem;">
                🔄 Coba Lagi
            </button>
        </div>
    `;
}

function toggleOptionSelection(optionId) {
    const checkbox = document.getElementById(optionId);
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
        
        // Add/remove selected class for visual feedback
        const optionCard = checkbox.closest('.option-card');
        if (checkbox.checked) {
            optionCard.classList.add('selected');
        } else {
            optionCard.classList.remove('selected');
        }
        
        // Cari serviceId dari checkbox yang di-click
        const serviceId = Object.keys(serviceDetails).find(id => 
            serviceDetails[id].options.some(opt => opt.id === optionId)
        );
        if (serviceId) {
            updateSelectionSummary(serviceId);
        }
    }
}

function attachCheckboxListeners(serviceId) {
    const checkboxes = document.querySelectorAll('input[name="service-option"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const optionCard = this.closest('.option-card');
            if (this.checked) {
                optionCard.classList.add('selected');
            } else {
                optionCard.classList.remove('selected');
            }
            updateSelectionSummary(serviceId);
        });
    });

    // Initial update
    updateSelectionSummary(serviceId);
}

function updateSelectionSummary(serviceId) {
    const service = serviceDetails[serviceId];
    const selectedCheckboxes = document.querySelectorAll('input[name="service-option"]:checked');
    const bookingBtn = document.getElementById('bookingBtn');
    const selectionSummary = document.getElementById('selectionSummary');
    const selectedOptionsList = document.getElementById('selectedOptionsList');
    const totalPriceElement = document.getElementById('totalPrice');

    bookingBtn.disabled = selectedCheckboxes.length === 0;
    
    if (selectedCheckboxes.length > 0) {
        selectionSummary.style.display = 'block';
        
        let optionsHTML = '';
        let totalPrice = 0;
        
        selectedCheckboxes.forEach(checkbox => {
            const option = service.options.find(opt => opt.id === checkbox.value);
            if (option) {
                optionsHTML += `
                    <div class="selected-option">
                        <span class="option-name">${option.name}</span>
                        <span class="option-price">${option.price}</span>
                    </div>
                `;
                
                // Simple price calculation (ambil harga terendah)
                const priceMatch = option.price.match(/(\d+\.?\d*)/g);
                if (priceMatch && priceMatch.length > 0) {
                    const minPrice = parseInt(priceMatch[0].replace('.', ''));
                    totalPrice += minPrice;
                }
            }
        });
        
        selectedOptionsList.innerHTML = optionsHTML;
        totalPriceElement.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
        
        // Update button text dengan jumlah selected
        bookingBtn.innerHTML = `📅 Lanjut ke Booking (${selectedCheckboxes.length})`;
        
    } else {
        selectionSummary.style.display = 'none';
        bookingBtn.innerHTML = `📅 Lanjut ke Booking`;
    }
}

function proceedToBooking(serviceId) {
    const selectedCheckboxes = document.querySelectorAll('input[name="service-option"]:checked');
    const selectedOptions = [];
    
    selectedCheckboxes.forEach(checkbox => {
        const option = serviceDetails[serviceId].options.find(opt => opt.id === checkbox.value);
        if (option) {
            selectedOptions.push({
                id: option.id,
                name: option.name,
                price: option.price
            });
        }
    });
    
    localStorage.setItem('selectedService', JSON.stringify({
        serviceId: serviceId,
        serviceName: serviceDetails[serviceId].title,
        selectedOptions: selectedOptions,
        type: 'checkbox'
    }));
    
    showBookingForm();
}

// ===== BOOKING FORM FUNCTIONS =====
function showBookingForm() {
    const selectedData = JSON.parse(localStorage.getItem('selectedService') || '{}');
    
    const timeOptions = generateTimeOptions();
    const today = new Date().toISOString().split('T')[0];
    
    const servicesHTML = selectedData.selectedOptions ? selectedData.selectedOptions.map(option => `
        <div class="service-summary-item">
            <div>
                <strong>${option.name}</strong>
            </div>
            <span class="service-price">${option.price}</span>
        </div>
    `).join('') : '<p>Tidak ada layanan yang dipilih</p>';

    const content = `
        <div class="booking-form-modal">
            <div class="booking-header">
                <h2>📋 Formulir Booking Perawatan</h2>
                <p class="form-description">Lengkapi data diri Anda untuk melanjutkan booking</p>
            </div>
            
            <div class="selected-services-summary">
                <h4>🛍️ Layanan yang Dipilih:</h4>
                ${servicesHTML}
            </div>
            
            <form id="patientBookingForm" class="booking-form">
                <div class="form-section">
                    <h4>👤 Data Diri Pasien</h4>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="patientName">Nama Lengkap *</label>
                            <input type="text" id="patientName" name="patientName" required 
                                   placeholder="Masukkan nama lengkap">
                        </div>
                        <div class="form-group">
                            <label for="patientPhone">Nomor Telepon *</label>
                            <input type="tel" id="patientPhone" name="patientPhone" required 
                                   placeholder="Contoh: 081234567890">
                        </div>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="patientAddress">Alamat Lengkap *</label>
                        <textarea id="patientAddress" name="patientAddress" rows="4" required 
                                  placeholder="Masukkan alamat lengkap (jalan, RT/RW, kelurahan, kecamatan, kota)"></textarea>
                    </div>
                </div>
                
                <div class="form-section">
                    <h4>📅 Jadwal Perawatan</h4>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="appointmentDate">Tanggal Perawatan *</label>
                            <input type="date" id="appointmentDate" name="appointmentDate" 
                                   min="${today}" required>
                            <small class="date-note">Pilih tanggal mulai hari ini</small>
                        </div>
                        <div class="form-group">
                            <label for="appointmentTime">Jam Perawatan *</label>
                            <select id="appointmentTime" name="appointmentTime" required>
                                <option value="">Pilih Jam</option>
                                ${timeOptions}
                            </select>
                            <small class="time-note">Jam praktik: 08:00 - 17:00</small>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h4>📝 Informasi Tambahan</h4>
                    <div class="form-group full-width">
                        <label for="patientNotes">Catatan Tambahan (opsional)</label>
                        <textarea id="patientNotes" name="patientNotes" rows="4" 
                                  placeholder="Keluhan khusus, alergi, riwayat penyakit, atau informasi lain yang perlu kami ketahui..."></textarea>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="cta-button secondary" onclick="goBackToServiceSelection()">
                        ← Kembali ke Pilihan Layanan
                    </button>
                    <button type="submit" class="cta-button">
                        📅 Konfirmasi Booking
                    </button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('serviceModalContent').innerHTML = content;
    modalManager.openModal('serviceModal');

    setDefaultAppointmentDate();
    setupFormValidation();
    
    document.getElementById('patientBookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitBookingForm();
    });
}

function generateTimeOptions() {
    let options = '';
    // Generate time slots from 08:00 to 17:00 every 30 minutes
    for (let hour = 8; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            if (hour === 17 && minute > 0) break; // Stop at 17:00
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            options += `<option value="${time}">${time}</option>`;
        }
    }
    return options;
}

function setDefaultAppointmentDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.value = tomorrowFormatted;
    }
}

function setupFormValidation() {
    const phoneInput = document.getElementById('patientPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            if (this.value.length < 10 || this.value.length > 13) {
                this.setCustomValidity('Nomor telepon harus 10-13 digit');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.addEventListener('change', function(e) {
            const selectedDate = new Date(this.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                this.setCustomValidity('Tidak bisa memilih tanggal yang sudah lewat');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // Real-time validation feedback
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() !== '' && this.checkValidity()) {
                this.style.borderColor = '#4CAF50';
            } else if (this.checkValidity() === false) {
                this.style.borderColor = '#ff6b6b';
            }
        });
    });
}

function goBackToServiceSelection() {
    const selectedData = JSON.parse(localStorage.getItem('selectedService') || '{}');
    if (selectedData.serviceId) {
        showServiceDetail(selectedData.serviceId);
    } else {
        modalManager.closeAll();
    }
}

function submitBookingForm() {
    const formData = new FormData(document.getElementById('patientBookingForm'));
    const selectedData = JSON.parse(localStorage.getItem('selectedService') || '{}');
    
    if (!validateBookingForm(formData)) {
        return;
    }
    
    const bookingData = {
        bookingId: 'BK' + Date.now(),
        patientInfo: {
            name: formData.get('patientName'),
            phone: formData.get('patientPhone'),
            address: formData.get('patientAddress'),
            notes: formData.get('patientNotes') || 'Tidak ada catatan'
        },
        appointmentInfo: {
            date: formData.get('appointmentDate'),
            time: formData.get('appointmentTime'),
            datetime: new Date(formData.get('appointmentDate') + 'T' + formData.get('appointmentTime'))
        },
        serviceInfo: selectedData,
        status: 'pending',
        bookingDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    
    if (saveBookingToStorage(bookingData)) {
        showBookingConfirmation(bookingData);
        localStorage.removeItem('selectedService');
    }
}

function validateBookingForm(formData) {
    const name = formData.get('patientName');
    const phone = formData.get('patientPhone');
    const address = formData.get('patientAddress');
    const date = formData.get('appointmentDate');
    const time = formData.get('appointmentTime');
    
    if (!name || !phone || !address || !date || !time) {
        showNotification('Harap lengkapi semua field yang wajib diisi', 'error');
        return false;
    }
    
    const nameWords = name.trim().split(/\s+/);
    if (nameWords.length < 2) {
        showNotification('Harap masukkan nama lengkap (minimal 2 kata)', 'error');
        return false;
    }
    
    if (phone.length < 10 || phone.length > 13) {
        showNotification('Nomor telepon harus 10-13 digit', 'error');
        return false;
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Tidak bisa memilih tanggal yang sudah lewat', 'error');
        return false;
    }
    
    return true;
}

// ===== DATA MANAGEMENT =====
function saveBookingToStorage(bookingData) {
    try {
        // Simpan ke localStorage (sementara)
        const existingBookings = JSON.parse(localStorage.getItem('klinikBookings') || '[]');
        
        const isDuplicate = existingBookings.some(booking => 
            booking.patientInfo.phone === bookingData.patientInfo.phone &&
            booking.serviceInfo.serviceId === bookingData.serviceInfo.serviceId &&
            booking.appointmentInfo.date === bookingData.appointmentInfo.date
        );
        
        if (isDuplicate) {
            showNotification('Anda sudah memiliki booking untuk layanan ini di tanggal yang sama', 'warning');
            return false;
        }
        
        existingBookings.push(bookingData);
        localStorage.setItem('klinikBookings', JSON.stringify(existingBookings));
        
        showNotification('🎉 Booking berhasil disimpan! Kami akan menghubungi Anda dalam 1x24 jam.', 'success');
        return true;
        
    } catch (error) {
        console.error('Error saving booking:', error);
        showNotification('❌ Terjadi error saat menyimpan booking', 'error');
        return false;
    }
}

function showBookingConfirmation(bookingData) {
    const appointmentDate = new Date(bookingData.appointmentInfo.datetime);
    const formattedDate = appointmentDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const servicesHTML = bookingData.serviceInfo.selectedOptions ? bookingData.serviceInfo.selectedOptions.map(option => `
        <div class="detail-item">
            <span><strong>${option.name}</strong></span>
            <span>${option.price}</span>
        </div>
    `).join('') : '';
    
    const content = `
        <div class="confirmation-modal">
            <div class="confirmation-icon">✅</div>
            <h2>Booking Berhasil!</h2>
            
            <div class="confirmation-details">
                <div class="detail-item">
                    <strong>Nomor Booking:</strong>
                    <span>${bookingData.bookingId}</span>
                </div>
                <div class="detail-item">
                    <strong>Nama Pasien:</strong>
                    <span>${bookingData.patientInfo.name}</span>
                </div>
                <div class="detail-item">
                    <strong>Telepon:</strong>
                    <span>${bookingData.patientInfo.phone}</span>
                </div>
                <div class="detail-item">
                    <strong>Layanan:</strong>
                    <span>${bookingData.serviceInfo.serviceName}</span>
                </div>
                ${servicesHTML}
                <div class="detail-item">
                    <strong>Tanggal & Jam:</strong>
                    <span>${formattedDate}, ${bookingData.appointmentInfo.time}</span>
                </div>
                <div class="detail-item">
                    <strong>Status:</strong>
                    <span class="status-pending">Menunggu Konfirmasi</span>
                </div>
            </div>
            
            <div class="confirmation-message">
                <p>📞 <strong>Konfirmasi Booking:</strong> Kami akan menghubungi Anda di <strong>${bookingData.patientInfo.phone}</strong> 
                   dalam 1x24 jam untuk konfirmasi jadwal.</p>
                <p>📍 <strong>Ketentuan:</strong> Pastikan Anda datang 15 menit sebelum jadwal perawatan.</p>
                <p>💳 <strong>Pembayaran:</strong> Siapkan pembayaran sesuai dengan layanan yang dipilih.</p>
                <p>📝 <strong>Catatan:</strong> ${bookingData.patientInfo.notes}</p>
            </div>
            
            <div class="confirmation-actions">
                <button class="cta-button secondary" onclick="printBookingDetails('${bookingData.bookingId}')">
                    🖨️ Cetak Detail Booking
                </button>
                <button class="cta-button" onclick="modalManager.closeAll(); showNotification('Terima kasih telah membooking layanan kami!', 'success')">
                    👍 Tutup & Selesai
                </button>
            </div>
        </div>
    `;

    document.getElementById('serviceModalContent').innerHTML = content;
}

function printBookingDetails(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('klinikBookings') || '[]');
    const booking = bookings.find(b => b.bookingId === bookingId);
    
    if (booking) {
        const printWindow = window.open('', '_blank');
        const servicesHTML = booking.serviceInfo.selectedOptions ? booking.serviceInfo.selectedOptions.map(option => `
            <div style="background: #f9f9f9; padding: 12px; margin: 8px 0; border-radius: 8px; border-left: 4px solid #3aaff3;">
                <div style="font-weight: bold; font-size: 14px;">${option.name}</div>
                <div style="color: #666; font-size: 13px;">${option.price}</div>
            </div>
        `).join('') : '';
        
        const printContent = `
            <html>
                <head>
                    <title>Booking Confirmation - ${booking.bookingId}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 30px; line-height: 1.6; color: #333; }
                        .header { text-align: center; border-bottom: 4px solid #3aaff3; padding-bottom: 20px; margin-bottom: 30px; }
                        .details { margin: 30px 0; }
                        .detail-item { margin: 15px 0; padding: 12px 0; border-bottom: 2px solid #eee; display: flex; justify-content: space-between; font-size: 14px; }
                        .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; padding-top: 20px; border-top: 2px solid #ddd; }
                        .status { background: #fff3e0; color: #ff9800; padding: 6px 15px; border-radius: 25px; font-weight: bold; font-size: 12px; border: 2px solid #ff9800; }
                        @media print { 
                            body { margin: 20px; }
                            .header { border-bottom-color: #000; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 style="margin: 0; color: #3aaff3; font-size: 28px;">Klinik Sehat</h1>
                        <h2 style="margin: 10px 0; color: #333; font-size: 22px;">Konfirmasi Booking</h2>
                        <p style="margin: 0; color: #666; font-size: 16px;">Kesehatan & Kecantikan Profesional</p>
                    </div>
                    <div class="details">
                        <div class="detail-item"><strong>Nomor Booking:</strong> <span>${booking.bookingId}</span></div>
                        <div class="detail-item"><strong>Nama Pasien:</strong> <span>${booking.patientInfo.name}</span></div>
                        <div class="detail-item"><strong>Telepon:</strong> <span>${booking.patientInfo.phone}</span></div>
                        <div class="detail-item"><strong>Alamat:</strong> <span>${booking.patientInfo.address}</span></div>
                        <div class="detail-item"><strong>Tanggal:</strong> <span>${booking.appointmentInfo.date}</span></div>
                        <div class="detail-item"><strong>Jam:</strong> <span>${booking.appointmentInfo.time}</span></div>
                        <div class="detail-item">
                            <strong>Layanan:</strong> 
                            <span>${booking.serviceInfo.serviceName}</span>
                        </div>
                        ${servicesHTML}
                        <div class="detail-item"><strong>Catatan:</strong> <span>${booking.patientInfo.notes}</span></div>
                        <div class="detail-item"><strong>Status:</strong> <span class="status">Menunggu Konfirmasi</span></div>
                    </div>
                    <div class="footer">
                        <p style="font-weight: bold; font-size: 14px;">Harap datang 15 menit sebelum jadwal perawatan</p>
                        <p>Bawa bukti booking ini saat datang ke klinik</p>
                        <p>Terima kasih atas kepercayaan Anda kepada Klinik Sehat</p>
                        <p>Jl. Purnama No. 16, Pontianak • 0813-8122-3811</p>
                        <p>www.kliniksehat.com • info@kliniksehat.com</p>
                    </div>
                </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }
}

// ===== SERVICE CARD IMAGE INITIALIZATION =====
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const img = card.querySelector('.service-image-container img');
        if (img) {
            detectImageOrientation(img.src, (orientation) => {
                const container = img.parentElement;
                const containerClass = getImageContainerClass(orientation);
                
                // Hapus class ratio lama jika ada
                container.classList.remove('ratio-1-1', 'ratio-16-9', 'ratio-9-16');
                
                // Tambah class untuk natural ratio
                container.classList.add('natural-ratio', containerClass);
            });
        }
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        
        if (type === 'error') {
            notification.style.borderLeftColor = '#ff6b6b';
            notification.style.background = '#ffeaea';
        } else if (type === 'success') {
            notification.style.borderLeftColor = '#4CAF50';
            notification.style.background = '#f0f9f0';
        } else if (type === 'warning') {
            notification.style.borderLeftColor = '#ff9800';
            notification.style.background = '#fff3e0';
        } else {
            notification.style.borderLeftColor = '#2c7873';
            notification.style.background = '#f0f9f0';
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
}

// ===== NAVIGATION FUNCTIONS =====
function scrollToServices() {
    document.getElementById('services').scrollIntoView({
        behavior: 'smooth'
    });
}

function showBookingModal() {
    const selectedData = JSON.parse(localStorage.getItem('selectedService') || '{}');
    if (selectedData.serviceId) {
        showBookingForm();
    } else {
        showNotification('Silakan pilih layanan terlebih dahulu', 'warning');
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll untuk anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#admin' || href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('serviceModal');
        if (event.target === modal) {
            modalManager.closeAll();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modalManager.closeAll();
        }
    });

    // Initialize service card images
    initializeServiceCards();

    console.log('Klinik Sehat Public Website initialized successfully!');
});