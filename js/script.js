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

    // ================== STORY EDITOR FEATURES ==================
    const storyContent = document.getElementById("storyContent");
    const boldBtn = document.getElementById("boldBtn");
    const italicBtn = document.getElementById("italicBtn");
    const underlineBtn = document.getElementById("underlineBtn");
    const strikeBtn = document.getElementById("strikeBtn");
    const bulletList = document.getElementById("bulletList");
    const numberList = document.getElementById("numberList");
    const clearFormatting = document.getElementById("clearFormatting");
    const addChoiceBtn = document.getElementById("addChoice");
    const saveDraftBtn = document.getElementById("saveDraft");
    const publishStoryBtn = document.getElementById("publishStory");
    const darkModeToggle = document.getElementById("darkModeToggle");

    // Create and display word count
    const wordCount = document.createElement("p");
    wordCount.id = "wordCount";
    wordCount.style.marginTop = "10px";
    storyContent?.parentNode.appendChild(wordCount);

    function updateWordCount() {
        const text = storyContent.innerText.trim();
        const words = text.split(/\s+/).filter(word => word.length > 0);
        wordCount.innerText = `Word Count: ${words.length}`;
    }

    function applyFormat(command) {
        document.execCommand(command, false, null);
    }

    [boldBtn, italicBtn, underlineBtn, strikeBtn, bulletList, numberList, clearFormatting].forEach(button => {
        button?.addEventListener("click", () => applyFormat(button.id.replace("Btn", "")));
    });

    function addChoice() {
        const lastChoice = storyContent.querySelector(".choice-text:last-child");
        if (lastChoice && lastChoice.innerText.trim() === "Type your choice here...") {
            lastChoice.focus();
            return;
        }

        const choiceContainer = document.createElement("div");
        choiceContainer.classList.add("choice-block");

        const choiceInput = document.createElement("div");
        choiceInput.contentEditable = true;
        choiceInput.innerText = "Type your choice here...";
        choiceInput.classList.add("choice-text");

        const removeChoice = document.createElement("button");
        removeChoice.innerText = "❌";
        removeChoice.classList.add("remove-choice");
        removeChoice.addEventListener("click", () => choiceContainer.remove());

        choiceContainer.appendChild(choiceInput);
        choiceContainer.appendChild(removeChoice);
        storyContent.appendChild(choiceContainer);
        choiceInput.focus();
    }

    addChoiceBtn?.addEventListener("click", addChoice);

    setInterval(() => {
        if (storyContent.innerHTML !== localStorage.getItem("draftStory")) {
            localStorage.setItem("draftStory", storyContent.innerHTML);
        }
    }, 5000);

    saveDraftBtn?.addEventListener("click", () => {
        localStorage.setItem("draftStory", storyContent.innerHTML);
        alert("Draft saved!");
    });

    window.addEventListener("load", () => {
        const savedStory = localStorage.getItem("draftStory");
        if (savedStory) {
            storyContent.innerHTML = savedStory;
            updateWordCount();
        }
    });

    storyContent?.addEventListener("input", updateWordCount);

    publishStoryBtn?.addEventListener("click", () => {
        alert("Story published successfully!");
        window.location.href = "index.html";
    });

    if (darkModeToggle) {
        if (localStorage.getItem("darkMode") === "enabled") {
            document.body.classList.add("dark-mode");
        }

        darkModeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
        });
    }
});
