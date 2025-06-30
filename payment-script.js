// Payment Method Selection
const paymentOptions = document.querySelectorAll('.payment-option');
const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
const payNowBtn = document.getElementById('pay-now-btn');

// Handle payment method selection
paymentRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        // Remove selected class from all options
        paymentOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selected class to chosen option
        const selectedOption = this.closest('.payment-option');
        selectedOption.classList.add('selected');
        
        // Enable pay button
        payNowBtn.disabled = false;
        
        // Update button text based on method
        const method = this.value;
        const bookingFee = document.getElementById('booking-fee').textContent;
        if (method === 'gcash') {
            payNowBtn.innerHTML = `<i class="fas fa-mobile-alt"></i> Pay with GCash <span class="amount">${bookingFee}</span>`;
        } else if (method === 'bank') {
            payNowBtn.innerHTML = `<i class="fas fa-university"></i> Confirm Bank Transfer <span class="amount">${bookingFee}</span>`;
        }
    });
});

// Copy to clipboard functionality
const copyButtons = document.querySelectorAll('.copy-btn');
copyButtons.forEach(button => {
    button.addEventListener('click', function() {
        const textToCopy = this.getAttribute('data-copy');
        
        // Copy to clipboard
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Show success feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            this.classList.add('copied');
            
            // Show notification
            showNotification(`Account number ${textToCopy} copied!`, 'success');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy to clipboard', 'error');
        });
    });
});

// File upload handling
const receiptUpload = document.getElementById('receipt-upload');
const uploadLabel = document.querySelector('.upload-label');

receiptUpload.addEventListener('change', function() {
    if (this.files.length > 0) {
        const file = this.files[0];
        const fileName = file.name;
        const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB
        
        uploadLabel.classList.add('has-file');
        uploadLabel.innerHTML = `
            <i class="fas fa-file-check"></i>
            <strong>File Selected:</strong> ${fileName}
            <small>(${fileSize} MB)</small>
        `;
        
        showNotification('Receipt uploaded successfully!', 'success');
    } else {
        uploadLabel.classList.remove('has-file');
        uploadLabel.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            Upload Payment Receipt
        `;
    }
});

// GCash number formatting
const gcashNumberInput = document.getElementById('gcash-number');
if (gcashNumberInput) {
    gcashNumberInput.addEventListener('input', function() {
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
    
    gcashNumberInput.addEventListener('blur', function() {
        const value = this.value.replace(/\s/g, '');
        if (value.length === 11 && value.startsWith('09')) {
            this.style.borderColor = '#4CAF50';
        } else if (value.length > 0) {
            this.style.borderColor = '#f44336';
        } else {
            this.style.borderColor = '#E0E0E0';
        }
    });
}

// Payment processing
payNowBtn.addEventListener('click', function() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
    
    if (!selectedMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    // Validate based on selected method
    if (selectedMethod.value === 'gcash') {
        const gcashNumber = gcashNumberInput.value.replace(/\s/g, '');
        if (!gcashNumber || gcashNumber.length !== 11 || !gcashNumber.startsWith('09')) {
            showNotification('Please enter a valid GCash mobile number', 'error');
            gcashNumberInput.focus();
            return;
        }
    } else if (selectedMethod.value === 'bank') {
        const receiptFile = receiptUpload.files[0];
        if (!receiptFile) {
            showNotification('Please upload your payment receipt', 'error');
            receiptUpload.focus();
            return;
        }
    }
    
    // Show loading state
    const originalText = this.innerHTML;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    this.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        if (selectedMethod.value === 'gcash') {
            processGCashPayment();
        } else if (selectedMethod.value === 'bank') {
            processBankTransfer();
        }
        
        // Reset button
        this.innerHTML = originalText;
        this.disabled = false;
    }, 3000);
});

// GCash payment simulation
function processGCashPayment() {
    // Create success modal
    showPaymentSuccess({
        method: 'GCash',
        message: 'Payment request sent to your GCash app. Please complete the payment within 10 minutes.',
        details: [
            'Amount: ₱2,500.00',
            'Reference: GC' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            'Status: Pending Confirmation'
        ]
    });
}

// Bank transfer simulation
function processBankTransfer() {
    showPaymentSuccess({
        method: 'Bank Transfer',
        message: 'Your payment receipt has been uploaded. We will verify and confirm your payment within 24 hours.',
        details: [
            'Amount: ₱2,500.00',
            'Reference: BT' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            'Status: Under Verification'
        ]
    });
}

// Payment success modal
function showPaymentSuccess(data) {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Payment ${data.method === 'GCash' ? 'Initiated' : 'Received'}</h2>
                <p>${data.message}</p>
            </div>
            <div class="modal-body">
                <div class="payment-details">
                    ${data.details.map(detail => `<div class="detail-item">${detail}</div>`).join('')}
                </div>
                <div class="next-steps">
                    <h4>What's Next?</h4>
                    <ul>
                        ${data.method === 'GCash' ? 
                            '<li>Check your GCash app for payment notification</li><li>Complete the payment authorization</li>' :
                            '<li>We will verify your payment receipt</li><li>You will receive confirmation via email</li>'
                        }
                        <li>We will send booking confirmation once payment is confirmed</li>
                    </ul>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="window.location.href='index.html'">
                    Back to Home
                </button>
                <button class="btn-primary" onclick="window.location.href='index.html'">
                    Done
                </button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .payment-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background: white;
            border-radius: 20px;
            max-width: 500px;
            width: 100%;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .modal-header {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .success-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .modal-header h2 {
            margin-bottom: 0.5rem;
            font-size: 1.8rem;
        }
        
        .modal-header p {
            opacity: 0.9;
            font-size: 1rem;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .payment-details {
            background: #f5f5f5;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
        }
        
        .detail-item {
            padding: 0.5rem 0;
            border-bottom: 1px solid #e0e0e0;
            font-weight: 500;
        }
        
        .detail-item:last-child {
            border-bottom: none;
        }
        
        .next-steps h4 {
            color: #FF6B35;
            margin-bottom: 1rem;
        }
        
        .next-steps ul {
            padding-left: 1.5rem;
        }
        
        .next-steps li {
            margin-bottom: 0.5rem;
            color: #666;
        }
        
        .modal-actions {
            padding: 1.5rem 2rem;
            background: #f5f5f5;
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .modal-actions button {
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .modal-actions .btn-secondary {
            background: transparent;
            color: #666;
            border: 2px solid #e0e0e0;
        }
        
        .modal-actions .btn-primary {
            background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
            color: white;
        }
    `;
    
    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking overlay
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(modalStyles);
        document.body.style.overflow = '';
    });
}

// Notification system (reused from main site)
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Get booking data from URL parameters (if passed)
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    const bookingDate = urlParams.get('bookingDate');
    
    if (service) {
        // Convert service format to readable text
        const serviceMap = {
            'initial-assessment': 'Initial Assessment',
            'behavioral-therapy': 'Behavioral Therapy',
            'speech-therapy': 'Speech Therapy',
            'occupational-therapy': 'Occupational Therapy',
            'family-consultation': 'Family Consultation'
        };
        document.getElementById('selected-service').textContent = serviceMap[service] || service;
    }
    
    if (bookingDate) {
        document.getElementById('booking-date').textContent = bookingDate;
    } else {
        document.getElementById('booking-date').textContent = new Date().toLocaleDateString();
    }
    
    // Generate random booking fee between ₱300-₱800
    const randomFee = Math.floor(Math.random() * (800 - 300 + 1)) + 300;
    const bookingFeeElement = document.getElementById('booking-fee');
    bookingFeeElement.textContent = `₱${randomFee}.00`;
    
    // Update button amount as well
    const payButton = document.getElementById('pay-now-btn');
    const currentButtonText = payButton.innerHTML;
    payButton.innerHTML = currentButtonText.replace(/₱\d+\.00/, `₱${randomFee}.00`);
});

// Smooth page entrance animation
document.addEventListener('DOMContentLoaded', () => {
    const paymentContainer = document.querySelector('.payment-container');
    paymentContainer.style.opacity = '0';
    paymentContainer.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        paymentContainer.style.transition = 'all 0.6s ease';
        paymentContainer.style.opacity = '1';
        paymentContainer.style.transform = 'translateY(0)';
    }, 100);
});

console.log('💳 Payment page loaded successfully!'); 