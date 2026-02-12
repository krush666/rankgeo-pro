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
    
    // Check for reCAPTCHA (if present on the form)
    const recaptchaElement = form.querySelector('.g-recaptcha');
    let recaptchaResponse = '';
    
    if (recaptchaElement && typeof grecaptcha !== 'undefined') {
        recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            successBanner.style.display = 'block';
            successBanner.textContent = 'Please complete the reCAPTCHA verification.';
            successBanner.style.color = '#f44336';
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonContent;
            return;
        }
    }
    
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
    
    // Build the payload
    const payload = {
        form_fields: formFields,
        form_name: formId,
        source: window.location.pathname
    };
    
    // Add reCAPTCHA token if present
    if (recaptchaResponse) {
        payload.recaptcha_token = recaptchaResponse;
    }
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            console.log('Form submitted successfully');
            
            // Get user's name for personalization
            const userName = formFields.name || formFields.Name || 'there';
            const firstName = userName.split(' ')[0];
            
            // Hide form fields and show success message
            const formContent = form.querySelector('.space-y-5');
            if (formContent) {
                formContent.style.display = 'none';
            }
            
            // Create styled success message
            const successDiv = document.createElement('div');
            successDiv.className = 'text-center py-8 px-4';
            successDiv.innerHTML = `
                <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                    <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-[#1A1A2E] mb-2">Thanks ${firstName}!</h3>
                <p class="text-gray-600 mb-4">Your message has been received. I'll review it and get back to you within 48 hours.</p>
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <p class="text-gray-700 text-sm">
                        <strong class="text-[#FF6B35]">Need urgent assistance?</strong><br>
                        Contact Jeremy directly at <a href="tel:+1800732626687" class="text-[#FF6B35] font-semibold hover:underline">+1 (800) SEO-BOOST</a>
                    </p>
                </div>
                <p class="text-gray-500 text-sm">In the meantime, feel free to explore our <a href="rank_geo_ai_blog.html" class="text-[#FF6B35] hover:underline">GEO Blog</a> for the latest AI search insights.</p>
            `;
            
            form.appendChild(successDiv);
            
            // Reset reCAPTCHA if present
            if (recaptchaElement && typeof grecaptcha !== 'undefined') {
                grecaptcha.reset();
            }
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
