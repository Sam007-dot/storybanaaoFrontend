
const storiesContainer = document.getElementById("sotriesContainer");

document.addEventListener('DOMContentLoaded', async () => {
    const profileSection = document.getElementById('profileSection');

    // Retrieve stored authentication details
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (userId && token) {
        try {
            // Fetch user profile from backend
            const response = await fetch(`https://storybanaaobackend.onrender.com/api/users/profile/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch profile data!');

            const { profilePicture, name } = await response.json();

            // Populate profile section
            profileSection.innerHTML = `
                <div id="profileSection">
                    <div class="userP">
                        <img src="${profilePicture || 'default-profile.png'}" alt="Profile Picture" class="profile-pic">
                        <span>${name || 'User'}</span>
                    </div>
                    <button class="cta-button logoutBtn">Logout</button>
                </div>
            `;

            // Logout function
            document.querySelector('.logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                location.reload(); // Refresh page
            });

        } catch (error) {
            console.error('Profile Fetch Error:', error);
            profileSection.innerHTML = `<a href="login.html" class="loginBtn cta-button">Login</a>`;
        }
    } else {
        profileSection.innerHTML = `<a href="login.html" class="loginBtn cta-button">Login</a>`;
    }

    // ================== TESTIMONIAL SLIDER ==================
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-item');
    const totalTestimonials = testimonials.length;

    function showTestimonial(index) {
        testimonials.forEach((item, i) => {
            item.style.display = i === index ? 'block' : 'none';
        });
    }

    function changeTestimonial(direction) {
        currentTestimonial += direction;
        if (currentTestimonial >= totalTestimonials) {
            currentTestimonial = 0;
        } else if (currentTestimonial < 0) {
            currentTestimonial = totalTestimonials - 1;
        }
        showTestimonial(currentTestimonial);
    }

    document.querySelector(".prev")?.addEventListener("click", () => changeTestimonial(-1));
    document.querySelector(".next")?.addEventListener("click", () => changeTestimonial(1));
    setInterval(() => changeTestimonial(1), 5000);
    showTestimonial(currentTestimonial);

});


async function fetchStories() {
    try {
      const response = await fetch("https://storybanaaoBackend.onrender.com/api/stories");
      const stories = await response.json();
  
      storiesContainer.innerHTML = ""; // Clear previous storys
  
      stories.forEach((story, index) => {
        const storyCard = document.createElement("div");
        storyCard.className = "card stories__card card--padding0";
        
        // Add AOS attributes for animation
        storyCard.setAttribute("data-aos", "fade-up"); // Animation type
        storyCard.setAttribute("data-aos-delay", `${index * 100}`); // Staggered animation delay
  
        storyCard.innerHTML = `
          <div class="card__header">
            <img src="${story.storyBanner}" alt="Story Banner" class="card__header__banner" />
          </div>
          <div class="stories__card__body">
            <h3 style="text-align: center">${story.storyName}</h3>
            <div class="card__story">${story.storyContent}</div>
          </div>
          <div class="card__footer">
            <button class="card__footer__btn">Interested</button>
          </div>
        `;
  
        storiesContainer.appendChild(storyCard);
      });
  
      // Reinitialize AOS after adding new elements
      AOS.init();
      
    } catch (error) {
      console.error("Error fetching storys:", error);
    }
  }
  
  // Initialize AOS on Page Load
  document.addEventListener("DOMContentLoaded", () => {
    AOS.init();
  });
  
  
  // Fetch storys on page load
  fetchStories();
