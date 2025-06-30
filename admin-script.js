// ========================================
// LANCE YURI KIDS SPOT - ADMIN DASHBOARD
// Patient Management System
// ========================================

"use strict";

// ========================================
// GLOBAL VARIABLES & CONSTANTS
// ========================================

// Calendar variables
let currentPatientData = {};
let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let calendarViewMonth = new Date().getMonth();
let calendarViewYear = new Date().getFullYear();

// Modal elements (initialized on DOM ready)
let schedulingModal, modalOverlay, closeModal, cancelBtn, confirmBtn;
let currentMonthDisplay, calendarDates, prevMonthBtn, nextMonthBtn;

// Month names
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// ========================================
// PATIENT DATA MANAGEMENT
// ========================================

// Branch filtering
let currentSelectedBranch = 'blumentritt'; // default to main branch

// Enhanced patient data with detailed information
const patientsData = [
    {
        id: 'PT001',
        parentName: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '0917 123 4567',
        childName: 'Sofia',
        childAge: '4 years',
        childBirthday: '2020-03-15',
        guardianRelationship: 'Mother',
        concerns: 'Speech delay and social interaction difficulties',
        service: 'Initial Assessment',
        serviceType: 'assessment',
        bookingDate: 'March 20, 2024',
        scheduledDate: 'March 25, 2024',
        scheduledTime: '10:00 AM',
        status: 'confirmed',
        payment: 'paid',
        paymentAmount: '₱500',
        paymentMethod: 'gcash',
        paymentDate: 'March 20, 2024',
        notes: 'Initial assessment completed - therapy plan to be discussed with doctor',
        branch: 'blumentritt'
    },
    {
        id: 'PT002',
        parentName: 'John Dela Cruz',
        email: 'john.delacruz@email.com',
        phone: '0928 456 7890',
        childName: 'Miguel',
        childAge: '6 years',
        childBirthday: '2018-07-22',
        guardianRelationship: 'Father',
        concerns: 'Behavioral issues at school, difficulty following instructions',
        service: 'Initial Assessment',
        serviceType: 'assessment',
        bookingDate: 'March 22, 2024',
        scheduledDate: null,
        scheduledTime: null,
        status: 'pending',
        payment: 'paid',
        paymentAmount: '₱650',
        paymentMethod: 'bank',
        paymentDate: 'March 22, 2024',
        notes: 'Urgent case - teacher referral, needs assessment first',
        branch: 'blumentritt'
    },
    {
        id: 'PT003',
        parentName: 'Ana Reyes',
        email: 'ana.reyes@email.com',
        phone: '0939 789 0123',
        childName: 'Emma',
        childAge: '3 years',
        childBirthday: '2021-02-15',
        guardianRelationship: 'Mother',
        concerns: 'Speech development concerns, pronunciation issues',
        service: 'Initial Assessment',
        serviceType: 'assessment',
        bookingDate: 'March 21, 2024',
        scheduledDate: 'March 27, 2024',
        scheduledTime: '9:30 AM',
        status: 'confirmed',
        payment: 'paid',
        paymentAmount: '₱420',
        paymentMethod: 'gcash',
        paymentDate: 'March 21, 2024',
        notes: 'Assessment will determine if speech therapy is needed',
        branch: 'delrosario'
    },
    {
        id: 'PT004',
        parentName: 'Carlos Mendez',
        email: 'carlos.mendez@email.com',
        phone: '0905 234 5678',
        childName: 'Luis',
        childAge: '5 years',
        childBirthday: '2019-03-10',
        guardianRelationship: 'Father',
        concerns: 'Developmental delays, motor skills assessment needed',
        service: 'Initial Assessment',
        serviceType: 'assessment',
        bookingDate: 'March 19, 2024',
        scheduledDate: 'March 24, 2024',
        scheduledTime: '2:00 PM',
        status: 'completed',
        payment: 'paid',
        paymentAmount: '₱750',
        paymentMethod: 'bank',
        paymentDate: 'March 19, 2024',
        notes: 'Initial assessment completed - therapy plan to be discussed with doctor',
        branch: 'blumentritt'
    },
    {
        id: 'PT005',
        parentName: 'Lisa Chen',
        email: 'lisa.chen@email.com',
        phone: '0931 567 8901',
        childName: 'Daniel',
        childAge: '7 years',
        childBirthday: '2017-09-30',
        guardianRelationship: 'Mother',
        concerns: 'Behavioral management concerns, assessment requested',
        service: 'Initial Assessment',
        serviceType: 'assessment',
        bookingDate: 'March 23, 2024',
        scheduledDate: null,
        scheduledTime: null,
        status: 'pending',
        payment: 'paid',
        paymentAmount: '₱300',
        paymentMethod: 'gcash',
        paymentDate: 'March 23, 2024',
        notes: 'Both parents will attend assessment session',
        branch: 'delrosario'
    },
    {
        id: 'PT006',
        parentName: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '0945 678 9012',
        childName: 'Maya',
        childAge: '4 years',
        childBirthday: '2020-04-18',
        guardianRelationship: 'Mother',
        concerns: 'Developmental milestone concerns, needs early assessment',
        service: 'Initial Assessment',
        serviceType: 'assessment',
        bookingDate: 'March 23, 2024',
        scheduledDate: null,
        scheduledTime: null,
        status: 'pending',
        payment: 'paid',
        paymentAmount: '₱580',
        paymentMethod: 'bank',
        paymentDate: 'March 23, 2024',
        notes: 'Urgent assessment requested by pediatrician',
        branch: 'delrosario'
    }
];

// Sample scheduled appointments data for calendar
const scheduledAppointments = [
    {
        date: '2024-03-25',
        time: '10:00 AM',
        patient: 'Maria Santos',
        child: 'Sofia',
        service: 'Initial Assessment',
        type: 'assessment'
    },
    {
        date: '2024-03-27',
        time: '9:30 AM',
        patient: 'Emma Rodriguez',
        child: 'Alex',
        service: 'Initial Assessment',
        type: 'assessment'
    },
    {
        date: '2024-03-28',
        time: '2:00 PM',
        patient: 'Robert Kim',
        child: 'Sophia',
        service: 'Initial Assessment',
        type: 'assessment'
    }
];

// ========================================
// CORE PATIENT MANAGEMENT FUNCTIONS
// ========================================

/**
 * Sort patients by booking date (latest first)
 * @param {Array} patients - Array of patient data
 * @returns {Array} Sorted array of patients
 */
function sortPatientsByBookingDate(patients) {
    return patients.sort((a, b) => {
        const dateA = new Date(a.bookingDate);
        const dateB = new Date(b.bookingDate);
        return dateB - dateA; // Latest first
    });
}

// Branch filtering function
function filterByBranch(branchValue) {
    currentSelectedBranch = branchValue;
    
    // Update visual selection
    const branchBoxes = document.querySelectorAll('.admin-branch-box');
    branchBoxes.forEach(box => {
        const input = box.querySelector('input[type="radio"]');
        if (input.value === branchValue) {
            input.checked = true;
            box.classList.add('selected');
        } else {
            input.checked = false;
            box.classList.remove('selected');
        }
    });
    
    // Update counts
    updateBranchCounts();
    
    // Refresh all patient views
    populatePatientTables();
    
    // Clear search results when switching branches
    const searchResults = document.getElementById('patientSearchResults');
    if (searchResults) {
        searchResults.style.display = 'none';
        searchResults.innerHTML = '';
    }
    
    showNotification(`Switched to ${branchValue === 'blumentritt' ? 'Main Branch (Blumentritt)' : 'Satellite Branch (Del Rosario)'}`, 'success');
}

// Update branch-specific counts
function updateBranchCounts() {
    const branchPatients = patientsData.filter(patient => patient.branch === currentSelectedBranch);
    
    const pendingCount = branchPatients.filter(patient => patient.status === 'pending').length;
    const scheduledCount = branchPatients.filter(patient => patient.status === 'confirmed').length;
    const completedCount = branchPatients.filter(patient => patient.status === 'completed').length;
    
    // Update the stats numbers
    const branchPendingCountEl = document.getElementById('branchPendingCount');
    const branchScheduledCountEl = document.getElementById('branchScheduledCount');
    
    if (branchPendingCountEl) branchPendingCountEl.textContent = pendingCount;
    if (branchScheduledCountEl) branchScheduledCountEl.textContent = scheduledCount;
    
    // Update the main action button counts as well
    const pendingCountEl = document.getElementById('pendingCount');
    const scheduledCountEl = document.getElementById('scheduledCount');
    const completedCountEl = document.getElementById('completedCount');
    
    if (pendingCountEl) pendingCountEl.textContent = pendingCount;
    if (scheduledCountEl) scheduledCountEl.textContent = scheduledCount;
    if (completedCountEl) completedCountEl.textContent = completedCount;
}

/**
 * Generate patient table rows based on view type
 * @param {string} viewType - Type of view ('pending', 'scheduled', 'completed')
 * @returns {string} HTML string for table rows
 */
function generatePatientTableRows(viewType) {
    // Filter patients based on branch first
    let branchPatients = patientsData.filter(patient => patient.branch === currentSelectedBranch);
    
    // Then filter by view type
    let filteredPatients = [];
    
    switch (viewType) {
        case 'pending':
            filteredPatients = branchPatients.filter(p => p.status === 'pending');
            break;
        case 'scheduled':
            filteredPatients = branchPatients.filter(p => p.status === 'confirmed');
            break;
        case 'completed':
            filteredPatients = branchPatients.filter(p => p.status === 'completed');
            break;
        default:
            filteredPatients = branchPatients;
    }
    
    // Sort by booking date (latest first)
    const sortedPatients = sortPatientsByBookingDate([...filteredPatients]);
    
    // Generate HTML for each patient
    return sortedPatients.map(patient => {
        const paymentMethodDisplay = patient.paymentMethod === 'gcash' ? 'GCash' : 'Bank';
        
        if (viewType === 'pending') {
            return `
                <tr data-patient-id="${patient.id}">
                    <td class="col-patient">
                        <div class="patient-card">
                            <div class="patient-id">#${patient.id}</div>
                            <div class="patient-info">
                                <strong>${patient.parentName}</strong>
                                <small>👶 ${patient.childName}, ${patient.childAge}</small>
                            </div>
                        </div>
                    </td>
                    <td class="col-contact">
                        <div class="contact-info">
                            <div class="phone">📞 ${patient.phone}</div>
                            <span class="service-badge assessment">${patient.service}</span>
                        </div>
                    </td>
                    <td class="col-status">
                        <div class="status-payment">
                            <span class="status-badge pending">⏳ Pending Schedule</span>
                            <div class="payment-info">
                                <span class="payment-amount">💰 ${patient.paymentAmount}</span>
                                <span class="payment-method">Paid thru ${paymentMethodDisplay}</span>
                                <span class="payment-date">📅 ${patient.paymentDate}</span>
                            </div>
                        </div>
                    </td>
                    <td class="col-actions">
                        <div class="action-buttons">
                            <button class="btn-action view" title="View Details" onclick="viewPatientDetails('${patient.id}', '${patient.parentName}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-action schedule" title="Schedule" onclick="schedulePatient('${patient.id}')">
                                <i class="fas fa-calendar-plus"></i>
                            </button>
                            <button class="btn-action contact" title="Contact" onclick="contactPatient('${patient.id}', '${patient.parentName}')">
                                <i class="fas fa-phone"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        } else if (viewType === 'scheduled') {
            const appointmentDate = patient.scheduledDate ? 
                `📅 ${new Date(patient.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${patient.scheduledTime}` :
                '📅 To be scheduled';
            
            return `
                <tr data-patient-id="${patient.id}">
                    <td class="col-patient">
                        <div class="patient-card">
                            <div class="patient-id">#${patient.id}</div>
                            <div class="patient-info">
                                <strong>${patient.parentName}</strong>
                                <small>👶 ${patient.childName}, ${patient.childAge}</small>
                            </div>
                        </div>
                    </td>
                    <td class="col-contact">
                        <div class="contact-info">
                            <div class="phone">📞 ${patient.phone}</div>
                            <span class="service-badge assessment">${patient.service}</span>
                        </div>
                    </td>
                    <td class="col-appointment">
                        <div class="appointment-info">
                            <div class="appointment-date">${appointmentDate}</div>
                            <div class="payment-info">
                                <span class="payment-amount">💰 ${patient.paymentAmount}</span>
                                <span class="payment-method">Paid thru ${paymentMethodDisplay}</span>
                                <span class="payment-date">📅 ${patient.paymentDate}</span>
                            </div>
                        </div>
                    </td>
                    <td class="col-actions">
                        <div class="action-buttons">
                            <button class="btn-action view" title="View Details" onclick="viewPatientDetails('${patient.id}', '${patient.parentName}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-action edit" title="Reschedule" onclick="schedulePatient('${patient.id}')">
                                <i class="fas fa-calendar-alt"></i>
                            </button>
                            <button class="btn-action contact" title="Contact" onclick="contactPatient('${patient.id}', '${patient.parentName}')">
                                <i class="fas fa-phone"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        } else if (viewType === 'completed') {
            const completionDate = patient.scheduledDate ? 
                new Date(patient.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) :
                'Unknown';
            
            return `
                <tr data-patient-id="${patient.id}">
                    <td class="col-patient">
                        <div class="patient-card">
                            <div class="patient-id">#${patient.id}</div>
                            <div class="patient-info">
                                <strong>${patient.parentName}</strong>
                                <small>👶 ${patient.childName}, ${patient.childAge}</small>
                            </div>
                        </div>
                    </td>
                    <td class="col-contact">
                        <div class="contact-info">
                            <div class="phone">📞 ${patient.phone}</div>
                            <span class="service-badge assessment">${patient.service}</span>
                        </div>
                    </td>
                    <td class="col-completion">
                        <div class="completion-info">
                            <div class="completion-date">✅ Completed: ${completionDate}</div>
                            <div class="payment-info">
                                <span class="payment-amount">💰 ${patient.paymentAmount}</span>
                                <span class="payment-method">Paid thru ${paymentMethodDisplay}</span>
                                <span class="payment-date">📅 ${patient.paymentDate}</span>
                            </div>
                        </div>
                    </td>
                    <td class="col-actions">
                        <div class="action-buttons">
                            <button class="btn-action view" title="View Details" onclick="viewPatientDetails('${patient.id}', '${patient.parentName}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-action report" title="View Report">
                                <i class="fas fa-file-medical"></i>
                            </button>
                            <button class="btn-action contact" title="Contact" onclick="contactPatient('${patient.id}', '${patient.parentName}')">
                                <i class="fas fa-phone"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }).join('');
}

/**
 * Populate patient tables with sorted data
 */
function populatePatientTables() {
    // Populate pending patients table
    const pendingTableBody = document.querySelector('#pending-view .patients-table tbody');
    if (pendingTableBody) {
        pendingTableBody.innerHTML = generatePatientTableRows('pending');
    }
    
    // Populate scheduled patients table
    const scheduledTableBody = document.querySelector('#scheduled-view .patients-table tbody');
    if (scheduledTableBody) {
        scheduledTableBody.innerHTML = generatePatientTableRows('scheduled');
    }
    
    // Populate completed patients table
    const completedTableBody = document.querySelector('#completed-view .patients-table tbody');
    if (completedTableBody) {
        completedTableBody.innerHTML = generatePatientTableRows('completed');
    }
}

/**
 * Schedule a patient appointment
 * @param {string} patientId - Patient ID
 */
function schedulePatient(patientId) {
    console.log('Scheduling patient:', patientId);
    
    // Find the patient row
    const row = document.querySelector(`[data-patient-id="${patientId}"]`);
    if (!row) {
        console.error('Patient row not found');
        return;
    }
    
    // Get patient data from the row
    const patientName = row.querySelector('.patient-info strong').textContent;
    const childInfo = row.querySelector('.patient-info small').textContent;
    const service = row.querySelector('.service-badge').textContent;
    const bookingDateElement = row.querySelector('.booking-date');
    const bookingDate = bookingDateElement ? bookingDateElement.textContent : 'Unknown date';
    
    const patientData = {
        patientId,
        parentName: patientName,
        childInfo,
        service,
        bookingDate,
        rowElement: row
    };
    
    console.log('Patient data:', patientData);
    openSchedulingModal(patientData);
}

/**
 * View detailed patient information
 * @param {string} patientId - Patient ID
 * @param {string} patientName - Patient name
 */
function viewPatientDetails(patientId, patientName) {
    console.log('Opening patient details for:', patientId);
    
    // Find patient data
    const patient = patientsData.find(p => p.id === patientId);
    
    if (!patient) {
        showNotification(`Patient data not found for ${patientId}`, 'error');
        return;
    }
    
    // Populate the modal with patient data
    populatePatientDetailsModal(patient);
    
    // Store current patient ID for action buttons
    window.currentPatientDetails = patient;
    
    // Show the modal
    showPatientDetailsModal();
    
    showNotification(`Viewing details for ${patient.parentName}`, 'info');
}

/**
 * Contact a patient
 * @param {string} patientId - Patient ID
 * @param {string} patientName - Patient name
 */
function contactPatient(patientId, patientName) {
    const patient = patientsData.find(p => p.id === patientId);
    if (patient) {
        showNotification(`Contact options for ${patientName}:
        📧 ${patient.email}
        📱 ${patient.phone}`, 'info');
    } else {
        showNotification(`Initiating contact with ${patientName} (${patientId})`, 'success');
    }
}

/**
 * Edit/Reschedule patient appointment
 * @param {string} patientId - Patient ID
 * @param {string} patientName - Patient name
 * @param {HTMLElement} rowElement - Table row element
 */
function editPatient(patientId, patientName, rowElement) {
    const row = rowElement;
    const childInfo = row.querySelector('.patient-info small').textContent;
    const service = row.querySelector('.service-badge').textContent;
    const bookingDate = row.children[4].textContent; // Booking Date column
    
    const patientData = {
        patientId,
        parentName: patientName,
        childInfo,
        service,
        bookingDate,
        rowElement: row
    };
    
    openSchedulingModal(patientData);
}

// ========================================
// SEARCH AND FILTER FUNCTIONALITY
// ========================================

/**
 * Search patient details with comprehensive filtering
 */
function searchPatientDetails() {
    const searchInput = document.getElementById('patientDetailSearch');
    const searchTerm = searchInput.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('patientSearchResults');
    
    if (!searchTerm) {
        showNotification('Please enter a patient ID or name to search', 'info');
        return;
    }
    
    // Filter by branch first, then search
    const branchPatients = patientsData.filter(patient => patient.branch === currentSelectedBranch);
    
    // Search through branch-specific patient data
    const results = branchPatients.filter(patient => {
        return patient.id.toLowerCase().includes(searchTerm) ||
               patient.parentName.toLowerCase().includes(searchTerm) ||
               patient.childName.toLowerCase().includes(searchTerm) ||
               patient.email.toLowerCase().includes(searchTerm) ||
               patient.phone.includes(searchTerm);
    });
    
    // Sort search results by booking date (latest first)
    const sortedResults = sortPatientsByBookingDate([...results]);
    
    displaySearchResults(sortedResults, searchTerm);
}

/**
 * Display search results in the UI
 * @param {Array} results - Array of patient objects
 * @param {string} searchTerm - Search term used
 */
function displaySearchResults(results, searchTerm) {
    const resultsContainer = document.getElementById('patientSearchResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-user-slash"></i>
                <h3>No patients found</h3>
                <p>No patients match "${searchTerm}". Try searching with different keywords.</p>
            </div>
        `;
        resultsContainer.style.display = 'block';
        return;
    }
    
    const resultsHTML = results.map(patient => createPatientDetailCard(patient)).join('');
    resultsContainer.innerHTML = `
        <div class="search-results-header">
            <h3><i class="fas fa-search"></i> Search Results (${results.length} found)</h3>
            <p>Found ${results.length} patient${results.length > 1 ? 's' : ''} matching "${searchTerm}"</p>
        </div>
        ${resultsHTML}
    `;
    resultsContainer.style.display = 'block';
    
    showNotification(`Found ${results.length} patient${results.length > 1 ? 's' : ''} matching your search`, 'success');
}

/**
 * Filter patients in the main table
 */
function filterPatients() {
    const searchInput = document.querySelector('.search-box input');
    const serviceFilter = document.querySelector('.filter-select');
    const statusFilter = document.querySelectorAll('.filter-select')[1];
    const dateFilter = document.querySelector('.filter-date');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedService = serviceFilter ? serviceFilter.value : '';
    const selectedStatus = statusFilter ? statusFilter.value : '';
    const selectedDate = dateFilter ? dateFilter.value : '';
    
    const tableRows = document.querySelectorAll('.patients-table tbody tr');
    
    tableRows.forEach(row => {
        const patientName = row.querySelector('.patient-info strong').textContent.toLowerCase();
        const patientId = row.cells[0].textContent.toLowerCase();
        const service = row.querySelector('.service-badge').textContent;
        const status = row.querySelector('.status-badge').classList[1];
        
        let showRow = true;
        
        // Search filter
        if (searchTerm && !patientName.includes(searchTerm) && !patientId.includes(searchTerm)) {
            showRow = false;
        }
        
        // Service filter
        if (selectedService && !service.toLowerCase().includes(selectedService.replace('-', ' '))) {
            showRow = false;
        }
        
        // Status filter
        if (selectedStatus && status !== selectedStatus) {
            showRow = false;
        }
        
        row.style.display = showRow ? '' : 'none';
    });
    
    updateResultsCount();
}

/**
 * Update the results count display
 */
function updateResultsCount() {
    const visibleRows = document.querySelectorAll('.patients-table tbody tr:not([style*="display: none"])');
    const pageInfo = document.querySelector('.page-info');
    if (pageInfo) {
        pageInfo.textContent = `Showing ${visibleRows.length} of ${document.querySelectorAll('.patients-table tbody tr').length} patients`;
    }
}

// ========================================
// MODAL MANAGEMENT FUNCTIONS
// ========================================

/**
 * Open the scheduling modal
 * @param {Object} patientData - Patient data object
 */
function openSchedulingModal(patientData) {
    currentPatientData = patientData || window.currentPatientData;
    
    if (!currentPatientData) {
        console.error('No patient data available');
        return;
    }
    
    // Initialize modal elements if not already done
    initializeModalElements();
    
    // Populate patient information
    populateSchedulingModal();
    
    // Reset selections
    selectedDate = null;
    selectedTime = null;
    updateScheduleDisplay();
    updateConfirmButton();
    
    // Generate calendar with a small delay to ensure elements are ready
    setTimeout(() => {
        generateCalendar();
    }, 50);
    
    // Show modal
    showModal(schedulingModal, modalOverlay);
}

/**
 * Close the scheduling modal
 */
function closeSchedulingModal() {
    hideModal(schedulingModal, modalOverlay);
    
    // Clear form
    const appointmentNotes = document.getElementById('appointmentNotes');
    if (appointmentNotes) {
        appointmentNotes.value = '';
    }
    clearTimeSelection();
    clearDateSelection();
}

/**
 * Show patient details modal
 */
function showPatientDetailsModal() {
    const modal = document.getElementById('patientDetailsModal');
    const overlay = document.getElementById('modalOverlay');
    showModal(modal, overlay);
}

/**
 * Close patient details modal
 */
function closePatientDetailsModal() {
    const modal = document.getElementById('patientDetailsModal');
    const overlay = document.getElementById('modalOverlay');
    hideModal(modal, overlay);
    window.currentPatientDetails = null;
}

/**
 * Generic function to show modal
 * @param {HTMLElement} modal - Modal element
 * @param {HTMLElement} overlay - Overlay element
 */
function showModal(modal, overlay) {
    if (modal && overlay) {
        overlay.classList.add('active');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Generic function to hide modal
 * @param {HTMLElement} modal - Modal element
 * @param {HTMLElement} overlay - Overlay element
 */
function hideModal(modal, overlay) {
    if (overlay) {
        overlay.classList.remove('active');
    }
    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = 'auto';
}

// ========================================
// CALENDAR FUNCTIONALITY
// ========================================

/**
 * Generate the appointment scheduling calendar
 */
function generateCalendar() {
    // Check if required elements exist
    if (!currentMonthDisplay || !calendarDates) {
        console.log('Calendar elements not ready yet');
        return;
    }
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const prevLastDay = new Date(currentYear, currentMonth, 0);
    
    const startDate = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevLastDay.getDate();
    
    // Update month display
    currentMonthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear previous dates
    calendarDates.innerHTML = '';
    
    // Generate calendar dates
    generatePreviousMonthDates(startDate, daysInPrevMonth);
    generateCurrentMonthDates(daysInMonth);
    generateNextMonthDates(startDate, daysInMonth);
}

/**
 * Generate calendar view for the main dashboard
 */
function generateCalendarView() {
    const calendarCurrentMonth = document.getElementById('calendarCurrentMonth');
    const calendarViewDates = document.getElementById('calendarViewDates');
    
    if (!calendarCurrentMonth || !calendarViewDates) {
        console.log('Calendar view elements not ready');
        return;
    }
    
    const firstDay = new Date(calendarViewYear, calendarViewMonth, 1);
    const lastDay = new Date(calendarViewYear, calendarViewMonth + 1, 0);
    const prevLastDay = new Date(calendarViewYear, calendarViewMonth, 0);
    
    const startDate = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevLastDay.getDate();
    
    // Update month display
    calendarCurrentMonth.textContent = `${monthNames[calendarViewMonth]} ${calendarViewYear}`;
    
    // Clear previous dates
    calendarViewDates.innerHTML = '';
    
    // Generate calendar view dates
    generateCalendarViewDates(startDate, daysInPrevMonth, daysInMonth);
}

/**
 * Generate the appointment calendar for calendar view
 */
function generateAppointmentCalendar() {
    const calendarViewDates = document.getElementById('calendarViewDates');
    const currentMonthDisplay = document.getElementById('calendarCurrentMonth');
    
    if (!calendarViewDates || !currentMonthDisplay) return;
    
    // Clear existing dates
    calendarViewDates.innerHTML = '';
    
    // Update month display
    currentMonthDisplay.textContent = `${monthNames[calendarViewMonth]} ${calendarViewYear}`;
    
    // Calculate calendar dates
    const firstDay = new Date(calendarViewYear, calendarViewMonth, 1);
    const lastDay = new Date(calendarViewYear, calendarViewMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();
    const daysInPrevMonth = new Date(calendarViewYear, calendarViewMonth, 0).getDate();
    
    // Generate calendar dates with appointments
    generateAppointmentCalendarDates(startDate, daysInPrevMonth, daysInMonth);
}

/**
 * Generate calendar dates with appointment data
 */
function generateAppointmentCalendarDates(startDate, daysInPrevMonth, daysInMonth) {
    const calendarViewDates = document.getElementById('calendarViewDates');
    if (!calendarViewDates) return;
    
    // Previous month dates
    for (let i = startDate - 1; i >= 0; i--) {
        const date = daysInPrevMonth - i;
        const dateElement = createAppointmentCalendarDate(date, 'other-month', new Date(calendarViewYear, calendarViewMonth - 1, date));
        calendarViewDates.appendChild(dateElement);
    }
    
    // Current month dates
    for (let date = 1; date <= daysInMonth; date++) {
        const fullDate = new Date(calendarViewYear, calendarViewMonth, date);
        const dateElement = createAppointmentCalendarDate(date, '', fullDate);
        
        const today = new Date();
        if (fullDate.toDateString() === today.toDateString()) {
            dateElement.classList.add('today');
        }
        
        calendarViewDates.appendChild(dateElement);
    }
    
    // Next month dates
    const totalCells = 42;
    const remainingCells = totalCells - (startDate + daysInMonth);
    for (let date = 1; date <= remainingCells; date++) {
        const dateElement = createAppointmentCalendarDate(date, 'other-month', new Date(calendarViewYear, calendarViewMonth + 1, date));
        calendarViewDates.appendChild(dateElement);
    }
    
    // Initialize calendar interactions
    initializeCalendarInteractions();
}

/**
 * Create calendar date element with appointments
 */
function createAppointmentCalendarDate(date, className, fullDate) {
    const dateElement = document.createElement('div');
    dateElement.className = `calendar-view-date ${className}`;
    dateElement.dataset.date = fullDate.toISOString().split('T')[0];
    
    const dateNumber = document.createElement('div');
    dateNumber.className = 'calendar-date-number';
    dateNumber.textContent = date;
    dateElement.appendChild(dateNumber);
    
    const appointmentsContainer = document.createElement('div');
    appointmentsContainer.className = 'calendar-date-appointments';
    
    // Filter appointments for this date and branch
    const dateString = fullDate.toISOString().split('T')[0];
    const branchPatients = patientsData.filter(patient => patient.branch === currentSelectedBranch);
    const dayAppointments = branchPatients.filter(patient => 
        patient.status === 'confirmed' && 
        patient.scheduledDate && 
        new Date(patient.scheduledDate).toISOString().split('T')[0] === dateString
    );
    
    dayAppointments.forEach(appointment => {
        const appointmentElement = document.createElement('div');
        appointmentElement.className = `calendar-appointment ${appointment.serviceType || 'assessment'}`;
        appointmentElement.innerHTML = `
            <div>${appointment.scheduledTime}</div>
            <div>${appointment.childName}</div>
        `;
        appointmentElement.title = `${appointment.parentName} - ${appointment.service}`;
        appointmentElement.addEventListener('click', (e) => {
            e.stopPropagation();
            viewPatientDetails(appointment.id, appointment.parentName);
        });
        appointmentsContainer.appendChild(appointmentElement);
    });
    
    dateElement.appendChild(appointmentsContainer);
    
    // Add click handler for adding appointments
    if (!className.includes('other-month')) {
        dateElement.addEventListener('click', () => selectCalendarDate(dateElement, fullDate));
    }
    
    return dateElement;
}

/**
 * Initialize calendar interactions
 */
function initializeCalendarInteractions() {
    // Add appointment button
    const addAppointmentBtn = document.getElementById('addAppointmentBtn');
    if (addAppointmentBtn) {
        addAppointmentBtn.addEventListener('click', showQuickAddForm);
    }
    
    // Quick add form handlers
    const closeQuickAdd = document.getElementById('closeQuickAdd');
    const cancelQuickAdd = document.getElementById('cancelQuickAdd');
    const saveQuickAdd = document.getElementById('saveQuickAdd');
    const addToDateBtn = document.getElementById('addToDateBtn');
    
    if (closeQuickAdd) closeQuickAdd.addEventListener('click', hideQuickAddForm);
    if (cancelQuickAdd) cancelQuickAdd.addEventListener('click', hideQuickAddForm);
    if (saveQuickAdd) saveQuickAdd.addEventListener('click', saveQuickAppointment);
    if (addToDateBtn) addToDateBtn.addEventListener('click', showQuickAddForm);
    
    // Setup calendar navigation
    setupCalendarViewNavigation();
}

/**
 * Select a calendar date
 */
function selectCalendarDate(dateElement, fullDate) {
    // Clear previous selection
    document.querySelectorAll('.calendar-view-date.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Select new date
    dateElement.classList.add('selected');
    
    // Show date info
    showSelectedDateInfo(fullDate);
}

/**
 * Show selected date information
 */
function showSelectedDateInfo(fullDate) {
    const selectedDateInfo = document.getElementById('selectedDateInfo');
    const selectedDateTitle = document.getElementById('selectedDateTitle');
    const dateAppointments = document.getElementById('dateAppointments');
    
    if (!selectedDateInfo || !selectedDateTitle || !dateAppointments) return;
    
    // Update date title
    selectedDateTitle.textContent = fullDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Get appointments for this date
    const dateString = fullDate.toISOString().split('T')[0];
    const branchPatients = patientsData.filter(patient => patient.branch === currentSelectedBranch);
    const dayAppointments = branchPatients.filter(patient => 
        patient.status === 'confirmed' && 
        patient.scheduledDate && 
        new Date(patient.scheduledDate).toISOString().split('T')[0] === dateString
    );
    
    // Display appointments
    if (dayAppointments.length > 0) {
        dateAppointments.innerHTML = dayAppointments.map(appointment => `
            <div class="date-appointment-card">
                <div class="appointment-info">
                    <div class="patient-name">${appointment.parentName}</div>
                    <div class="appointment-details">${appointment.childName} • ${appointment.scheduledTime} • ${appointment.service}</div>
                </div>
                <div class="appointment-actions">
                    <button class="appointment-action-btn" onclick="viewPatientDetails('${appointment.id}', '${appointment.parentName}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="appointment-action-btn" onclick="schedulePatient('${appointment.id}')" title="Reschedule">
                        <i class="fas fa-calendar-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        dateAppointments.innerHTML = '<p style="color: #666; text-align: center; padding: 1rem;">No appointments scheduled for this date.</p>';
    }
    
    // Show the info panel
    selectedDateInfo.style.display = 'block';
}

/**
 * Show quick add form
 */
function showQuickAddForm() {
    const quickAddForm = document.getElementById('quickAddForm');
    if (quickAddForm) {
        quickAddForm.style.display = 'block';
        
        // Clear form
        clearQuickAddForm();
        
        // Set default date if a date is selected
        const selectedDate = document.querySelector('.calendar-view-date.selected');
        if (selectedDate) {
            const quickDate = document.getElementById('quickDate');
            if (quickDate) {
                quickDate.value = selectedDate.dataset.date;
            }
        }
    }
}

/**
 * Hide quick add form
 */
function hideQuickAddForm() {
    const quickAddForm = document.getElementById('quickAddForm');
    if (quickAddForm) {
        quickAddForm.style.display = 'none';
    }
}

/**
 * Clear quick add form
 */
function clearQuickAddForm() {
    const form = document.getElementById('quickAddForm');
    if (form) {
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type === 'date') {
                input.value = '';
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
        });
    }
}

/**
 * Save quick appointment
 */
function saveQuickAppointment() {
    // Get form data
    const patientId = document.getElementById('quickPatientId').value.trim();
    const patientName = document.getElementById('quickPatientName').value.trim();
    const childName = document.getElementById('quickChildName').value.trim();
    const childAge = document.getElementById('quickChildAge').value.trim();
    const date = document.getElementById('quickDate').value;
    const time = document.getElementById('quickTime').value;
    const service = document.getElementById('quickService').value;
    
    // Validate form
    if (!patientId || !patientName || !childName || !childAge || !date || !time || !service) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Check if patient ID already exists
    const existingPatient = patientsData.find(p => p.id === patientId);
    if (existingPatient) {
        showNotification(`Patient ID ${patientId} already exists`, 'error');
        return;
    }
    
    // Create new patient record
    const newPatient = {
        id: patientId,
        parentName: patientName,
        email: `${patientName.replace(/\s+/g, '.').toLowerCase()}@email.com`,
        phone: '0900 000 0000',
        childName: childName,
        childAge: childAge,
        childBirthday: calculateBirthdateFromAge(childAge),
        guardianRelationship: 'Guardian',
        concerns: 'To be assessed',
        service: service,
        serviceType: service.toLowerCase().includes('assessment') ? 'assessment' : 'therapy',
        bookingDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        scheduledDate: new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        scheduledTime: time,
        status: 'confirmed',
        payment: 'paid',
        paymentAmount: '₱500',
        paymentMethod: 'gcash',
        paymentDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        notes: 'Added via calendar quick add',
        branch: currentSelectedBranch
    };
    
    // Add to patients data
    patientsData.push(newPatient);
    
    // Update UI
    updateBranchCounts();
    populatePatientTables();
    generateAppointmentCalendar();
    hideQuickAddForm();
    
    showNotification(`Appointment added successfully for ${patientName}`, 'success');
}

/**
 * Calculate birthdate from age string
 */
function calculateBirthdateFromAge(ageString) {
    const today = new Date();
    const ageNumber = parseInt(ageString);
    
    if (ageString.includes('month')) {
        const birthDate = new Date(today.getFullYear(), today.getMonth() - ageNumber, today.getDate());
        return birthDate.toISOString().split('T')[0];
    } else {
        const birthDate = new Date(today.getFullYear() - ageNumber, today.getMonth(), today.getDate());
        return birthDate.toISOString().split('T')[0];
    }
}

// ========================================
// VIEW MANAGEMENT FUNCTIONS
// ========================================

/**
 * Switch between different views (patients, calendar, etc.)
 * @param {string} viewType - Type of view to switch to
 */
function switchView(viewType) {
    console.log('Switching to view:', viewType);
    
    const actionButtons = document.querySelectorAll('.big-action-btn');
    const patientsView = document.getElementById('patients-view');
    const calendarView = document.getElementById('calendar-view');
    
    // Update active button
    updateActiveButton(actionButtons, viewType);
    
    // Switch views with helpful messages
    if (viewType === 'patients') {
        showPatientsView(patientsView, calendarView);
    } else if (viewType === 'calendar') {
        showCalendarView(patientsView, calendarView);
    }
}

/**
 * Switch between patient status views (pending, scheduled, completed)
 * @param {string} view - View type to switch to
 */
function switchPatientView(view) {
    console.log('Switching to patient view:', view);
    
    // Update active button
    document.querySelectorAll('.big-action-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Get view elements
    const pendingView = document.getElementById('pending-view');
    const scheduledView = document.getElementById('scheduled-view');
    const completedView = document.getElementById('completed-view');
    const calendarView = document.getElementById('calendar-view');

    // Hide all views first
    hideAllPatientViews(pendingView, scheduledView, completedView, calendarView);

    // Show selected view
    showSelectedPatientView(view, pendingView, scheduledView, completedView, calendarView);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Calculate age from birth date
 * @param {string} birthDate - Birth date string
 * @returns {string} Formatted age string
 */
function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    if (years === 0) {
        return `${months} month${months > 1 ? 's' : ''} old`;
    } else if (months === 0) {
        return `${years} year${years > 1 ? 's' : ''} old`;
    } else {
        return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''} old`;
    }
}

/**
 * Format date for display
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

/**
 * Format time for display (convert 24h to 12h format)
 * @param {string} time24 - Time in 24-hour format
 * @returns {string} Time in 12-hour format
 */
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    const notification = createNotificationElement(message, type);
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 4000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

/**
 * Scroll to top of page
 */
function scrollToTop() {
    // Smooth scroll to top of page
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Also scroll the table container to top if it exists
    const tableContainer = document.querySelector('.table-wrapper-enhanced');
    if (tableContainer) {
        tableContainer.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    showNotification('Scrolled to top', 'success');
}

/**
 * Switch to notes editing mode
 */
function editNotes() {
    const notesDisplay = document.getElementById('detail-notes-display');
    const notesEdit = document.getElementById('detail-notes-edit');
    const editBtn = document.getElementById('edit-notes-btn');
    const saveBtn = document.getElementById('save-notes-btn');
    const cancelBtn = document.getElementById('cancel-notes-btn');
    
    if (!notesDisplay || !notesEdit || !editBtn || !saveBtn || !cancelBtn) {
        console.error('Notes editing elements not found');
        return;
    }
    
    // Copy current text to edit field if it's empty
    if (!notesEdit.value.trim()) {
        notesEdit.value = notesDisplay.textContent || '';
    }
    
    // Show edit field, hide display
    notesDisplay.style.display = 'none';
    notesEdit.style.display = 'block';
    
    // Show save/cancel buttons, hide edit button
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-flex';
    cancelBtn.style.display = 'inline-flex';
    
    // Focus on the textarea
    notesEdit.focus();
    
    // Add keyboard shortcuts
    notesEdit.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cancelNotesEdit();
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            saveNotes();
        }
    });
    
    showNotification('Notes editing mode activated • Press Ctrl+Enter to save, Esc to cancel', 'info');
}

/**
 * Save the edited notes
 */
function saveNotes() {
    const notesDisplay = document.getElementById('detail-notes-display');
    const notesEdit = document.getElementById('detail-notes-edit');
    const editBtn = document.getElementById('edit-notes-btn');
    const saveBtn = document.getElementById('save-notes-btn');
    const cancelBtn = document.getElementById('cancel-notes-btn');
    
    if (!notesDisplay || !notesEdit || !editBtn || !saveBtn || !cancelBtn) {
        console.error('Notes editing elements not found');
        return;
    }
    
    const newNotes = notesEdit.value.trim();
    
    // Update the patient data
    if (window.currentPatientDetails) {
        const patientId = window.currentPatientDetails.id;
        const patient = patientsData.find(p => p.id === patientId);
        if (patient) {
            patient.notes = newNotes || 'No notes available';
            
            // Update display
            notesDisplay.textContent = patient.notes;
            
            // Update search results if they exist
            updateSearchResultsNotes(patientId, patient.notes);
            
            showNotification(`Notes updated for ${patient.parentName}`, 'success');
        }
    }
    
    // Switch back to display mode
    exitNotesEditMode();
}

/**
 * Cancel notes editing and revert changes
 */
function cancelNotesEdit() {
    const notesDisplay = document.getElementById('detail-notes-display');
    const notesEdit = document.getElementById('detail-notes-edit');
    
    if (notesDisplay && notesEdit) {
        // Revert textarea to original value
        notesEdit.value = notesDisplay.textContent || '';
    }
    
    exitNotesEditMode();
    showNotification('Notes editing cancelled', 'info');
}

/**
 * Helper function to exit notes editing mode
 */
function exitNotesEditMode() {
    const notesDisplay = document.getElementById('detail-notes-display');
    const notesEdit = document.getElementById('detail-notes-edit');
    const editBtn = document.getElementById('edit-notes-btn');
    const saveBtn = document.getElementById('save-notes-btn');
    const cancelBtn = document.getElementById('cancel-notes-btn');
    
    if (notesDisplay && notesEdit && editBtn && saveBtn && cancelBtn) {
        // Show display, hide edit field
        notesDisplay.style.display = 'block';
        notesEdit.style.display = 'none';
        
        // Show edit button, hide save/cancel buttons
        editBtn.style.display = 'inline-flex';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    }
}

/**
 * Update notes in search results if they are currently displayed
 */
function updateSearchResultsNotes(patientId, newNotes) {
    const searchResults = document.getElementById('patientSearchResults');
    if (!searchResults || searchResults.style.display === 'none') return;
    
    // Update the search results display
    const searchNotesDisplay = document.getElementById(`search-notes-display-${patientId}`);
    if (searchNotesDisplay) {
        searchNotesDisplay.textContent = newNotes;
    }
}

/**
 * Edit notes in search results cards
 */
function editSearchNotes(patientId) {
    const notesDisplay = document.getElementById(`search-notes-display-${patientId}`);
    const notesEdit = document.getElementById(`search-notes-edit-${patientId}`);
    const editBtn = notesDisplay?.parentElement.querySelector('.edit-btn');
    const saveBtn = document.getElementById(`search-save-${patientId}`);
    const cancelBtn = document.getElementById(`search-cancel-${patientId}`);
    
    if (!notesDisplay || !notesEdit || !editBtn || !saveBtn || !cancelBtn) {
        console.error('Search notes editing elements not found for', patientId);
        return;
    }
    
    // Copy current text to edit field
    notesEdit.value = notesDisplay.textContent || '';
    
    // Show edit field, hide display
    notesDisplay.style.display = 'none';
    notesEdit.style.display = 'block';
    
    // Show save/cancel buttons, hide edit button
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-flex';
    cancelBtn.style.display = 'inline-flex';
    
    // Focus on the textarea
    notesEdit.focus();
    
    // Add keyboard shortcuts
    notesEdit.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cancelSearchNotesEdit(patientId);
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            saveSearchNotes(patientId);
        }
    });
    
    showNotification('Notes editing mode activated • Press Ctrl+Enter to save, Esc to cancel', 'info');
}

/**
 * Save notes from search results cards
 */
function saveSearchNotes(patientId) {
    const notesDisplay = document.getElementById(`search-notes-display-${patientId}`);
    const notesEdit = document.getElementById(`search-notes-edit-${patientId}`);
    const editBtn = notesDisplay?.parentElement.querySelector('.edit-btn');
    const saveBtn = document.getElementById(`search-save-${patientId}`);
    const cancelBtn = document.getElementById(`search-cancel-${patientId}`);
    
    if (!notesDisplay || !notesEdit) {
        console.error('Search notes elements not found for', patientId);
        return;
    }
    
    const newNotes = notesEdit.value.trim();
    
    // Update the patient data
    const patient = patientsData.find(p => p.id === patientId);
    if (patient) {
        patient.notes = newNotes || 'No notes available';
        
        // Update display
        notesDisplay.textContent = patient.notes;
        
        // Update patient details modal if it's open for the same patient
        if (window.currentPatientDetails && window.currentPatientDetails.id === patientId) {
            const modalNotesDisplay = document.getElementById('detail-notes-display');
            const modalNotesEdit = document.getElementById('detail-notes-edit');
            if (modalNotesDisplay) modalNotesDisplay.textContent = patient.notes;
            if (modalNotesEdit) modalNotesEdit.value = patient.notes;
        }
        
        showNotification(`Notes updated for ${patient.parentName}`, 'success');
    }
    
    // Switch back to display mode
    exitSearchNotesEditMode(patientId);
}

/**
 * Cancel search notes editing
 */
function cancelSearchNotesEdit(patientId) {
    const notesDisplay = document.getElementById(`search-notes-display-${patientId}`);
    const notesEdit = document.getElementById(`search-notes-edit-${patientId}`);
    
    if (notesDisplay && notesEdit) {
        // Revert textarea to original value
        notesEdit.value = notesDisplay.textContent || '';
    }
    
    exitSearchNotesEditMode(patientId);
    showNotification('Notes editing cancelled', 'info');
}

/**
 * Helper function to exit search notes editing mode
 */
function exitSearchNotesEditMode(patientId) {
    const notesDisplay = document.getElementById(`search-notes-display-${patientId}`);
    const notesEdit = document.getElementById(`search-notes-edit-${patientId}`);
    const editBtn = notesDisplay?.parentElement.querySelector('.edit-btn');
    const saveBtn = document.getElementById(`search-save-${patientId}`);
    const cancelBtn = document.getElementById(`search-cancel-${patientId}`);
    
    if (notesDisplay && notesEdit && editBtn && saveBtn && cancelBtn) {
        // Show display, hide edit field
        notesDisplay.style.display = 'block';
        notesEdit.style.display = 'none';
        
        // Show edit button, hide save/cancel buttons
        editBtn.style.display = 'inline-flex';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    }
}



// ========================================
// EVENT LISTENERS AND INITIALIZATION
// ========================================

/**
 * Initialize the admin dashboard when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏥 Initializing Lance Yuri Kids Spot Admin Dashboard...');
    
    // Initialize all components
    initializeSearchFunctionality();
    initializeFilterFunctionality();
    initializeViewSwitching();
    initializeModalElements();
    initializeCalendarView();
    initializeStatsAnimation();
    initializeTableEffects();
    initializeViewDetailsButtons();
    
    // Initialize calendar functionality
    initializeCalendarInteractions();
    
    // Initialize branch filtering - set default to main branch
    updateBranchCounts();
    
    // Populate patient tables with sorted data (latest bookings first)
    populatePatientTables();
    
    console.log('✅ Admin dashboard loaded successfully!');
    console.log('Lance Yuri Kids Spot - Patient Management System');
});

/**
 * Initialize search functionality
 */
function initializeSearchFunctionality() {
    const searchInput = document.getElementById('patientDetailSearch');
    if (searchInput) {
        // Enter key trigger
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchPatientDetails();
            }
        });
        
        // Auto-search with debounce
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.trim();
            
            if (searchTerm.length >= 2) {
                searchTimeout = setTimeout(() => {
                    searchPatientDetails();
                }, 500);
            } else if (searchTerm.length === 0) {
                document.getElementById('patientSearchResults').style.display = 'none';
            }
        });
    }
}

/**
 * Initialize filter functionality
 */
function initializeFilterFunctionality() {
    const searchInput = document.querySelector('.search-box input');
    const serviceFilter = document.querySelector('.filter-select');
    const statusFilter = document.querySelectorAll('.filter-select')[1];
    const dateFilter = document.querySelector('.filter-date');

    // Add event listeners
    if (searchInput) searchInput.addEventListener('input', filterPatients);
    if (serviceFilter) serviceFilter.addEventListener('change', filterPatients);
    if (statusFilter) statusFilter.addEventListener('change', filterPatients);
    if (dateFilter) dateFilter.addEventListener('change', filterPatients);
}

// ========================================
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ========================================

// Core functions
window.schedulePatient = schedulePatient;
window.viewPatientDetails = viewPatientDetails;
window.contactPatient = contactPatient;
window.editPatient = editPatient;
window.populatePatientTables = populatePatientTables;

// Search functions
window.searchPatientDetails = searchPatientDetails;

// View management
window.switchView = switchView;
window.switchPatientView = switchPatientView;

// Branch filtering
window.filterByBranch = filterByBranch;

// Modal functions
window.closePatientDetailsModal = closePatientDetailsModal;
window.closeSchedulingModal = closeSchedulingModal;

// Utility functions
window.scrollToTop = scrollToTop;

// Notes editing functions
window.editNotes = editNotes;
window.saveNotes = saveNotes;
window.cancelNotesEdit = cancelNotesEdit;

// Search results notes editing functions
window.editSearchNotes = editSearchNotes;
window.saveSearchNotes = saveSearchNotes;
window.cancelSearchNotesEdit = cancelSearchNotesEdit;

// Patient details modal actions
window.scheduleFromDetails = () => {
    if (window.currentPatientDetails) {
        closePatientDetailsModal();
        schedulePatient(window.currentPatientDetails.id);
    }
};

window.contactFromDetails = () => {
    if (window.currentPatientDetails) {
        const patient = window.currentPatientDetails;
        showNotification(`Initiating contact with ${patient.parentName} at ${patient.phone}`, 'success');
    }
};

window.editFromDetails = () => {
    if (window.currentPatientDetails) {
        const patient = window.currentPatientDetails;
        showNotification(`Opening edit form for ${patient.parentName}`, 'info');
    }
};

window.printPatientDetails = () => {
    if (window.currentPatientDetails) {
        const patient = window.currentPatientDetails;
        showNotification(`Printing patient details for ${patient.parentName}`, 'info');
        window.print();
    }
};

// ========================================
// HELPER FUNCTIONS (IMPLEMENTATION DETAILS)
// ========================================

/**
 * Initialize view switching functionality
 */
function initializeViewSwitching() {
    const actionButtons = document.querySelectorAll('.big-action-btn');
    
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.dataset.view;
            if (view) {
                switchView(view);
            }
        });
    });
}

/**
 * Initialize modal elements and event listeners
 */
function initializeModalElements() {
    schedulingModal = document.getElementById('schedulingModal');
    modalOverlay = document.getElementById('modalOverlay');
    closeModal = document.querySelector('.close-modal');
    cancelBtn = document.querySelector('.btn-cancel');
    confirmBtn = document.querySelector('.btn-confirm');
    
    currentMonthDisplay = document.getElementById('currentMonth');
    calendarDates = document.getElementById('calendarDates');
    prevMonthBtn = document.getElementById('prevMonth');
    nextMonthBtn = document.getElementById('nextMonth');
    
    // Set up event listeners
    setupModalEventListeners();
    setupMonthNavigation();
    setupTimeSlotListeners();
    setupConfirmButton();
}

/**
 * Create patient detail card for search results
 */
function createPatientDetailCard(patient) {
    const scheduledInfo = patient.scheduledDate && patient.scheduledTime 
        ? `${patient.scheduledDate} at ${patient.scheduledTime}`
        : 'Not scheduled yet';
    
    const statusClass = patient.status === 'confirmed' ? 'confirmed' : 
                       patient.status === 'pending' ? 'pending' : 
                       patient.status === 'completed' ? 'completed' : 'cancelled';
    
    const age = calculateAge(patient.childBirthday);
    
    return `
        <div class="patient-detail-card">
            <div class="patient-detail-header">
                <h3>${patient.parentName}</h3>
                <span class="patient-detail-id">${patient.id}</span>
            </div>
            
            <div class="patient-detail-info">
                <div class="info-group">
                    <span class="info-label">Child Information</span>
                    <span class="info-value">${patient.childName}, ${age}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Guardian</span>
                    <span class="info-value">${patient.parentName} (${patient.guardianRelationship})</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Contact</span>
                    <span class="info-value">📧 ${patient.email}<br>📱 ${patient.phone}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Service Type</span>
                    <span class="info-value">
                        <span class="service-badge ${patient.serviceType}">${patient.service}</span>
                    </span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Booking Date</span>
                    <span class="info-value">${patient.bookingDate}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Scheduled Date</span>
                    <span class="info-value">${scheduledInfo}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Status</span>
                    <span class="info-value">
                        <span class="status-badge ${statusClass}">${patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}</span>
                    </span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Payment</span>
                    <span class="info-value">
                        <span class="payment-amount">${patient.paymentAmount}</span>
                        <span class="payment-method">Paid thru ${patient.paymentMethod === 'gcash' ? 'GCash' : 'Bank'}</span>
                        <span class="payment-date">📅 ${patient.paymentDate}</span>
                    </span>
                </div>
                
                <div class="info-group" style="grid-column: 1 / -1;">
                    <span class="info-label">Concerns</span>
                    <span class="info-value">${patient.concerns}</span>
                </div>
                
                ${patient.notes ? `
                <div class="info-group" style="grid-column: 1 / -1;">
                    <span class="info-label">Notes</span>
                    <div class="info-value">
                        <div class="notes-container">
                            <div id="search-notes-display-${patient.id}" class="notes-text">${patient.notes}</div>
                            <textarea id="search-notes-edit-${patient.id}" class="notes-edit-field" style="display: none;" placeholder="Add notes for this patient...">${patient.notes}</textarea>
                            <div class="notes-actions">
                                <button class="notes-btn edit-btn" onclick="editSearchNotes('${patient.id}')" title="Edit notes">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button id="search-save-${patient.id}" class="notes-btn save-btn" onclick="saveSearchNotes('${patient.id}')" style="display: none;" title="Save notes">
                                    <i class="fas fa-save"></i> Save
                                </button>
                                <button id="search-cancel-${patient.id}" class="notes-btn cancel-btn" onclick="cancelSearchNotesEdit('${patient.id}')" style="display: none;" title="Cancel editing">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <div class="patient-actions">
                <button class="detail-action-btn primary" onclick="schedulePatient('${patient.id}')">
                    <i class="fas fa-calendar-plus"></i> Schedule
                </button>
                <button class="detail-action-btn secondary" onclick="contactPatient('${patient.id}', '${patient.parentName}')">
                    <i class="fas fa-phone"></i> Contact
                </button>
                <button class="detail-action-btn secondary" onclick="viewPatientDetails('${patient.id}', '${patient.parentName}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    `;
}

/**
 * Create notification element
 */
function createNotificationElement(message, type) {
    const notification = document.createElement('div');
    notification.className = `admin-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#FF6B35'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease, opacity 0.3s ease;
        max-width: 350px;
        font-family: 'Inter', sans-serif;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    return notification;
}

/**
 * Hide notification element
 */
function hideNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
}

/**
 * Populate patient details modal with patient data
 */
function populatePatientDetailsModal(patient) {
    const elements = {
        'detail-patient-name': patient.parentName,
        'detail-patient-id': patient.id,
        'detail-guardian-name': patient.parentName,
        'detail-relationship': patient.guardianRelationship,
        'detail-email': patient.email,
        'detail-phone': patient.phone,
        'detail-child-name': patient.childName,
        'detail-child-age': patient.childAge,
        'detail-child-birthday': formatDate(patient.childBirthday),
        'detail-booking-date': patient.bookingDate,
        'detail-scheduled-date': patient.scheduledDate && patient.scheduledTime 
            ? `${patient.scheduledDate} - ${patient.scheduledTime}` 
            : 'Not yet scheduled',
        'detail-payment-amount': patient.paymentAmount,
        'detail-payment-date': patient.bookingDate,
        'detail-concerns': patient.concerns
    };
    
    // Handle notes separately for both display and edit fields
    const notesDisplay = document.getElementById('detail-notes-display');
    const notesEdit = document.getElementById('detail-notes-edit');
    if (notesDisplay) notesDisplay.textContent = patient.notes || 'No notes available';
    if (notesEdit) notesEdit.value = patient.notes || '';
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
    
    // Update badges
    const statusBadge = document.getElementById('detail-status-badge');
    if (statusBadge) {
        statusBadge.textContent = patient.status.charAt(0).toUpperCase() + patient.status.slice(1);
        statusBadge.className = `status-badge ${patient.status}`;
    }
    
    const paymentBadge = document.getElementById('detail-payment-badge');
    if (paymentBadge) {
        paymentBadge.innerHTML = `
            <span class="payment-amount">${patient.paymentAmount}</span>
            <span class="payment-method">Paid thru ${patient.paymentMethod === 'gcash' ? 'GCash' : 'Bank'}</span>
            <span class="payment-date">📅 ${patient.paymentDate}</span>
        `;
        paymentBadge.className = `payment-info`;
    }
    
    const serviceElement = document.getElementById('detail-service-type');
    if (serviceElement) {
        serviceElement.textContent = patient.service;
        serviceElement.className = `service-badge ${patient.serviceType}`;
    }
    
    const paymentStatusElement = document.getElementById('detail-payment-status');
    if (paymentStatusElement) {
        paymentStatusElement.textContent = patient.payment.charAt(0).toUpperCase() + patient.payment.slice(1);
        paymentStatusElement.className = `payment-badge ${patient.payment}`;
    }
}

/**
 * Populate scheduling modal with patient information
 */
function populateSchedulingModal() {
    const fields = {
        'modal-patient-name': currentPatientData.parentName,
        'modal-child-name': currentPatientData.childInfo,
        'modal-service': currentPatientData.service,
        'modal-booking-date': currentPatientData.bookingDate
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

/**
 * Initialize calendar view
 */
function initializeCalendarView() {
    if (typeof generateCalendarView === 'function') {
        generateCalendarView();
    }
    setupCalendarViewNavigation();
}

/**
 * Initialize stats animation
 */
function initializeStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-info h3');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        if (isNaN(finalValue)) return;
        
        let currentValue = 0;
        const increment = finalValue / 30;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = finalValue + (stat.textContent.includes('%') ? '%' : '');
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(currentValue) + (stat.textContent.includes('%') ? '%' : '');
            }
        }, 50);
    });
}

/**
 * Initialize table effects
 */
function initializeTableEffects() {
    const tableRows = document.querySelectorAll('.patients-table tbody tr');
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Initialize view details buttons
 */
function initializeViewDetailsButtons() {
    const viewButtons = document.querySelectorAll('.btn-action.view');
    
    viewButtons.forEach((button) => {
        const row = button.closest('tr');
        if (!row) return;
        
        let patientId = row.getAttribute('data-patient-id');
        
        if (!patientId) {
            const patientIdElement = row.querySelector('.patient-id');
            if (patientIdElement) {
                patientId = patientIdElement.textContent.trim();
            }
        }
        
        const patientNameElement = row.querySelector('.patient-info strong');
        const patientName = patientNameElement ? patientNameElement.textContent.trim() : 'Unknown Patient';
        
        if (patientId) {
            button.onclick = null;
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                viewPatientDetails(patientId, patientName);
            });
        }
    });
}

/**
 * Setup modal event listeners
 */
function setupModalEventListeners() {
    if (closeModal) closeModal.addEventListener('click', closeSchedulingModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeSchedulingModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeSchedulingModal);
}

/**
 * Setup month navigation
 */
function setupMonthNavigation() {
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar();
        });
    }
}

/**
 * Setup time slot listeners
 */
function setupTimeSlotListeners() {
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => selectTime(slot));
    });
}

/**
 * Setup confirm button
 */
function setupConfirmButton() {
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (!selectedDate || !selectedTime) return;
            
            const appointmentNotes = document.getElementById('appointmentNotes');
            const notes = appointmentNotes ? appointmentNotes.value : '';
            
            updatePatientSchedule(currentPatientData.rowElement, selectedDate, selectedTime, notes);
            
            showNotification('Appointment scheduled successfully!', 'success');
            closeSchedulingModal();
        });
    }
}

/**
 * Update active button state
 */
function updateActiveButton(buttons, activeView) {
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === activeView) {
            btn.classList.add('active');
        }
    });
}

/**
 * Show patients view
 */
function showPatientsView(patientsView, calendarView) {
    if (patientsView) patientsView.style.display = 'block';
    if (calendarView) calendarView.style.display = 'none';
    showNotification('📋 Showing patient list', 'info');
}

/**
 * Show calendar view
 */
function showCalendarView(patientsView, calendarView) {
    if (patientsView) patientsView.style.display = 'none';
    if (calendarView) {
        calendarView.style.display = 'block';
        generateCalendarView();
    }
    showNotification('📅 Showing appointment calendar', 'info');
}

/**
 * Hide all patient views
 */
function hideAllPatientViews(pendingView, scheduledView, completedView, calendarView) {
    if (pendingView) pendingView.style.display = 'none';
    if (scheduledView) scheduledView.style.display = 'none';
    if (completedView) completedView.style.display = 'none';
    if (calendarView) calendarView.style.display = 'none';
}

/**
 * Show selected patient view
 */
function showSelectedPatientView(view, pendingView, scheduledView, completedView, calendarView) {
    if (view === 'pending' && pendingView) {
        pendingView.style.display = 'block';
        showNotification('⏳ Showing pending patients', 'success');
    } else if (view === 'scheduled' && scheduledView) {
        scheduledView.style.display = 'block';
        showNotification('📅 Showing scheduled patients', 'success');
    } else if (view === 'completed' && completedView) {
        completedView.style.display = 'block';
        showNotification('✅ Showing completed patients', 'success');
    } else if (view === 'calendar' && calendarView) {
        calendarView.style.display = 'block';
        generateAppointmentCalendar();
        showNotification('📅 Showing calendar view', 'success');
    }
}

/**
 * Setup calendar view navigation
 */
function setupCalendarViewNavigation() {
    const prevCalendarBtn = document.getElementById('prevCalendarMonth');
    const nextCalendarBtn = document.getElementById('nextCalendarMonth');
    
    if (prevCalendarBtn) {
        prevCalendarBtn.addEventListener('click', () => {
            calendarViewMonth--;
            if (calendarViewMonth < 0) {
                calendarViewMonth = 11;
                calendarViewYear--;
            }
            generateCalendarView();
        });
    }

    if (nextCalendarBtn) {
        nextCalendarBtn.addEventListener('click', () => {
            calendarViewMonth++;
            if (calendarViewMonth > 11) {
                calendarViewMonth = 0;
                calendarViewYear++;
            }
            generateCalendarView();
        });
    }
}

// Additional calendar helper functions
function generatePreviousMonthDates(startDate, daysInPrevMonth) {
    if (!calendarDates) return;
    for (let i = startDate - 1; i >= 0; i--) {
        const date = daysInPrevMonth - i;
        const dateElement = createDateElement(date, 'other-month', new Date(currentYear, currentMonth - 1, date));
        calendarDates.appendChild(dateElement);
    }
}

function generateCurrentMonthDates(daysInMonth) {
    if (!calendarDates) return;
    for (let date = 1; date <= daysInMonth; date++) {
        const fullDate = new Date(currentYear, currentMonth, date);
        const dateElement = createDateElement(date, '', fullDate);
        
        const today = new Date();
        if (fullDate.toDateString() === today.toDateString()) {
            dateElement.classList.add('today');
        }
        
        if (fullDate < today.setHours(0, 0, 0, 0)) {
            dateElement.classList.add('unavailable');
        }
        
        calendarDates.appendChild(dateElement);
    }
}

function generateNextMonthDates(startDate, daysInMonth) {
    if (!calendarDates) return;
    const totalCells = 42;
    const remainingCells = totalCells - (startDate + daysInMonth);
    for (let date = 1; date <= remainingCells; date++) {
        const dateElement = createDateElement(date, 'other-month', new Date(currentYear, currentMonth + 1, date));
        calendarDates.appendChild(dateElement);
    }
}

function createDateElement(date, className, fullDate) {
    const dateElement = document.createElement('div');
    dateElement.className = `calendar-date ${className}`;
    dateElement.textContent = date;
    dateElement.dataset.date = fullDate.toISOString().split('T')[0];
    
    if (!className.includes('other-month') && !className.includes('unavailable')) {
        dateElement.addEventListener('click', () => selectDate(dateElement, fullDate));
    }
    
    return dateElement;
}

function generateCalendarViewDates(startDate, daysInPrevMonth, daysInMonth) {
    const calendarViewDates = document.getElementById('calendarViewDates');
    if (!calendarViewDates) return;
    
    // Previous month dates
    for (let i = startDate - 1; i >= 0; i--) {
        const date = daysInPrevMonth - i;
        const dateElement = createCalendarViewDate(date, 'other-month', new Date(calendarViewYear, calendarViewMonth - 1, date));
        calendarViewDates.appendChild(dateElement);
    }
    
    // Current month dates
    for (let date = 1; date <= daysInMonth; date++) {
        const fullDate = new Date(calendarViewYear, calendarViewMonth, date);
        const dateElement = createCalendarViewDate(date, '', fullDate);
        
        const today = new Date();
        if (fullDate.toDateString() === today.toDateString()) {
            dateElement.classList.add('today');
        }
        
        calendarViewDates.appendChild(dateElement);
    }
    
    // Next month dates
    const totalCells = 42;
    const remainingCells = totalCells - (startDate + daysInMonth);
    for (let date = 1; date <= remainingCells; date++) {
        const dateElement = createCalendarViewDate(date, 'other-month', new Date(calendarViewYear, calendarViewMonth + 1, date));
        calendarViewDates.appendChild(dateElement);
    }
}

function createCalendarViewDate(date, className, fullDate) {
    const dateElement = document.createElement('div');
    dateElement.className = `calendar-view-date ${className}`;
    
    const dateNumber = document.createElement('div');
    dateNumber.className = 'date-number';
    dateNumber.textContent = date;
    dateElement.appendChild(dateNumber);
    
    const appointmentsContainer = document.createElement('div');
    appointmentsContainer.className = 'date-appointments';
    
    const dateString = fullDate.toISOString().split('T')[0];
    const dayAppointments = scheduledAppointments.filter(apt => apt.date === dateString);
    
    dayAppointments.forEach(appointment => {
        const appointmentElement = document.createElement('div');
        appointmentElement.className = `appointment-item ${appointment.type}`;
        appointmentElement.innerHTML = `
            <div>${appointment.time}</div>
            <div>${appointment.child}</div>
        `;
        appointmentElement.title = `${appointment.patient} - ${appointment.service}`;
        appointmentsContainer.appendChild(appointmentElement);
    });
    
    dateElement.appendChild(appointmentsContainer);
    return dateElement;
}

function selectDate(dateElement, fullDate) {
    if (dateElement.classList.contains('unavailable')) return;
    
    clearDateSelection();
    dateElement.classList.add('selected');
    selectedDate = fullDate;
    
    updateScheduleDisplay();
    updateConfirmButton();
}

function clearDateSelection() {
    document.querySelectorAll('.calendar-date.selected').forEach(el => {
        el.classList.remove('selected');
    });
}

function selectTime(timeSlot) {
    if (timeSlot.classList.contains('unavailable')) return;
    
    clearTimeSelection();
    timeSlot.classList.add('selected');
    selectedTime = timeSlot.dataset.time;
    
    updateScheduleDisplay();
    updateConfirmButton();
}

function clearTimeSelection() {
    document.querySelectorAll('.time-slot.selected').forEach(el => {
        el.classList.remove('selected');
    });
}

function updateScheduleDisplay() {
    const scheduleDisplay = document.getElementById('selectedSchedule');
    const displayElement = document.querySelector('.schedule-display');
    
    if (!scheduleDisplay || !displayElement) return;
    
    if (selectedDate && selectedTime) {
        const dateStr = selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const timeStr = formatTime(selectedTime);
        scheduleDisplay.textContent = `${dateStr} at ${timeStr}`;
        displayElement.classList.add('selected');
    } else {
        scheduleDisplay.textContent = 'Please select a date and time';
        displayElement.classList.remove('selected');
    }
}

function updateConfirmButton() {
    if (confirmBtn) {
        confirmBtn.disabled = !(selectedDate && selectedTime);
    }
}

function updatePatientSchedule(rowElement, date, time, notes) {
    if (!rowElement) return;
    
    const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const timeStr = formatTime(time);
    
    // Update scheduled date cell
    const scheduledDateCell = rowElement.children[5];
    if (scheduledDateCell) {
        scheduledDateCell.innerHTML = `${dateStr} - ${timeStr}`;
    }
    
    // Update status cell
    const statusCell = rowElement.children[6];
    if (statusCell) {
        const statusBadge = statusCell.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.textContent = 'Scheduled';
            statusBadge.className = 'status-badge confirmed';
        }
    }
    
    // Add to scheduled appointments data
    const patientName = rowElement.querySelector('.patient-info strong').textContent;
    const childInfo = rowElement.querySelector('.patient-info small').textContent;
    const childName = childInfo.split(',')[0].replace('Child: ', '');
    const service = rowElement.querySelector('.service-badge').textContent;
    
    scheduledAppointments.push({
        date: date.toISOString().split('T')[0],
        time: timeStr,
        patient: patientName,
        child: childName,
        service: service,
        type: 'assessment'
    });
}

console.log('🏥 Admin dashboard fully loaded with all functions!');
console.log('Lance Yuri Kids Spot - Patient Management System Ready'); 