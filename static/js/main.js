document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector(".header-toggle");
  const header = document.querySelector("#header");

  function headerToggle() {
    header.classList.toggle("header-show");
    header.classList.toggle("header-active");
    headerToggleBtn.classList.toggle("bi-list");
    headerToggleBtn.classList.toggle("bi-x");
  }

  if (headerToggleBtn) {
    headerToggleBtn.addEventListener("click", headerToggle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  const navLinks = document.querySelectorAll("#navmenu a, .navmenu a");
  navLinks.forEach((navmenu) => {
    navmenu.addEventListener("click", (e) => {
      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      navmenu.classList.add("active");

      if (document.querySelector(".header-show")) {
        headerToggle();
      }

      // Handle smooth scrolling for home page
      if (
        window.location.pathname === "/" &&
        navmenu.getAttribute("href").startsWith("#")
      ) {
        e.preventDefault();
        const targetId = navmenu.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });

          if (window.innerWidth < 1200) {
            header.classList.remove("header-active");
          }
        }
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
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    window.addEventListener("load", toggleScrollTop);
    document.addEventListener("scroll", toggleScrollTop);
  }

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
      initIsotope = new Isotope(
        isotopeItem.querySelector(".isotope-container"),
        {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        }
      );
    });

    isotopeItem
      .querySelectorAll(".isotope-filters li")
      .forEach(function (filters) {
        filters.addEventListener(
          "click",
          function () {
            isotopeItem
              .querySelector(".isotope-filters .filter-active")
              .classList.remove("filter-active");
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
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

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
   * Handle active state on scroll (for home page)
   */
  if (window.location.pathname === "/") {
    window.addEventListener("scroll", function () {
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const scrollY = window.scrollY;

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          const correspondingLink = document.querySelector(
            `.navmenu a[href="#${section.id}"]`
          );
          if (correspondingLink) {
            navLinks.forEach((l) => l.classList.remove("active"));
            correspondingLink.classList.add("active");
          }
        }
      });
    });
  }

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
      const projectTags = project.getAttribute("data-tags");
      const matchesSearch =
        name.includes(nameQuery) || projectTags.includes(nameQuery);

      project.style.display = matchesSearch ? "" : "none";
    });
  }

  if (nameSearch) {
    nameSearch.addEventListener("keyup", filterProjects);
    nameSearch.addEventListener("input", filterProjects);
  }

  if (tags) {
    tags.forEach((tag) => {
      tag.addEventListener("click", function () {
        const selectedTag = this.getAttribute("data-tag");

        projects.forEach((project) => {
          const projectTags = project.getAttribute("data-tags");
          project.style.display = projectTags.includes(selectedTag)
            ? ""
            : "none";
        });
      });
    });
  }

  /**
   * Handle form submission
   */
  const form = document.querySelector(".contact-form");

  if (form) {
    const loadingDiv = form.querySelector(".loading");
    const errorDiv = form.querySelector(".error-message");
    const sentDiv = form.querySelector(".sent-message");

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Show loading
      loadingDiv.classList.remove("d-none");
      errorDiv.style.display = "none";
      sentDiv.classList.add("d-none");

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

        if (data.success) {
          loadingDiv.classList.add("d-none");
          sentDiv.classList.remove("d-none");
          form.reset();
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (error) {
        loadingDiv.classList.add("d-none");
        errorDiv.style.display = "block";
        errorDiv.textContent = error.message;
      }
    });
  }
});
