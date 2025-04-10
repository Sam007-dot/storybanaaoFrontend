const storiesContainer = document.getElementById("storiesContainer");
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


// particlesJS("particles-js", {
//     particles: {
//         number: { value: 100 },
//         shape: { type: "circle" },
//         opacity: { value: 0.5 },
//         size: { value: 2 },
//         move: { speed: 1 }
//     }
// });





// 🚀------------------- USER REGISTRATION HANDLER -------------------🚀
document.getElementById("story-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page refresh

    try {
        // 📝 Collect form inputs
        const title = document.getElementById("editor-title").value.trim();
        const content = document.getElementById("editor-content").value.trim();

        if (!title || !content) {
            alert("🚫 Title and Content cannot be empty!");
            return;
        }

        // 🌐 Send request to backend
        const response = await fetch("https://storybanaaoBackend.onrender.com/api/stories/write", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content }),
        });

        // ✅ Handle response
        if (response.ok) {
            alert("🎉 Story submitted successfully!");
            localStorage.clear(); // Clear saved draft after submission
            window.location.href = "index.html"; // Redirect after successful submission
        } else {
            const errorData = await response.json();
            alert(`❌ Submission failed: ${errorData.error || "Please try again."}`);
        }
    } catch (error) {
        console.error("Submission Error:", error);
        alert("🚫 An error occurred. Please try again.");
    }
});
// // Auto-save every 5 seconds
// setInterval(() => {
//     localStorage.setItem("storyTitle", document.getElementById("editor-title").value.trim());
//     localStorage.setItem("storyContent", document.getElementById("editor-content").value.trim());
// }, 5000);

// // Load saved data when the page opens
// window.addEventListener("load", () => {
//     document.getElementById("editor-title").value = localStorage.getItem("storyTitle") || "";
//     document.getElementById("editor-content").value = localStorage.getItem("storyContent") || "";
// });


document.addEventListener('DOMContentLoaded', async () => {
    const storyId = document.getElementById('storyId').value;
      const iframe = document.getElementById('pdfFrame');
      iframe.src = `https://storybanaaoBackend.onrender.com/api/stories/pdf/67ee913582894782a0beee63`;
});

async function fetchStories() {
    try {
      const response = await fetch("https://storybanaaoBackend.onrender.com/api/stories/allstories");
      const stories = await response.json();
  
      storiesContainer.innerHTML = ""; // Clear previous Stories
  
      stories.forEach((story) => {
        const storyCard = document.createElement("div");
        storyCard.className = "card  stories__card card--padding0";
        storyCard.innerHTML = `
          <div class="card__header">
            <img src="${story.thumbnail}" alt="story Banner" class="card__header__banner" />
          </div>
          <div class="stories__card__body">
            <h3 style="text-align: center">${story.title}</h3>
            <div class="card__plan">${story.content}</div>
          </div>
          <div class="card__footer">
            <button class="card__footer__btn btn--white">Subscribe</button>
          </div>
        `;
  
        StoriesContainer.appendChild(planCard);
      });
    } catch (error) {
      console.error("Error fetching Stories:", error);
    }
  }
  
  // Fetch Stories on page load
  fetchStories();