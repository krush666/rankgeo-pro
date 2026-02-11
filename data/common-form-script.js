// Common Form Handler for Rank GEO Pro
// Handles form submissions and displays success/error messages

document.addEventListener('DOMContentLoaded', function() {
    // Find all forms on the page
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
});

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formId = form.id || 'generic-form';
    
    // Show loading state
    const originalButtonContent = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...';
    
    // Get form data
    const formData = new FormData(form);
    const formFields = {};
    formData.forEach((value, key) => {
        // Parse nested form_fields object notation
        if (key.startsWith('form_fields[')) {
            const fieldName = key.match(/form_fields\[(.+)\]/)[1];
            formFields[fieldName] = value;
        } else {
            formFields[key] = value;
        }
    });
    
    // Determine webhook URL based on form or page
    let webhookUrl = 'https://hook.us1.make.com/bbfn5v5ugm55nd4kzbpbkndh1yiv2i9y';
    
    // Try to find a success banner
    let successBanner = document.getElementById('successBanner');
    if (!successBanner) {
        // Create a temporary banner
        successBanner = document.createElement('div');
        successBanner.id = 'successBanner';
        successBanner.style.display = 'block';
        successBanner.style.padding = '12px';
        successBanner.style.borderRadius = '8px';
        successBanner.style.marginTop = '16px';
        successBanner.style.textAlign = 'center';
        successBanner.style.fontWeight = '600';
        form.appendChild(successBanner);
    }
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                form_fields: formFields,
                form_name: formId,
                source: window.location.pathname
            })
        });
        
        if (response.ok) {
            console.log('Form submitted successfully');
            successBanner.style.color = '#4CAF50';
            successBanner.textContent = 'Thank you! Your message has been sent successfully.';
            form.reset();
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        successBanner.style.color = '#f44336';
        successBanner.textContent = 'Error submitting form. Please try again or email us directly at service@rankboost.pro';
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonContent;
        
        // Hide success message after 5 seconds if it was successful
        if (successBanner.style.color === 'rgb(76, 175, 80)') {
            setTimeout(() => {
                successBanner.style.display = 'none';
            }, 5000);
        }
    }
}

// Utility function to show messages
function showFormMessage(formId, message, isSuccess = true) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    let messageEl = form.querySelector('.form-message');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.className = 'form-message';
        messageEl.style.padding = '12px';
        messageEl.style.borderRadius = '8px';
        messageEl.style.marginTop = '16px';
        messageEl.style.textAlign = 'center';
        messageEl.style.fontWeight = '600';
        form.appendChild(messageEl);
    }
    
    messageEl.style.display = 'block';
    messageEl.style.color = isSuccess ? '#4CAF50' : '#f44336';
    messageEl.style.backgroundColor = isSuccess ? '#E8F5E9' : '#FFEBEE';
    messageEl.textContent = message;
}
