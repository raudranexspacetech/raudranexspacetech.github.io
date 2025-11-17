document.addEventListener('DOMContentLoaded', async () => {
    const jobsContainer = document.getElementById('jobs-container');
    const applicationForm = document.getElementById('application-form');
    const jobSelect = document.getElementById('job_select');
    const formMessage = document.getElementById('form-message');

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ngmumkroztcjfxsewrry.supabase.co';
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbXVta3JvenRjamZ4c2V3cnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNjIzMzQsImV4cCI6MjA3ODkzODMzNH0.6hL93ZsmG5EO-nuQDNJ04Mnr8kzW8srNxX-w1sQfch8';

    let jobListings = [];

    async function loadJobListings() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/job_listings?is_active=eq.true&order=created_at.desc`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (response.ok) {
                jobListings = await response.json();
                displayJobListings();
                populateJobSelect();
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
            jobsContainer.innerHTML = '<p class="loading">Unable to load job listings. Please try again later.</p>';
        }
    }

    function displayJobListings() {
        if (jobListings.length === 0) {
            jobsContainer.innerHTML = '<p class="loading">No open positions at this time. Check back soon!</p>';
            return;
        }

        jobsContainer.innerHTML = jobListings.map(job => `
            <div class="job-card">
                <h3>${job.title}</h3>
                <div class="job-meta">
                    <div class="job-meta-item">
                        <span class="job-meta-badge">${job.department}</span>
                    </div>
                    <div class="job-meta-item">
                        <span class="job-meta-badge">${job.employment_type}</span>
                    </div>
                    ${job.experience_level ? `<div class="job-meta-item"><span class="job-meta-badge">${job.experience_level}</span></div>` : ''}
                </div>
                <p><strong>Location:</strong> ${job.location}</p>
                <p>${job.description}</p>
                <p><strong>Requirements:</strong> ${job.requirements}</p>
                ${job.salary_range ? `<p><strong>Salary Range:</strong> ${job.salary_range}</p>` : ''}
            </div>
        `).join('');
    }

    function populateJobSelect() {
        jobSelect.innerHTML = '<option value="">Select a position...</option>' +
            jobListings.map(job => `<option value="${job.id}">${job.title}</option>`).join('');
    }

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }

    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                job_id: document.getElementById('job_select').value,
                name: document.getElementById('app_name').value,
                email: document.getElementById('app_email').value,
                phone: document.getElementById('app_phone').value,
                resume_url: document.getElementById('app_resume').value,
                cover_letter: document.getElementById('app_cover').value || ''
            };

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/career_applications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showMessage('Your application has been submitted successfully!', 'success');
                    applicationForm.reset();
                } else {
                    showMessage('Error submitting application. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Error submitting application. Please try again.', 'error');
            }
        });
    }

    loadJobListings();
});
