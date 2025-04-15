const storiesContainer = document.getElementById("storiesContainer");

document.addEventListener('DOMContentLoaded', async () => {
  const profileSection = document.getElementById('profileSection');

  // Retrieve stored authentication details
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  if (!userId || !token) {
    profileSection.innerHTML = `<a href="login.html" class="loginBtn cta-button">Login</a>`;
    return;
  }

  try {
    // Fetch user profile from backend
    const response = await fetch(`https://storybanaaobackend.onrender.com/api/users/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Failed to fetch profile data!');

    const { profilePicture, username } = await response.json();

    // Populate profile section
    profileSection.innerHTML = `
      <div id="profileSection">
        <div class="userP">
          <img src="${profilePicture || 'default-profile.png'}" alt="Profile Picture" class="profile-pic">
          <span>${username || 'User'}</span>
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

  // AOS Init
  AOS.init();

  // Fetch stories
  await fetchStories();
});

// Function to fetch and display stories
async function fetchStories() {
  try {
    storiesContainer.innerHTML = "<p>Loading stories...</p>";

    const response = await fetch("https://storybanaaoBackend.onrender.com/api/stories");
    const stories = await response.json();
    console.log(stories);

    storiesContainer.innerHTML = "";

    stories.forEach((story, index) => {
      console.log(story);
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
          <span>✍️ by <a href="profile.html?user=${story.author._id}">${story.author._id}</a></span>
        </div>
        <div class="card__footer">
          <button class="card__footer__btn" data-index="${index}">View</button>
        </div>
      `;

      // Attach event listener to the "View" button
      const viewBtn = storyCard.querySelector(".card__footer__btn");
      viewBtn.addEventListener("click", () => {
        openModal(story);
      });

      storiesContainer.appendChild(storyCard);
    });

    AOS.init();

  } catch (error) {
    console.error("Error fetching stories:", error);
    storiesContainer.innerHTML = "<p>Failed to load stories. Please try again later.</p>";
  }
}

// Modal logic
const modal = document.getElementById("story-modal");
const modalBanner = document.getElementById("modal-banner");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const closeBtn = document.querySelector(".close-btn");
const modalAuthor = document.querySelector(".author");

function openModal(story) {
  modalBanner.src = story.storyBanner;
  modalBanner.onerror = () => {
    modalBanner.src = 'default-banner.jpg';
  };
  modalTitle.textContent = story.storyName;
  modalContent.textContent = story.storyContent;
  modalAuthor.textContent = `✍️ by ${story.author}`;
  modal.style.display = "block";
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Particles.js configuration
particlesJS("particles-js", {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#ffffff"
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000"
      }
    },
    opacity: {
      value: 0.8,
      random: true,
      anim: {
        enable: true,
        speed: 0.5,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 2,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      },
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      }
    }
  },
  retina_detect: true
});
