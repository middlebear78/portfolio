document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /**
     * Header toggle
     */
    const headerToggleBtn = document.querySelector(".header-toggle");

    function headerToggle() {
        document.querySelector("#header").classList.toggle("header-show");
        headerToggleBtn.classList.toggle("bi-list");
        headerToggleBtn.classList.toggle("bi-x");
    }

    headerToggleBtn.addEventListener("click", headerToggle);

    /**
     * Hide mobile nav on same-page/hash links
     */
    document.querySelectorAll("#navmenu a").forEach((navmenu) => {
        navmenu.addEventListener("click", () => {
            if (document.querySelector(".header-show")) {
                headerToggle();
            }
        });
    });

    /**
     * Toggle mobile nav dropdowns
     */
    document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
        navmenu.addEventListener("click", function (e) {
            e.preventDefault();
            this.parentNode.classList.toggle("active");
            this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
            e.stopImmediatePropagation();
        });
    });

    /**
     * Preloader
     */
    const preloader = document.querySelector("#preloader");
    if (preloader) {
        window.addEventListener("load", () => {
            preloader.remove();
        });
    }

    /**
     * Scroll top button
     */
    let scrollTop = document.querySelector(".scroll-top");

    function toggleScrollTop() {
        if (scrollTop) {
            window.scrollY > 100 ? scrollTop.classList.add("active") : scrollTop.classList.remove("active");
        }
    }

    scrollTop.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });

    window.addEventListener("load", toggleScrollTop);
    document.addEventListener("scroll", toggleScrollTop);

    /**
     * Animation on scroll function and init
     */
    function aosInit() {
        AOS.init({
            duration: 600,
            easing: "ease-in-out",
            once: true,
            mirror: false,
        });
    }

    window.addEventListener("load", aosInit);

    /**
     * Init typed.js
     */
    const selectTyped = document.querySelector(".typed");
    if (selectTyped) {
        let typed_strings = selectTyped.getAttribute("data-typed-items");
        typed_strings = typed_strings.split(",");
        new Typed(".typed", {
            strings: typed_strings,
            loop: true,
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
        });
    }

    /**
     * Initiate Pure Counter
     */
    new PureCounter();

    /**
     * Animate the skills items on reveal
     */
    let skillsAnimation = document.querySelectorAll(".skills-animation");
    skillsAnimation.forEach((item) => {
        new Waypoint({
            element: item,
            offset: "80%",
            handler: function (direction) {
                let progress = item.querySelectorAll(".progress .progress-bar");
                progress.forEach((el) => {
                    el.style.width = el.getAttribute("aria-valuenow") + "%";
                });
            },
        });
    });

    /**
     * Initiate glightbox
     */
    const glightbox = GLightbox({
        selector: ".glightbox",
    });

    /**
     * Init isotope layout and filters
     */
    document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
        let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
        let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
        let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

        let initIsotope;
        imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
            initIsotope = new Isotope(isotopeItem.querySelector(".isotope-container"), {
                itemSelector: ".isotope-item",
                layoutMode: layout,
                filter: filter,
                sortBy: sort,
            });
        });

        isotopeItem.querySelectorAll(".isotope-filters li").forEach(function (filters) {
            filters.addEventListener(
                "click",
                function () {
                    isotopeItem.querySelector(".isotope-filters .filter-active").classList.remove("filter-active");
                    this.classList.add("filter-active");
                    initIsotope.arrange({
                        filter: this.getAttribute("data-filter"),
                    });
                    if (typeof aosInit === "function") {
                        aosInit();
                    }
                },
                false
            );
        });
    });

    /**
     * Init swiper sliders
     */
    function initSwiper() {
        document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
            let config = JSON.parse(swiperElement.querySelector(".swiper-config").innerHTML.trim());

            if (swiperElement.classList.contains("swiper-tab")) {
                initSwiperWithCustomPagination(swiperElement, config);
            } else {
                new Swiper(swiperElement, config);
            }
        });
    }

    window.addEventListener("load", initSwiper);

    /**
     * Correct scrolling position upon page load for URLs containing hash links.
     */
    window.addEventListener("load", function (e) {
        if (window.location.hash) {
            if (document.querySelector(window.location.hash)) {
                setTimeout(() => {
                    let section = document.querySelector(window.location.hash);
                    let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
                    window.scrollTo({
                        top: section.offsetTop - parseInt(scrollMarginTop),
                        behavior: "smooth",
                    });
                }, 100);
            }
        }
    });

    /**
     * Navmenu Scrollspy
     */
    let navmenulinks = document.querySelectorAll(".navmenu a");

    function navmenuScrollspy() {
        navmenulinks.forEach((navmenulink) => {
            if (!navmenulink.hash) return;
            let section = document.querySelector(navmenulink.hash);
            if (!section) return;
            let position = window.scrollY + 200;
            if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
                document.querySelectorAll(".navmenu a.active").forEach((link) => link.classList.remove("active"));
                navmenulink.classList.add("active");
            } else {
                navmenulink.classList.remove("active");
            }
        });
    }

    window.addEventListener("load", navmenuScrollspy);
    document.addEventListener("scroll", navmenuScrollspy);

    /**
     * Filter Projects based on name search and tags
     */
    const nameSearch = document.getElementById("name-search");
    const tags = document.querySelectorAll(".tag");
    const projects = document.querySelectorAll(".portfolio-item");

    function filterProjects() {
        const nameQuery = nameSearch.value.toLowerCase();

        projects.forEach((project) => {
            const name = project.getAttribute("data-name");
            const nameMatch = name.includes(nameQuery);

            if (nameMatch) {
                project.style.display = "";
            } else {
                project.style.display = "none";
            }
        });
    }

    tags.forEach((tag) => {
        tag.addEventListener("click", function () {
            const selectedTag = this.getAttribute("data-tag");

            projects.forEach((project) => {
                const projectTags = project.getAttribute("data-tags");
                if (projectTags.includes(selectedTag)) {
                    project.style.display = "";
                } else {
                    project.style.display = "none";
                }
            });
        });
    });

    nameSearch.addEventListener("keyup", filterProjects);

    /**
     * Handle form submission
     */
    const form = document.querySelector(".contact-form");
    const loadingDiv = form.querySelector(".loading");
    const errorDiv = form.querySelector(".error-message");
    const sentDiv = form.querySelector(".sent-message");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Show loading
        loadingDiv.classList.remove("d-none");
        errorDiv.style.display = "none";
        sentDiv.classList.add("d-none"); // Make sure to hide sent message initially

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
                },
            });

            const data = await response.json();
            console.log(data); // Log the response to see what is returned

            if (data.success) {
                // Success: Hide loading and show success message
                loadingDiv.classList.add("d-none");
                sentDiv.classList.remove("d-none"); // Show the sent message
                form.reset(); // Reset the form fields
            } else {
                // Error: Display error message
                throw new Error(data.message || "Something went wrong");
            }
        } catch (error) {
            loadingDiv.classList.add("d-none");
            errorDiv.style.display = "block";
            errorDiv.textContent = error.message;
        }
    });
});
const form = document.getElementById("contact-form");

form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    const formData = new FormData(form);

    fetch("/send-contact-email/", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                // If success, display success message
                showMessage(data.message, "success");
            } else {
                // If error, display error message
                showMessage(data.message, "danger");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            showMessage("An unexpected error occurred.", "danger");
        });
});

// Show a message in the UI (you can modify this to fit your design)
function showMessage(message, type) {
    const alertContainer = document.querySelector(".alert-container");
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert", `alert-${type}`);
    alertDiv.textContent = message;
    alertContainer.appendChild(alertDiv);

    // Remove the alert after 5 seconds (optional)
    setTimeout(() => alertDiv.remove(), 5000);
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("name-search");
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    searchInput.addEventListener("input", function (e) {
        const searchTerm = e.target.value.toLowerCase();

        portfolioItems.forEach((item) => {
            const projectName = item.dataset.name;
            const projectTags = item.dataset.tags;
            const matchesSearch = projectName.includes(searchTerm) || projectTags.includes(searchTerm);

            item.style.display = matchesSearch ? "block" : "none";
        });
    });
});
function initHeader() {
    const headerToggle = document.querySelector('.header-toggle');
    const header = document.querySelector('#header');
    
    if (headerToggle) {
        headerToggle.addEventListener('click', function(e) {
            header.classList.toggle('header-active');
        });
    }

   
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If it's a mobile view, close the menu
            if (window.innerWidth < 1200) { // xl breakpoint
                header.classList.remove('header-active');
            }
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    // Your other initializations...
});

document.addEventListener('DOMContentLoaded', function() {
    // Navigation handling
    const navLinks = document.querySelectorAll('.navmenu a');
    const header = document.querySelector('.header');
    const headerToggle = document.querySelector('.header-toggle');

    // Handle mobile menu toggle
    if (headerToggle) {
        headerToggle.addEventListener('click', function() {
            header.classList.toggle('header-active');
        });
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');

            // If we're on a different page than home
            if (window.location.pathname !== '/') {
                // Let the link work normally to navigate to home page with anchor
                return true;
            }

            // If we're on home page
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Smooth scroll to target
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    
                    // Close mobile menu if open
                    if (window.innerWidth < 1200) {
                        header.classList.remove('header-active');
                    }
                }
            }
        });
    });

    // Handle active state on scroll (for home page)
    if (window.location.pathname === '/') {
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const scrollY = window.scrollY;

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    const correspondingLink = document.querySelector(`.navmenu a[href="#${section.id}"]`);
                    if (correspondingLink) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        correspondingLink.classList.add('active');
                    }
                }
            });
        });
    }
});