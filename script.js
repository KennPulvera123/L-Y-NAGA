// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(255, 107, 53, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(255, 107, 53, 0.1)';
    }
});

// Age calculator functionality
function calculateAgeForDisplay(birthdayValue, displayElement) {
    const birthday = new Date(birthdayValue);
    const today = new Date();
    
    if (!birthdayValue) {
        displayElement.innerHTML = '<span class="age-text">Age will be calculated automatically</span>';
        displayElement.classList.remove('calculated');
        return;
    }
    
    if (birthday > today) {
        displayElement.innerHTML = '<span class="age-text">Birthday cannot be in the future</span>';
        displayElement.classList.remove('calculated');
        return;
    }
    
    let years = today.getFullYear() - birthday.getFullYear();
    let months = today.getMonth() - birthday.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Adjust for days
    if (today.getDate() < birthday.getDate()) {
        months--;
        if (months < 0) {
            years--;
            months += 12;
        }
    }
    
    displayElement.classList.add('calculated');
    
    if (years === 0) {
        displayElement.innerHTML = `<span class="age-text">${months} month${months !== 1 ? 's' : ''} old</span>`;
    } else if (months === 0) {
        displayElement.innerHTML = `<span class="age-text">${years} year${years !== 1 ? 's' : ''} old</span>`;
    } else {
        displayElement.innerHTML = `<span class="age-text">${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''} old</span>`;
    }
}

// Age calculation functions for different forms
function calculateAgeReg() {
    const birthdayInput = document.getElementById('regChildBirthday');
    const ageDisplay = document.getElementById('regAgeDisplay');
    calculateAgeForDisplay(birthdayInput.value, ageDisplay);
}

function calculateAgeLogin() {
    const birthdayInput = document.getElementById('loginChildBirthday');
    const ageDisplay = document.getElementById('loginAgeDisplay');
    calculateAgeForDisplay(birthdayInput.value, ageDisplay);
}

function calculateAgeGuest() {
    const birthdayInput = document.getElementById('guestChildBirthday');
    const ageDisplay = document.getElementById('guestAgeDisplay');
    calculateAgeForDisplay(birthdayInput.value, ageDisplay);
}

// Generic age calculation function for booking modal
function calculateAge() {
    const birthdayInput = document.getElementById('child-birthday');
    const ageDisplay = document.getElementById('age-display');
    if (birthdayInput && ageDisplay) {
        calculateAgeForDisplay(birthdayInput.value, ageDisplay);
    }
}

// Authentication Modal Variables
const authModal = document.getElementById('authModal');
const authClose = document.querySelector('.auth-close');
const authTabs = document.querySelectorAll('.auth-tab-btn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
let currentUser = null;

// Guest Booking Modal Variables
const guestBookingModal = document.getElementById('guestBookingModal');
const guestBookingClose = document.querySelector('.guest-booking-close');
const guestBookingForm = document.getElementById('guestBookingForm');

// Note: Using guestBookingModal as the main booking modal

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUIForLoggedInUser();
        autoFillBookingForm();
    }
});

// Authentication Modal Functions
function showAuthModal() {
    authModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openAuthModal() {
    showAuthModal();
}

function hideAuthModal() {
    authModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function proceedAsGuest() {
    hideAuthModal();
    showBookingModal();
}

function scrollToBookingForm() {
    const bookingSection = document.querySelector('#booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Auth Modal Event Listeners
if (authClose) {
    authClose.addEventListener('click', hideAuthModal);
}

// Guest Booking Modal Event Listeners
if (guestBookingClose) {
    guestBookingClose.addEventListener('click', closeGuestBookingModal);
}

if (guestBookingForm) {
    guestBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitGuestBooking();
    });
}

window.addEventListener('click', (event) => {
    if (event.target === authModal) {
        hideAuthModal();
    }
    if (event.target === guestBookingModal) {
        closeGuestBookingModal();
    }
});

// Tab switching
function switchAuthTab(tabName) {
    // Update active tab
    authTabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`[onclick="switchAuthTab('${tabName}')"]`).classList.add('active');
    
    // Show corresponding form
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    if (tabName === 'login') {
        loginForm.classList.add('active');
    } else {
        registerForm.classList.add('active');
    }
}

// Login Form Handler
const loginFormElement = loginForm.querySelector('.auth-form-container');
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('Login successful! You can now book an assessment.', 'success');
        updateUIForLoggedInUser();
        hideAuthModal();
    } else {
        showNotification('Invalid email or password', 'error');
    }
});

// Registration Form Handler
const registerFormElement = registerForm.querySelector('.auth-form-container');
registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // Validation
    if (!name || !phone || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (users.find(u => u.email === email)) {
        showNotification('An account with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        phone,
        email,
        password,
        registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Log in the new user
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Get branch name for display
    const branchName = branchLocation === 'blumentritt' ? 'Main Branch (Blumentritt)' : 'Satellite Branch (Del Rosario)';
    
    showNotification(`Registration successful! Assessment booking confirmed at ${branchName}.`, 'success');
    updateUIForLoggedInUser();
    hideAuthModal();
});

// Integrated Registration with Booking
function registerWithBooking() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    
    // Branch Information
    const branchLocation = document.querySelector('#registerForm input[name="branchLocation"]:checked')?.value;
    
    // Guardian Information
    const guardianRelation = document.getElementById('regGuardianRelation').value;
    const emergencyContact = document.getElementById('regEmergencyContact').value;
    
    // Child Information
    const childName = document.getElementById('regChildName').value;
    const childBirthday = document.getElementById('regChildBirthday').value;
    const serviceType = document.getElementById('regServiceType').value;
    const concerns = document.getElementById('regConcerns').value;
    
    // Validation
    if (!branchLocation || !name || !email || !phone || !password || !guardianRelation || !emergencyContact || 
        !childName || !childBirthday || !serviceType) {
        showNotification('Please fill in all required fields including branch selection', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Phone validation
    const phoneRegex = /^09[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        showNotification('Please enter a valid Philippine phone number (09XXXXXXXXX)', 'error');
        return;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (users.some(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }
    
    // Create new user with booking info
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password,
        guardianRelation,
        emergencyContact,
        registeredAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Create booking
    const bookingData = {
        patientId: 'PT' + String(Date.now()).slice(-6),
        guardianName: name,
        guardianEmail: email,
        guardianPhone: phone,
        guardianRelation,
        emergencyContact,
        childName,
        childBirthday,
        serviceType,
        concerns,
        branchLocation,
        branchName: branchLocation === 'blumentritt' ? 'Main Branch (Blumentritt)' : 'Satellite Branch (Del Rosario)',
        bookingDate: new Date().toISOString().split('T')[0],
        status: 'Pending Schedule',
        paymentStatus: 'Pending',
        bookingFee: Math.floor(Math.random() * 501) + 300, // Random fee between 300-800
        createdAt: new Date().toISOString()
    };
    
    // Log in the user
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showNotification('Registration and booking successful!', 'success');
    hideAuthModal();
    
    // Redirect to payment
    setTimeout(() => {
        redirectToPayment(bookingData);
    }, 1000);
}

// Integrated Login with Booking
function loginWithBooking() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Branch Information  
    const branchLocation = document.querySelector('#loginForm input[name="branchLocation"]:checked')?.value;
    
    // Child Information
    const childName = document.getElementById('loginChildName').value;
    const childBirthday = document.getElementById('loginChildBirthday').value;
    const serviceType = document.getElementById('loginServiceType').value;
    const concerns = document.getElementById('loginConcerns').value;
    
    // Validation
    if (!branchLocation || !email || !password || !childName || !childBirthday || !serviceType) {
        showNotification('Please fill in all required fields including branch selection', 'error');
        return;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Create booking
        const bookingData = {
            patientId: 'PT' + String(Date.now()).slice(-6),
            guardianName: user.name,
            guardianEmail: user.email,
            guardianPhone: user.phone,
            guardianRelation: user.guardianRelation || 'Parent',
            emergencyContact: user.emergencyContact || user.phone,
            childName,
            childBirthday,
            serviceType,
            concerns,
            branchLocation,
            branchName: branchLocation === 'blumentritt' ? 'Main Branch (Blumentritt)' : 'Satellite Branch (Del Rosario)',
            bookingDate: new Date().toISOString().split('T')[0],
            status: 'Pending Schedule',
            paymentStatus: 'Pending',
            bookingFee: Math.floor(Math.random() * 501) + 300,
            createdAt: new Date().toISOString()
        };
        
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Get branch name for display
        const branchName = branchLocation === 'blumentritt' ? 'Main Branch (Blumentritt)' : 'Satellite Branch (Del Rosario)';
        
        showNotification(`Login and booking successful! Assessment scheduled at ${branchName}.`, 'success');
        hideAuthModal();
        
        // Redirect to payment
        setTimeout(() => {
            redirectToPayment(bookingData);
        }, 1000);
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function updateUIForLoggedInUser() {
    // Update book now buttons to show user is logged in
    const bookButtons = document.querySelectorAll('.btn-primary, .book-btn-nav');
    bookButtons.forEach(button => {
        if (!button.classList.contains('btn-book-now')) {
            button.innerHTML = `<i class="fas fa-user-check"></i> Book Appointment`;
        }
    });
}

// Guest Booking Modal Functions
function openGuestBookingModal() {
    const guestModal = document.getElementById('guestBookingModal');
    if (guestModal) {
        guestModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeGuestBookingModal() {
    const guestModal = document.getElementById('guestBookingModal');
    if (guestModal) {
        guestModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Guest booking form submission
function submitGuestBooking() {
    // Branch Information
    const branchLocation = document.querySelector('#guestBookingForm input[name="branchLocation"]:checked')?.value;
    
    const guardianName = document.getElementById('guestGuardianName').value;
    const guardianEmail = document.getElementById('guestGuardianEmail').value;
    const guardianPhone = document.getElementById('guestGuardianPhone').value;
    const guardianRelation = document.getElementById('guestGuardianRelation').value;
    const childName = document.getElementById('guestChildName').value;
    const childBirthday = document.getElementById('guestChildBirthday').value;
    const serviceType = document.getElementById('guestServiceType').value;
    const concerns = document.getElementById('guestConcerns').value;
    
    // Validation
    if (!branchLocation || !guardianName || !guardianEmail || !guardianPhone || !guardianRelation || 
        !childName || !childBirthday || !serviceType) {
        showNotification('Please fill in all required fields including branch selection', 'error');
        return;
    }
    
    // Phone validation
    const phoneRegex = /^09[0-9]{9}$/;
    if (!phoneRegex.test(guardianPhone)) {
        showNotification('Please enter a valid Philippine phone number (09XXXXXXXXX)', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guardianEmail)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Create booking
    const bookingData = {
        patientId: 'PT' + String(Date.now()).slice(-6),
        guardianName,
        guardianEmail,
        guardianPhone,
        guardianRelation,
        emergencyContact: guardianPhone,
        childName,
        childBirthday,
        serviceType,
        concerns,
        branchLocation,
        branchName: branchLocation === 'blumentritt' ? 'Main Branch (Blumentritt)' : 'Satellite Branch (Del Rosario)',
        bookingDate: new Date().toISOString().split('T')[0],
        status: 'Pending Schedule',
        paymentStatus: 'Pending',
        bookingFee: Math.floor(Math.random() * 501) + 300,
        createdAt: new Date().toISOString()
    };
    
    // Get branch name for display
    const branchName = branchLocation === 'blumentritt' ? 'Main Branch (Blumentritt)' : 'Satellite Branch (Del Rosario)';
    
    showNotification(`Guest booking successful! Assessment scheduled at ${branchName}.`, 'success');
    closeGuestBookingModal();
    
    // Redirect to payment
    setTimeout(() => {
        redirectToPayment(bookingData);
    }, 1000);
}

// Payment redirect function
function redirectToPayment(bookingData) {
    // Store booking data in localStorage for payment page
    localStorage.setItem('currentBooking', JSON.stringify(bookingData));
    
    // Redirect to payment page
    window.location.href = `payment.html?id=${bookingData.patientId}&service=${encodeURIComponent(bookingData.serviceType)}&date=${bookingData.bookingDate}&fee=${bookingData.bookingFee}`;
}

function autoFillBookingForm() {
    if (currentUser) {
        const guardianNameField = document.getElementById('guestGuardianName');
        const guardianEmailField = document.getElementById('guestGuardianEmail');
        const phoneField = document.getElementById('guestGuardianPhone');
        
        if (guardianNameField) guardianNameField.value = currentUser.name;
        if (guardianEmailField) guardianEmailField.value = currentUser.email;
        if (phoneField) phoneField.value = currentUser.phone;
    }
}

// Booking Modal Functions
function showBookingModal() {
    if (guestBookingModal) {
        guestBookingModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Auto-fill form if user is logged in
        if (currentUser) {
            autoFillBookingForm();
        }
        
        // Set up age calculator
        setTimeout(() => {
            const birthdayInput = document.getElementById('guestChildBirthday');
            const ageDisplay = document.getElementById('guestAgeDisplay');
            
            if (birthdayInput && ageDisplay) {
                birthdayInput.addEventListener('change', calculateAgeGuest);
            }
        }, 100);
    }
}

function hideBookingModal() {
    if (guestBookingModal) {
        guestBookingModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Booking Modal Event Listeners
// Using existing guestBookingModal event listeners
window.addEventListener('click', (event) => {
    if (event.target === guestBookingModal) {
        hideBookingModal();
    }
});

// Form submission handling
const bookNowButtons = document.querySelectorAll('.btn-primary, .book-btn-nav, .btn-primary-large, .btn-book-now');

// Add click handlers to all "Book Now" buttons
bookNowButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // If it's not the form submit button, show auth modal
        if (!button.classList.contains('btn-book-now')) {
            e.preventDefault();
            
            // Always show authentication modal to let user choose booking method
            showAuthModal();
        }
    });
});

// Handle booking form submission
document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('guestBookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(bookingForm);
            const bookingData = {
                guardianName: formData.get('guardianName'),
                guardianEmail: formData.get('guardianEmail'),
                relationship: formData.get('guardianRelation'),
                childName: formData.get('childName'),
                childBirthday: formData.get('childBirthday'),
                service: formData.get('serviceType'),
                phone: formData.get('guardianPhone'),
                concerns: formData.get('concerns'),
                bookingDate: new Date().toLocaleDateString()
            };
            
            // Show loading state
            const submitButton = bookingForm.querySelector('.btn-book-now');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            submitButton.disabled = true;
            
            // Simulate booking process (replace with actual API call)
            setTimeout(() => {
                // Show success message
                showNotification('Assessment booking confirmed! Redirecting to payment...', 'success');
                
                // Hide booking modal
                hideBookingModal();
                
                // Redirect to payment page with booking data
                const paymentUrl = `payment.html?service=${encodeURIComponent(bookingData.service)}&bookingDate=${encodeURIComponent(bookingData.bookingDate)}&guardianName=${encodeURIComponent(bookingData.guardianName)}&childName=${encodeURIComponent(bookingData.childName)}&guardianEmail=${encodeURIComponent(bookingData.guardianEmail)}&phone=${encodeURIComponent(bookingData.phone)}`;
                
                setTimeout(() => {
                    window.location.href = paymentUrl;
                }, 1500);
                
                // Optional: Log booking data (for development)
                console.log('Booking Data:', bookingData);
            }, 2000);
        });
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .booking-container');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Particle animation for hero section (optional enhancement)
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 107, 53, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: float-particle ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            z-index: 1;
        `;
        hero.appendChild(particle);
    }
}

// Add particle animation CSS
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes float-particle {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);

// Initialize particles
document.addEventListener('DOMContentLoaded', createParticles);

// Form validation
function validateForm() {
    const form = document.querySelector('.booking-form-container');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#f44336';
            
            // Remove error styling on input
            input.addEventListener('input', function() {
                this.style.borderColor = '#E0E0E0';
            }, { once: true });
        }
    });
    
    // Email validation
    const emailInput = form.querySelector('#guardian-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && emailInput.value && !emailRegex.test(emailInput.value)) {
        isValid = false;
        emailInput.style.borderColor = '#f44336';
        showNotification('Please enter a valid email address.', 'error');
    }
    
    // Phone validation
    const phoneInput = form.querySelector('#phone');
    const phoneRegex = /^09\d{9}$/;
    if (phoneInput && phoneInput.value && !phoneRegex.test(phoneInput.value.replace(/\s/g, ''))) {
        isValid = false;
        phoneInput.style.borderColor = '#f44336';
        showNotification('Please enter a valid mobile number (09XXXXXXXXX).', 'error');
    }
    
    return isValid;
}

// Add validation to form submission (handled in main form submission handler above)

// Format phone number input
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, ''); // Remove non-digits
            
            // Format as 09XX XXX XXXX
            if (value.length > 0) {
                if (value.length <= 4) {
                    value = value;
                } else if (value.length <= 7) {
                    value = value.substring(0, 4) + ' ' + value.substring(4);
                } else {
                    value = value.substring(0, 4) + ' ' + value.substring(4, 7) + ' ' + value.substring(7, 11);
                }
            }
            
            this.value = value;
        });
    }
});

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Add tilt effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });
    
    // Add pulse effect to hero visual on click
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pulse 1s ease-in-out, pulse 3s ease-in-out infinite 1s';
            }, 100);
        });
    }
});

console.log('🎉 BookNow website loaded successfully!'); 