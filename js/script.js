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
});
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
}
showTestimonial(currentTestimonial);


// editor section
// Select elements
const storyContent = document.getElementById("storyContent");
const boldBtn = document.getElementById("boldBtn");
const italicBtn = document.getElementById("italicBtn");
const underlineBtn = document.getElementById("underlineBtn");
const addChoiceBtn = document.getElementById("addChoice");
const saveDraftBtn = document.getElementById("saveDraft");
const publishStoryBtn = document.getElementById("publishStory");

// Function to apply formatting
function applyFormat(command) {
    document.execCommand(command, false, null);
}

boldBtn.addEventListener("click", () => applyFormat("bold"));
italicBtn.addEventListener("click", () => applyFormat("italic"));
underlineBtn.addEventListener("click", () => applyFormat("underline"));

// Function to add a choice section
addChoiceBtn.addEventListener("click", () => {
    const choice = document.createElement("div");
    choice.classList.add("choice-block");
    choice.contentEditable = true;
    choice.innerText = "Type your choice here...";
    storyContent.appendChild(choice);
});

// Save Draft (Temporary in LocalStorage)
saveDraftBtn.addEventListener("click", () => {
    localStorage.setItem("draftStory", storyContent.innerHTML);
    alert("Draft saved!");
});

// Load saved draft if exists
window.addEventListener("load", () => {
    const savedStory = localStorage.getItem("draftStory");
    if (savedStory) {
        storyContent.innerHTML = savedStory;
    }
});

// Publish Story (Placeholder functionality)
publishStoryBtn.addEventListener("click", () => {
    alert("Story published (backend integration needed)!");
});


// for redirection
// Publish Story (Redirect after publishing)
publishStoryBtn.addEventListener("click", () => {
    alert("Story published (backend integration needed)!");
    
    // Redirect to another page (modify URL as needed)
    window.location.href = "published_stories.html"; 
});
