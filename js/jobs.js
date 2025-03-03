/**
 * Jobs Page Script
 * Handles job listing functionality with pagination
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, initializing job listing...');

    // Initialize services
    const jobService = new JobService();
    const jobCard = new JobCard();

    // DOM elements
    const jobList = document.getElementById('job-list');
    const jobCountElement = document.getElementById('job-count');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumbersContainer = document.getElementById('page-numbers');
    const jobSearchInput = document.getElementById('job-search');
    const locationSearchInput = document.getElementById('location-search');
    const searchBtn = document.querySelector('.search-btn');

    if (!jobList || !jobCountElement) {
        console.error('Required DOM elements not found!');
        return;
    }

    // Initialize the job service
    await jobService.init();

    // Set jobs per page to 5 for this page
    jobService.jobsPerPage = 5;

    // Initialize the application
    await init();

    /**
     * Initialize the application
     */
    async function init() {
        // Load initial job data
        await loadJobs();

        // Add event listeners
        addEventListeners();

        // Update pagination
        updatePagination();
    }

    /**
     * Load jobs from the service
     */
    async function loadJobs() {
        try {
            console.log('Loading jobs...');
            // Show loading state
            jobList.innerHTML = '<div class="loading">Loading jobs...</div>';

            // Get jobs from service
            const jobs = await jobService.getJobs();
            console.log('Jobs loaded:', jobs);

            // Render the jobs
            renderJobs(jobs);

            // Update job count
            jobCountElement.textContent = jobs.length;
        } catch (error) {
            console.error('Error loading jobs:', error);
            jobList.innerHTML = '<div class="error">Error loading jobs. Please try again later.</div>';
        }
    }

    /**
     * Render jobs to the job list
     * @param {Array} jobs - The jobs to render
     */
    function renderJobs(jobs) {
        // Clear the job list
        jobList.innerHTML = '';

        // Check if there are any jobs to display
        if (jobs.length === 0) {
            jobList.innerHTML = '<div class="no-jobs">No jobs found matching your criteria</div>';
            return;
        }

        // Display jobs
        jobs.forEach(job => {
            console.log('Creating card for job:', job.title);
            const cardElement = jobCard.createCard(job);
            if (cardElement) {
                jobList.appendChild(cardElement);
            } else {
                console.error('Failed to create card for job:', job);
            }
        });
    }

    /**
     * Add event listeners to page elements
     */
    function addEventListeners() {
        // Pagination buttons
        prevPageBtn.addEventListener('click', handlePrevPage);
        nextPageBtn.addEventListener('click', handleNextPage);

        // Search button
        searchBtn.addEventListener('click', handleSearch);

        // Search inputs (for enter key)
        jobSearchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') handleSearch();
        });

        locationSearchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') handleSearch();
        });

        // Filter change handlers
        const jobTypeCheckboxes = document.querySelectorAll('.filter-section input[type="checkbox"]');
        jobTypeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleFilterChange);
        });

        // Reset all filters button
        const resetAllBtn = document.getElementById('reset-all');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', resetAllFilters);
        }

        // Apply filters button
        const applyFiltersBtn = document.getElementById('apply-filters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', applyAllFilters);
        }
    }

    /**
     * Handle filter changes
     */
    function handleFilterChange() {
        // Get all checked filters
        const filters = getSelectedFilters();

        // Apply filters to the job service
        const filteredJobs = jobService.applyFilters(filters);

        // Render the filtered jobs
        renderJobs(filteredJobs);

        // Update job count
        updateJobCount();

        // Update pagination
        updatePagination();
    }

    /**
     * Get all selected filters
     */
    function getSelectedFilters() {
        const filters = {};

        // Job Category
        const categoryCheckboxes = document.querySelectorAll('.filter-section:nth-child(1) input:checked');
        if (categoryCheckboxes.length > 0) {
            filters.category = Array.from(categoryCheckboxes).map(cb => cb.id);
        }

        // Job Type
        const typeCheckboxes = document.querySelectorAll('.filter-section:nth-child(2) input:checked');
        if (typeCheckboxes.length > 0) {
            filters.jobType = Array.from(typeCheckboxes).map(cb => cb.id);
        }

        // Experience Level
        const levelCheckboxes = document.querySelectorAll('.filter-section:nth-child(3) input:checked');
        if (levelCheckboxes.length > 0) {
            filters.experienceLevel = Array.from(levelCheckboxes).map(cb => cb.id);
        }

        // Remote Options
        const remoteCheckboxes = document.querySelectorAll('.filter-section:nth-child(4) input:checked');
        if (remoteCheckboxes.length > 0) {
            filters.remote = Array.from(remoteCheckboxes).map(cb => cb.id);
        }

        // Salary Range
        const salarySlider = document.getElementById('salary-min');
        if (salarySlider) {
            filters.minSalary = salarySlider.value;
        }

        // Skills
        const skillsCheckboxes = document.querySelectorAll('.filter-section:nth-child(6) input:checked');
        if (skillsCheckboxes.length > 0) {
            filters.skills = Array.from(skillsCheckboxes).map(cb => cb.id);
        }

        return filters;
    }

    /**
     * Reset all filters
     */
    function resetAllFilters() {
        // Uncheck all checkboxes
        const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset salary slider
        const salarySlider = document.getElementById('salary-min');
        if (salarySlider) {
            salarySlider.value = 0;
        }

        // Reset jobs to original list
        jobService.filteredJobs = [...jobService.jobs];
        jobService.currentPage = 1;

        // Render unfiltered jobs
        const jobs = jobService.getJobsPage();
        renderJobs(jobs);

        // Update job count
        updateJobCount();

        // Update pagination
        updatePagination();
    }

    /**
     * Apply all current filters
     */
    function applyAllFilters() {
        handleFilterChange();
    }

    /**
     * Handle search button click
     */
    function handleSearch() {
        const keyword = jobSearchInput.value.trim();
        const location = locationSearchInput.value.trim();

        // Search jobs
        const searchResults = jobService.searchJobs(keyword, location);

        // Render search results
        renderJobs(searchResults);

        // Update job count
        updateJobCount();

        // Update pagination
        updatePagination();
    }

    /**
     * Handle previous page button click
     */
    function handlePrevPage() {
        if (jobService.currentPage > 1) {
            jobService.currentPage--;
            const jobs = jobService.getJobsPage(jobService.currentPage);
            renderJobs(jobs);
            updatePagination();

            // Scroll to top of job listings
            const jobListingsContainer = document.querySelector('.job-listings-container');
            if (jobListingsContainer) {
                jobListingsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    /**
     * Handle next page button click
     */
    function handleNextPage() {
        if (jobService.currentPage < jobService.getTotalPages()) {
            jobService.currentPage++;
            const jobs = jobService.getJobsPage(jobService.currentPage);
            renderJobs(jobs);
            updatePagination();

            // Scroll to top of job listings
            const jobListingsContainer = document.querySelector('.job-listings-container');
            if (jobListingsContainer) {
                jobListingsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    /**
     * Handle page number click
     * @param {number} page - The page number to go to
     */
    function handlePageClick(page) {
        jobService.currentPage = page;
        const jobs = jobService.getJobsPage(page);
        renderJobs(jobs);
        updatePagination();

        // Scroll to top of job listings
        const jobListingsContainer = document.querySelector('.job-listings-container');
        if (jobListingsContainer) {
            jobListingsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Update the job count display
     */
    function updateJobCount() {
        const totalJobs = jobService.getTotalJobCount();
        jobCountElement.textContent = totalJobs;
    }

    /**
     * Update pagination controls
     */
    function updatePagination() {
        const currentPage = jobService.currentPage;
        const totalPages = jobService.getTotalPages();

        // Update previous button state
        prevPageBtn.disabled = currentPage <= 1;

        // Update next button state
        nextPageBtn.disabled = currentPage >= totalPages;

        // Update page numbers
        renderPageNumbers(currentPage, totalPages);
    }

    /**
     * Render page number buttons
     * @param {number} currentPage - The current page
     * @param {number} totalPages - The total number of pages
     */
    function renderPageNumbers(currentPage, totalPages) {
        pageNumbersContainer.innerHTML = '';

        // Determine range of page numbers to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        // Adjust start page if we're near the end
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        // Add first page button if not in range
        if (startPage > 1) {
            addPageButton(1);

            // Add ellipsis if there's a gap
            if (startPage > 2) {
                addEllipsis();
            }
        }

        // Add page number buttons
        for (let i = startPage; i <= endPage; i++) {
            addPageButton(i, i === currentPage);
        }

        // Add last page button if not in range
        if (endPage < totalPages) {
            // Add ellipsis if there's a gap
            if (endPage < totalPages - 1) {
                addEllipsis();
            }

            addPageButton(totalPages);
        }
    }

    /**
     * Add a page number button
     * @param {number} pageNum - The page number
     * @param {boolean} isActive - Whether this is the current page
     */
    function addPageButton(pageNum, isActive = false) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${isActive ? 'active' : ''}`;
        pageBtn.textContent = pageNum;
        pageBtn.addEventListener('click', () => handlePageClick(pageNum));
        pageNumbersContainer.appendChild(pageBtn);
    }

    /**
     * Add ellipsis to page numbers
     */
    function addEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-ellipsis';
        ellipsis.textContent = '...';
        pageNumbersContainer.appendChild(ellipsis);
    }

    /**
     * Show or hide loading state
     * @param {boolean} isLoading - Whether the app is in a loading state
     */
    function showLoading(isLoading) {
        if (isLoading) {
            // Add loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            jobList.innerHTML = '';
            jobList.appendChild(loadingIndicator);
        } else {
            // Clear loading indicator
            const loadingIndicator = jobList.querySelector('.loading-indicator');
            if (loadingIndicator) {
                jobList.removeChild(loadingIndicator);
            }
        }
    }

    /**
     * Show error message
     * @param {string} message - The error message to display
     */
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        jobList.innerHTML = '';
        jobList.appendChild(errorElement);
    }
});