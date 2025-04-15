

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");

const profileHeader = document.getElementById("profileHeader");
const profileStories = document.getElementById("profileStories");

async function fetchProfileData() {
  try {
    profileHeader.innerHTML = "<p>Loading profile...</p>";

    // Fetch user info
    const userRes = await fetch(`https://storybanaaoBackend.onrender.com/api/users/${username}`);
    const user = await userRes.json();

    // Display user profile
    profileHeader.innerHTML = `
      <div class="profile-info" data-aos="fade-in">
        <img src="${user.avatar || 'default-avatar.png'}" class="profile-avatar" />
        <div class="profile-text">
          <h1>${user.username}</h1>
          <p>${user.bio || "This author hasn’t added a bio yet."}</p>
          <small>Joined on ${new Date(user.createdAt).toLocaleDateString()}</small>
        </div>
      </div>
    `;

    // Fetch stories by user
    profileStories.innerHTML = "<p>Loading stories...</p>";

    const storyRes = await fetch(`https://storybanaaoBackend.onrender.com/api/stories/user/${username}`);
    const stories = await storyRes.json();

    if (stories.length === 0) {
      profileStories.innerHTML = "<p>This user hasn't written any stories yet.</p>";
      return;
    }

    profileStories.innerHTML = "";

    stories.forEach((story, index) => {
      const storyCard = document.createElement("div");
      storyCard.className = "card stories__card card--padding0";
      storyCard.setAttribute("data-aos", "fade-up");
      storyCard.setAttribute("data-aos-delay", `${index * 100}`);

      storyCard.innerHTML = `
        <div class="card__header">
          <img src="${story.storyBanner}" alt="Story Banner" class="card__header__banner" />
        </div>
        <div class="stories__card__body">
          <h2 style="text-align: left; text-transform: uppercase">${story.storyName}</h2>
          <div class="card__story">${story.storyContent.slice(0, 150)}...</div>
        </div>
      `;

      profileStories.appendChild(storyCard);
    });

    AOS.init();

  } catch (error) {
    console.error("Profile load error:", error);
    profileHeader.innerHTML = "<p>Failed to load profile.</p>";
    profileStories.innerHTML = "";
  }
}

fetchProfileData();
