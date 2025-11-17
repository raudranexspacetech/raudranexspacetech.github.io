document.addEventListener('DOMContentLoaded', async () => {
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-message');

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ngmumkroztcjfxsewrry.supabase.co';
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbXVta3JvenRjamZ4c2V3cnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNjIzMzQsImV4cCI6MjA3ODkzODMzNH0.6hL93ZsmG5EO-nuQDNJ04Mnr8kzW8srNxX-w1sQfch8';

    function showMessage(text, type) {
        contactMessage.textContent = text;
        contactMessage.className = `form-message ${type}`;
        setTimeout(() => {
            contactMessage.className = 'form-message';
        }, 5000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value || '',
                company: document.getElementById('company').value || '',
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_inquiries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showMessage('Thank you! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                } else {
                    showMessage('Error sending message. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Error sending message. Please try again.', 'error');
            }
        });
    }
});
