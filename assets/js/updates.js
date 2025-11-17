document.addEventListener('DOMContentLoaded', async () => {
    const updatesContainer = document.getElementById('updates-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articleModal = document.getElementById('article-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ngmumkroztcjfxsewrry.supabase.co';
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbXVta3JvenRjamZ4c2V3cnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNjIzMzQsImV4cCI6MjA3ODkzODMzNH0.6hL93ZsmG5EO-nuQDNJ04Mnr8kzW8srNxX-w1sQfch8';

    let allPosts = [];
    let currentFilter = 'all';

    async function loadBlogPosts() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?is_published=eq.true&order=published_at.desc`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (response.ok) {
                allPosts = await response.json();
                displayPosts(allPosts);
            }
        } catch (error) {
            console.error('Error loading blog posts:', error);
            updatesContainer.innerHTML = '<p class="loading">Unable to load updates. Please try again later.</p>';
        }
    }

    function displayPosts(posts) {
        if (posts.length === 0) {
            updatesContainer.innerHTML = '<p class="loading">No updates available at this time.</p>';
            return;
        }

        updatesContainer.innerHTML = posts.map(post => {
            const date = new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            return `
                <div class="update-card" data-id="${post.id}">
                    <span class="category-badge">${post.category || 'Update'}</span>
                    <h3>${post.title}</h3>
                    <p class="excerpt">${post.excerpt || post.content.substring(0, 150) + '...'}</p>
                    <p class="date">${date}</p>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.update-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const post = allPosts.find(p => p.id === id);
                if (post) showArticle(post);
            });
        });
    }

    function filterPosts(category) {
        if (category === 'all') {
            displayPosts(allPosts);
        } else {
            const filtered = allPosts.filter(post => post.category === category);
            displayPosts(filtered);
        }
    }

    function showArticle(post) {
        const date = new Date(post.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const content = document.querySelector('.article-content');
        content.innerHTML = `
            <h2>${post.title}</h2>
            <div class="article-meta">
                <span>By ${post.author}</span> | <span>${date}</span>
            </div>
            ${post.content}
        `;

        articleModal.classList.remove('modal-hidden');
    }

    function hideArticle() {
        articleModal.classList.add('modal-hidden');
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            filterPosts(currentFilter);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', hideArticle);
    }

    articleModal.addEventListener('click', (e) => {
        if (e.target === articleModal) hideArticle();
    });

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[name="email"]').value;
            const message = document.getElementById('newsletter-message');

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_inquiries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`
                    },
                    body: JSON.stringify({
                        name: 'Newsletter Subscriber',
                        email: email,
                        subject: 'Newsletter Subscription',
                        message: 'Subscribed to newsletter'
                    })
                });

                if (response.ok) {
                    message.textContent = 'Thank you for subscribing!';
                    message.className = 'form-message success';
                    newsletterForm.reset();
                    setTimeout(() => {
                        message.className = 'form-message';
                    }, 5000);
                } else {
                    message.textContent = 'Error subscribing. Please try again.';
                    message.className = 'form-message error';
                }
            } catch (error) {
                console.error('Error:', error);
                message.textContent = 'Error subscribing. Please try again.';
                message.className = 'form-message error';
            }
        });
    }

    loadBlogPosts();
});
