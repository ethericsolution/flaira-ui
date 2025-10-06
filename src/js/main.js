// Admin Dashboard JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Mobile sidebar functionality
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const sidebarClose = document.querySelector(".sidebar-close");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");

  // Toggle sidebar on mobile
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("show");
      sidebarOverlay.classList.toggle("show");
      document.body.style.overflow = sidebar.classList.contains("show")
        ? "hidden"
        : "";
    });
  }

  // Close sidebar
  if (sidebarClose) {
    sidebarClose.addEventListener("click", function () {
      sidebar.classList.remove("show");
      sidebarOverlay.classList.remove("show");
      document.body.style.overflow = "";
    });
  }

  // Close sidebar when overlay is clicked
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", function () {
      sidebar.classList.remove("show");
      sidebarOverlay.classList.remove("show");
      document.body.style.overflow = "";
    });
  }

  // Enhanced submenu functionality
  const initializeSubmenus = () => {
    const submenuToggles = document.querySelectorAll(".submenu-toggle");

    submenuToggles.forEach((toggle) => {
      // Set initial ARIA state
      const target = document.querySelector(toggle.getAttribute("href"));
      if (target) {
        const isExpanded = target.classList.contains("show");
        toggle.setAttribute("aria-expanded", isExpanded);
      }

      // Mobile submenu handling
      if (window.innerWidth < 992) {
        toggle.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            const isExpanded = this.getAttribute("aria-expanded") === "true";
            this.setAttribute("aria-expanded", !isExpanded);

            if (isExpanded) {
              target.classList.remove("show");
            } else {
              target.classList.add("show");
            }
          }
        });
      }
    });

    // Auto-expand submenus containing active links
    const activeLinks = document.querySelectorAll(
      ".sidebar-nav .nav-link.active"
    );
    activeLinks.forEach((link) => {
      let parentMenu = link.closest(".sub-menu");
      while (parentMenu) {
        parentMenu.classList.add("show");
        const toggle = document.querySelector(`[href="#${parentMenu.id}"]`);
        if (toggle) {
          toggle.setAttribute("aria-expanded", "true");
        }
        parentMenu = parentMenu.parentElement.closest(".sub-menu");
      }
    });
  };

  // Initialize submenus
  initializeSubmenus();

  // Active state management
  const initializeActiveStates = () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(
      ".sidebar-nav .nav-link:not(.submenu-toggle)"
    );

    // Set initial active state based on current URL
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
      }

      // Click handler for navigation
      link.addEventListener("click", function (e) {
        if (!this.classList.contains("submenu-toggle")) {
          // Remove active class from all links
          navLinks.forEach((nl) => nl.classList.remove("active"));
          // Add active class to clicked link
          this.classList.add("active");

          // Close sidebar on mobile after navigation
          if (window.innerWidth < 992) {
            sidebar.classList.remove("show");
            sidebarOverlay.classList.remove("show");
            document.body.style.overflow = "";
          }
        }
      });
    });
  };

  // Initialize active states
  initializeActiveStates();

  // Auto-dismiss alerts
  const initializeAutoDismissAlerts = () => {
    const alerts = document.querySelectorAll(".alert[data-auto-dismiss]");
    alerts.forEach((alert) => {
      const delay = parseInt(alert.getAttribute("data-auto-dismiss")) || 5000;
      setTimeout(() => {
        if (alert.isConnected) {
          // Check if alert is still in DOM
          bootstrap.Alert.getOrCreateInstance(alert).close();
        }
      }, delay);
    });
  };

  // Initialize auto-dismiss alerts
  initializeAutoDismissAlerts();

  // Tooltip initialization
  const initializeTooltips = () => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  };

  // Initialize tooltips
  initializeTooltips();

  // Dark mode toggle functionality
  const initializeDarkMode = () => {
    const darkModeToggle = document.querySelector("[data-bs-theme-toggle]");
    if (darkModeToggle) {
      // Load saved theme
      const savedTheme = localStorage.getItem("bsTheme");
      if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-bs-theme", "dark");
        darkModeToggle.innerHTML = '<i class="bi bi-sun me-2"></i>Light Mode';
      }

      darkModeToggle.addEventListener("click", function () {
        const html = document.documentElement;
        const isDark = html.getAttribute("data-bs-theme") === "dark";

        if (isDark) {
          html.removeAttribute("data-bs-theme");
          localStorage.setItem("bsTheme", "light");
          this.innerHTML = '<i class="bi bi-moon me-2"></i>Dark Mode';
        } else {
          html.setAttribute("data-bs-theme", "dark");
          localStorage.setItem("bsTheme", "dark");
          this.innerHTML = '<i class="bi bi-sun me-2"></i>Light Mode';
        }
      });
    }
  };

  // Initialize dark mode
  initializeDarkMode();

  // Resize handler
  const handleResize = () => {
    if (window.innerWidth >= 992) {
      // Close sidebar on desktop
      sidebar.classList.remove("show");
      sidebarOverlay.classList.remove("show");
      document.body.style.overflow = "";

      // Re-initialize submenus for desktop behavior
      initializeSubmenus();
    }
  };

  // Throttled resize handler
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
  });

  // Keyboard navigation for sidebar
  const initializeKeyboardNavigation = () => {
    document.addEventListener("keydown", function (e) {
      // Close sidebar with Escape key
      if (e.key === "Escape" && sidebar.classList.contains("show")) {
        sidebar.classList.remove("show");
        sidebarOverlay.classList.remove("show");
        document.body.style.overflow = "";
      }
    });
  };

  // Initialize keyboard navigation
  initializeKeyboardNavigation();

  // Utility functions
  window.AdminDashboard = {
    // Show loading state
    showLoading: function (element) {
      element.classList.add("loading");
      element.disabled = true;
    },

    // Hide loading state
    hideLoading: function (element) {
      element.classList.remove("loading");
      element.disabled = false;
    },

    // Format numbers
    formatNumber: function (number) {
      return new Intl.NumberFormat().format(number);
    },

    // Format currency
    formatCurrency: function (amount, currency = "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
    },

    // Format percentage
    formatPercent: function (value) {
      return new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value / 100);
    },

    // Show notification
    showNotification: function (message, type = "info") {
      // Create notification element
      const notification = document.createElement("div");
      notification.className = `alert alert-${type} alert-dismissible fade show`;
      notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;

      // Add to page (you might want to create a specific container for notifications)
      const container =
        document.querySelector(".main-content") || document.body;
      container.insertBefore(notification, container.firstChild);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        if (notification.isConnected) {
          bootstrap.Alert.getOrCreateInstance(notification).close();
        }
      }, 5000);
    },
  };

  console.log("Admin dashboard initialized successfully");
});

// Export for module usage (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AdminDashboard };
}
