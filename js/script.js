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
    showTestimonial(currentTestimonial);
}

// Initialize by showing the first testimonial
showTestimonial(currentTestimonial);
document.addEventListener("DOMContentLoaded", function () {
    const storyTitle = document.getElementById("storyTitle");
    const storyContent = document.getElementById("storyEditor"); // Updated to match text editor
    const saveBtn = document.getElementById("saveStory");
    const deleteBtn = document.getElementById("deleteStory");
    const wordWarning = document.getElementById("wordWarning");

    // Load saved story from local storage
    if (localStorage.getItem("storyTitle")) {
        storyTitle.value = localStorage.getItem("storyTitle");
    }
    if (localStorage.getItem("storyContent")) {
        storyContent.innerText = localStorage.getItem("storyContent");
    }

    // Auto-save function
    function autoSave() {
        localStorage.setItem("storyTitle", storyTitle.value);
        localStorage.setItem("storyContent", storyContent.innerText);
        showStatus("Story auto-saved...");
    }

    // Save story manually
    saveBtn.addEventListener("click", function () {
        let text = storyContent.innerText.trim();
        let wordCount = text.split(/\s+/).length;

        if (wordCount > 1000) {
            wordWarning.style.display = "block";
            wordWarning.innerText = "⚠️ You have exceeded the 1000-word limit!";
            return;
        } else {
            wordWarning.style.display = "none";
        }

        localStorage.setItem("storyTitle", storyTitle.value);
        localStorage.setItem("storyContent", storyContent.innerText);
        showStatus("Story saved!");

        // Check if user is logged in
        let isLoggedIn = localStorage.getItem("userLoggedIn");

        if (!isLoggedIn) {
            alert("Please log in first to view your story.");
            window.location.href = "login.html";
        } else {
            window.location.href = "storybook.html";
        }
    });

    // Delete story
    deleteBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this story?")) {
            localStorage.removeItem("storyTitle");
            localStorage.removeItem("storyContent");
            storyTitle.value = "";
            storyContent.innerText = "";
            showStatus("Story deleted.");
        }
    });

    // Auto-save every 5 seconds
    setInterval(autoSave, 5000);

    // Live Word Count Checker
    storyContent.addEventListener("input", function () {
        let text = storyContent.innerText.trim();
        let wordCount = text.split(/\s+/).length;

        if (wordCount > 1000) {
            wordWarning.style.display = "block";
            wordWarning.innerText = "⚠️ Word limit exceeded (Max 1000 words)!";
            let trimmedText = text.split(/\s+/).slice(0, 1000).join(" ");
            storyContent.innerText = trimmedText;
        } else {
            wordWarning.style.display = "none";
        }
    });

    // Show status messages smoothly
    function showStatus(message) {
        const status = document.getElementById("statusMessage");
        status.textContent = message;
        status.style.opacity = 1;
        setTimeout(() => {
            status.style.opacity = 0;
        }, 2000);
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const editor = document.getElementById("storyEditor");
    const wordWarning = document.getElementById("wordWarning");
    let wordLimit = 1000;

    // Load saved story
    let savedStory = localStorage.getItem("savedStory");
    if (savedStory) {
        editor.innerHTML = savedStory;
    }

    // Auto-save function
    function autoSave() {
        localStorage.setItem("savedStory", editor.innerHTML);
    }

    // Count words and display warning if needed
    function countWords() {
        let text = editor.innerText.trim();
        let words = text.split(/\s+/).filter(word => word.length > 0);
        
        if (words.length >= wordLimit) {
            wordWarning.style.display = "block";
        } else {
            wordWarning.style.display = "none";
        }
    }

    // Save story manually
    window.saveStory = function () {
        autoSave();
        alert("Story saved successfully!");
        window.location.href = "book.html"; // Navigate to book page
    }

    // Clear editor content
    window.clearEditor = function () {
        if (confirm("Are you sure you want to clear your story?")) {
            editor.innerHTML = "";
            autoSave();
        }
    }

    // Listen for input changes
    editor.addEventListener("input", function () {
        countWords();
        autoSave();
    });
});
// template
const templates = {
    fantasy: "Once upon a time in a mystical kingdom...",
    "sci-fi": "In the year 3045, humanity discovered a portal to another dimension..."
};

function applyTemplate() {
    let selectedTemplate = document.getElementById("storyTemplate").value;
    document.getElementById("storyEditor").innerText = templates[selectedTemplate] || "";
}
