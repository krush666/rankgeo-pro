// Form Handler - Sends form data to Make.com webhook
// Add this to your HTML pages before </body>:
//   <script src="data/form-handler.js"></script>

document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form[data-make-webhook]');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const webhookUrl = form.getAttribute('data-make-webhook');
            const submitBtn = form.querySelector('button[type="submit"]');
            const successBanner = form.querySelector('.success-banner') || document.createElement('div');
            
            // Collect form data
            const formData = new FormData(form);
            const data = {
                source: window.location.href,
                timestamp: new Date().toISOString(),
                form_name: form.getAttribute('name') || 'Contact Form'
            };
            
            formData.forEach(function(value, key) {
                // Handle nested form_fields format
                if (key.includes('[')) {
                    const match = key.match(/form_fields\[(.+)\]/);
                    if (match) {
                        data.form_fields = data.form_fields || {};
                        data.form_fields[match[1]] = value;
                    }
                } else {
                    data[key] = value;
                }
            });
            
            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            }
            
            successBanner.style.display = 'block';
            successBanner.textContent = 'Sending...';
            successBanner.style.color = '#ffffff';
            successBanner.className = 'success-banner p-3 rounded mb-4 text-center';
            
            // Send to Make.com webhook
            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(function(response) {
                if (response.ok) {
                    successBanner.textContent = 'Thank you! Your message has been sent successfully.';
                    successBanner.style.backgroundColor = '#d4edda';
                    successBanner.style.color = '#155724';
                    form.reset();
                } else {
                    throw new Error('Submission failed');
                }
            })
            .catch(function(error) {
                console.error('Form error:', error);
                successBanner.textContent = 'Error sending message. Please try again or email us directly.';
                successBanner.style.backgroundColor = '#f8d7da';
                successBanner.style.color = '#721c24';
            })
            .finally(function() {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message';
                }
                
                // Auto-hide success message after 10 seconds
                setTimeout(function() {
                    successBanner.style.display = 'none';
                }, 10000);
            });
        });
    });
});
