/**
 * Main Application
 * Initializes and coordinates all components of the job portal
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize services
    const jobService = new JobService();

    // Initialize components
    const filterComponent = typeof FilterComponent !== 'undefined' ? new FilterComponent(handleFilterChange) : null;

    // DOM elements
    const jobList = document.getElementById('job-list');
    const jobCountElement = document.getElementById('job-count');
    const loadMoreBtn = document.getElementById('load-more');
    const jobSearchInput = document.getElementById('job-search');
    const locationSearchInput = document.getElementById('location-search');
    const searchBtn = document.querySelector('.search-btn');

    // Check if on homepage
    const isHomepage = window.location.pathname.endsWith('/index.html') ||
                       window.location.pathname.endsWith('/') ||
                       window.location.pathname.split('/').pop() === '';

    // Initialize the application
    init();

    /**
     * Initialize the application
     */
    async function init() {
        // Initialize filter component if it exists
        if (filterComponent) {
            filterComponent.init();
        }

        // Load initial job data
        await loadJobs();

        // Add event listeners
        if (jobList && loadMoreBtn) {
            addEventListeners();
        }
    }

    /**
     * Load jobs from the service
     */
    async function loadJobs() {
        if (!jobList) return;

        // Show loading state
        showLoading(true);

        try {
            // Initialize the job service
            await jobService.init();

            // Get the first page of jobs
            const jobs = jobService.getJobsPage();

            // Render the jobs
            renderJobs(jobs);

            // Update job count
            updateJobCount();

            // Update load more button visibility
            if (loadMoreBtn) {
                updateLoadMoreButton();
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
            showError('Failed to load jobs. Please try again later.');
        } finally {
            // Hide loading state
            showLoading(false);
        }
    }

    /**
     * Render job cards to the DOM
     * @param {Array} jobs - The jobs to render
     * @param {boolean} append - Whether to append or replace existing jobs
     */
    function renderJobs(jobs, append = false) {
        if (!jobList) return;

        if (!append) {
            // Clear the job list if not appending
            jobList.innerHTML = '';
        }

        if (jobs.length === 0 && !append) {
            // Show no results message
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No jobs found</h3>
                <p>Try adjusting your search or filter criteria</p>
            `;
            jobList.appendChild(noResults);
            return;
        }

        // Create and append job cards
        jobs.forEach(job => {
            // Check if we're using the old or new structure
            if (isHomepage) {
                // Use adapted job card creation for homepage
                const jobCardElement = createAdaptedJobCard(job);
                if (jobCardElement) {
                    jobList.appendChild(jobCardElement);
                }
            } else {
                // Use original job card creation for job listings page
                const jobCard = new JobCard(job);
                jobList.appendChild(jobCard.createJobCard());
            }
        });
    }

    /**
     * Create an adapted job card that works with new CSS on the homepage
     * @param {Object} job - The job data
     * @returns {HTMLElement} - The job card DOM element
     */
    function createAdaptedJobCard(job) {
        try {
            // Get template
            const template = document.getElementById('job-card-template');
            if (!template) {
                console.error('Job card template not found');
                return null;
            }

            // Clone the template
            const card = template.content.cloneNode(true);
            const jobCard = card.querySelector('.job-card');

            // Check old structure elements
            const jobCardHeader = card.querySelector('.job-card-header');
            const jobCardBody = card.querySelector('.job-card-body');

            // Transform to new structure if we're on the homepage with old template
            if (jobCardHeader && jobCardBody) {
                // Set up company section
                const companySection = document.createElement('div');
                companySection.className = 'company-section';

                // Move logo
                const logo = jobCardHeader.querySelector('.company-logo');
                if (logo) {
                    companySection.appendChild(logo.cloneNode(true));
                }

                // Create job info
                const jobInfo = document.createElement('div');
                jobInfo.className = 'job-info';

                // Get company name and job title
                const titleSection = jobCardHeader.querySelector('.job-card-title');
                if (titleSection) {
                    const companyName = titleSection.querySelector('.company-name');
                    const jobTitle = titleSection.querySelector('.job-title');

                    if (companyName) jobInfo.appendChild(companyName.cloneNode(true));
                    if (jobTitle) jobInfo.appendChild(jobTitle.cloneNode(true));
                }

                companySection.appendChild(jobInfo);

                // Create details section
                const detailsSection = document.createElement('div');
                detailsSection.className = 'job-details-section';

                // Get job details
                const oldDetails = jobCardBody.querySelector('.job-details');
                if (oldDetails) {
                    // Convert spans to divs
                    const locationEl = oldDetails.querySelector('.job-location');
                    const typeEl = oldDetails.querySelector('.job-type');
                    const salaryEl = oldDetails.querySelector('.job-salary');

                    if (locationEl) {
                        const detail = document.createElement('div');
                        detail.className = 'job-detail';
                        detail.innerHTML = locationEl.innerHTML;
                        detailsSection.appendChild(detail);
                    }

                    if (typeEl) {
                        const detail = document.createElement('div');
                        detail.className = 'job-detail';
                        detail.innerHTML = typeEl.innerHTML;
                        detailsSection.appendChild(detail);
                    }

                    if (salaryEl) {
                        const detail = document.createElement('div');
                        detail.className = 'job-detail';
                        detail.innerHTML = salaryEl.innerHTML;
                        detailsSection.appendChild(detail);
                    }

                    // Add level if available
                    if (job.experienceLevel) {
                        const detail = document.createElement('div');
                        detail.className = 'job-detail';

                        const icon = document.createElement('i');
                        icon.className = 'fas fa-level-up-alt';

                        const text = document.createElement('span');
                        text.className = 'level-text';

                        // Format level
                        const level = job.experienceLevel.split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');

                        text.textContent = level;

                        detail.appendChild(icon);
                        detail.appendChild(text);
                        detailsSection.appendChild(detail);
                    }
                }

                // Create tags section
                const tagsSection = document.createElement('div');
                tagsSection.className = 'job-tags-section';

                // Get tags from body
                const oldTags = jobCardBody.querySelector('.job-tags');
                if (oldTags && job.tags) {
                    job.tags.forEach(tag => {
                        const tagEl = document.createElement('span');
                        tagEl.className = 'tag';
                        tagEl.textContent = tag;
                        tagsSection.appendChild(tagEl);
                    });
                }

                // Get description
                const description = jobCardBody.querySelector('.job-description');
                const descriptionClone = description ? description.cloneNode(true) : null;

                // Set up footer
                const oldFooter = card.querySelector('.job-card-footer');
                const newFooter = document.createElement('div');
                newFooter.className = 'job-card-footer';

                // Add posted date
                const postedDate = oldFooter.querySelector('.posted-date');
                if (postedDate) {
                    newFooter.appendChild(postedDate.cloneNode(true));
                } else {
                    const dateEl = document.createElement('div');
                    dateEl.className = 'posted-date';

                    // Calculate posted date
                    if (job.postedDate) {
                        const postDate = new Date(job.postedDate);
                        const now = new Date();
                        const diffDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));

                        if (diffDays === 0) {
                            dateEl.textContent = 'Posted today';
                        } else if (diffDays === 1) {
                            dateEl.textContent = 'Posted yesterday';
                        } else {
                            dateEl.textContent = `Posted ${diffDays} days ago`;
                        }
                    }

                    newFooter.appendChild(dateEl);
                }

                // Add buttons container
                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'card-buttons';

                // Add Save button
                const saveBtn = document.createElement('button');
                saveBtn.className = 'btn btn-outline save-job-btn';
                saveBtn.textContent = 'Save Job';
                saveBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`Saving job: ${job.title}`);
                    alert(`Job saved: ${job.title}`);
                });
                buttonsContainer.appendChild(saveBtn);

                // Add Apply button
                const applyBtn = oldFooter.querySelector('.apply-btn');
                if (applyBtn) {
                    const newApplyBtn = document.createElement('button');
                    newApplyBtn.className = 'btn btn-primary apply-btn';
                    newApplyBtn.textContent = 'Apply Now';
                    newApplyBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log(`Applying for job: ${job.title}`);
                        alert(`Application submitted for ${job.title}!`);
                    });
                    buttonsContainer.appendChild(newApplyBtn);
                }

                newFooter.appendChild(buttonsContainer);

                // Build new card structure
                jobCard.innerHTML = '';
                jobCard.appendChild(companySection);
                jobCard.appendChild(detailsSection);
                jobCard.appendChild(tagsSection);
                if (descriptionClone) jobCard.appendChild(descriptionClone);
                jobCard.appendChild(newFooter);

                // Fill with job data
                fillJobCardWithData(jobCard, job);
            } else {
                // We already have the new structure, just fill with data
                fillJobCardWithData(jobCard, job);
            }

            return jobCard;
        } catch (error) {
            console.error('Error creating adapted job card:', error);
            return null;
        }
    }

    /**
     * Fill the job card with data
     * @param {HTMLElement} card - The job card element
     * @param {Object} job - The job data
     */
    function fillJobCardWithData(card, job) {
        // Company and job info
        const companyName = card.querySelector('.company-name');
        const jobTitle = card.querySelector('.job-title');
        const logoImg = card.querySelector('.company-logo img');

        if (companyName) companyName.textContent = job.company;
        if (jobTitle) jobTitle.textContent = job.title;
        if (logoImg) {
            logoImg.src = job.logo || 'https://via.placeholder.com/50';
            logoImg.alt = `${job.company} logo`;
        }

        // Job details
        const locationText = card.querySelector('.location-text');
        const typeText = card.querySelector('.type-text');
        const salaryText = card.querySelector('.salary-text');

        if (locationText) locationText.textContent = job.location;
        if (typeText) typeText.textContent = job.type;
        if (salaryText) salaryText.textContent = job.salary;

        // Job description
        const description = card.querySelector('.job-description');
        if (description) description.textContent = job.description;

        // Posted date
        const postedDate = card.querySelector('.posted-date');
        if (postedDate && job.postedDate) {
            const postDate = new Date(job.postedDate);
            const now = new Date();
            const diffDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                postedDate.textContent = 'Posted today';
            } else if (diffDays === 1) {
                postedDate.textContent = 'Posted yesterday';
            } else {
                postedDate.textContent = `Posted ${diffDays} days ago`;
            }
        }
    }

    /**
     * Add event listeners to page elements
     */
    function addEventListeners() {
        // Load more button
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', handleLoadMore);
        }

        // Search button
        if (searchBtn) {
            searchBtn.addEventListener('click', handleSearch);
        }

        // Search inputs (for enter key)
        if (jobSearchInput) {
            jobSearchInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') handleSearch();
            });
        }

        if (locationSearchInput) {
            locationSearchInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') handleSearch();
            });
        }
    }

    /**
     * Handle filter changes
     * @param {Object} filters - The updated filters
     */
    function handleFilterChange(filters) {
        // Apply filters to the job service
        const filteredJobs = jobService.applyFilters(filters);

        // Render the filtered jobs
        renderJobs(filteredJobs);

        // Update job count
        updateJobCount();

        // Update load more button visibility
        if (loadMoreBtn) {
            updateLoadMoreButton();
        }
    }

    /**
     * Handle search button click
     */
    function handleSearch() {
        if (!jobSearchInput || !locationSearchInput) return;

        const keyword = jobSearchInput.value.trim();
        const location = locationSearchInput.value.trim();

        // Search jobs
        const searchResults = jobService.searchJobs(keyword, location);

        // Render search results
        renderJobs(searchResults);

        // Update job count
        updateJobCount();

        // Update load more button visibility
        if (loadMoreBtn) {
            updateLoadMoreButton();
        }
    }

    /**
     * Handle load more button click
     */
    function handleLoadMore() {
        // Show loading state
        showLoading(true);

        // Get the next page of jobs
        const nextPageJobs = jobService.loadNextPage();

        // Render the additional jobs
        renderJobs(nextPageJobs, true);

        // Update load more button visibility
        updateLoadMoreButton();

        // Hide loading state
        showLoading(false);
    }

    /**
     * Update the job count display
     */
    function updateJobCount() {
        if (jobCountElement) {
            const totalJobs = jobService.getTotalJobCount();
            jobCountElement.textContent = totalJobs;
        }
    }

    /**
     * Update the load more button visibility
     */
    function updateLoadMoreButton() {
        if (!loadMoreBtn) return;

        const currentPage = jobService.currentPage;
        const totalPages = jobService.getTotalPages();

        if (currentPage >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }

    /**
     * Show or hide loading state
     * @param {boolean} isLoading - Whether the app is in loading state
     */
    function showLoading(isLoading) {
        if (!loadMoreBtn) return;

        if (isLoading) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = 'Loading...';
        } else {
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = 'Load More Jobs';
        }
    }

    /**
     * Show error message
     * @param {string} message - The error message to display
     */
    function showError(message) {
        if (!jobList) return;

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        jobList.innerHTML = '';
        jobList.appendChild(errorElement);
    }
});