/**
 * HomepageJobAdapter.js
 *
 * This script adapts job cards for the homepage to work with both the old
 * and new structure. It allows the homepage to display jobs without
 * modifying the main job listings page.
 */
class HomepageJobAdapter {
    /**
     * Initialize the adapter
     */
    constructor() {
        this.originalJobCard = new JobCard();
        this.initialize();
    }

    /**
     * Initialize the adapter
     */
    initialize() {
        // Only run this script on the homepage
        if (!window.location.href.includes('index.html') &&
            !window.location.href.endsWith('/')) {
            return;
        }

        // Override the original JobCard's createCard method
        this.originalCreateCard = JobCard.prototype.createCard;
        JobCard.prototype.createCard = this.adaptedCreateCard;

        console.log('Homepage Job Adapter initialized');
    }

    /**
     * Adapted version of the createCard method that works with the old template
     * but produces a structure that works with the new CSS
     *
     * @param {Object} job The job data
     * @returns {HTMLElement} The job card element
     */
    adaptedCreateCard(job) {
        try {
            // Clone the template
            const template = document.getElementById('job-card-template');
            if (!template) {
                console.error('Job card template not found');
                return null;
            }

            const card = template.content.cloneNode(true);
            const jobCard = card.querySelector('.job-card');

            // Check if we have the old structure
            const jobCardHeader = card.querySelector('.job-card-header');
            const jobCardBody = card.querySelector('.job-card-body');

            if (jobCardHeader && jobCardBody) {
                console.log('Converting old job card structure to new structure');

                // Transform from old structure to new structure

                // 1. Create company section from the header
                const companySection = document.createElement('div');
                companySection.className = 'company-section';

                // Move logo and company info to company section
                const logo = jobCardHeader.querySelector('.company-logo');
                const titleSection = jobCardHeader.querySelector('.job-card-title');

                if (logo) companySection.appendChild(logo.cloneNode(true));

                // Create job info section
                const jobInfo = document.createElement('div');
                jobInfo.className = 'job-info';

                // Move company name and job title
                if (titleSection) {
                    const companyName = titleSection.querySelector('.company-name');
                    const jobTitle = titleSection.querySelector('.job-title');

                    if (companyName) jobInfo.appendChild(companyName.cloneNode(true));
                    if (jobTitle) jobInfo.appendChild(jobTitle.cloneNode(true));
                }

                companySection.appendChild(jobInfo);

                // 2. Create job details section
                const jobDetailsSection = document.createElement('div');
                jobDetailsSection.className = 'job-details-section';

                // Get job details from the body
                const jobDetails = jobCardBody.querySelector('.job-details');
                if (jobDetails) {
                    // Transform spans to divs with correct classes
                    const locationSpan = jobDetails.querySelector('.job-location');
                    const typeSpan = jobDetails.querySelector('.job-type');
                    const salarySpan = jobDetails.querySelector('.job-salary');

                    if (locationSpan) {
                        const locationDetail = document.createElement('div');
                        locationDetail.className = 'job-detail';
                        locationDetail.innerHTML = locationSpan.innerHTML;
                        jobDetailsSection.appendChild(locationDetail);
                    }

                    if (typeSpan) {
                        const typeDetail = document.createElement('div');
                        typeDetail.className = 'job-detail';
                        typeDetail.innerHTML = typeSpan.innerHTML;
                        jobDetailsSection.appendChild(typeDetail);
                    }

                    if (salarySpan) {
                        const salaryDetail = document.createElement('div');
                        salaryDetail.className = 'job-detail';
                        salaryDetail.innerHTML = salarySpan.innerHTML;
                        jobDetailsSection.appendChild(salaryDetail);
                    }

                    // Add level detail if available in the job data
                    if (job.experienceLevel) {
                        const levelDetail = document.createElement('div');
                        levelDetail.className = 'job-detail';

                        const levelIcon = document.createElement('i');
                        levelIcon.className = 'fas fa-level-up-alt';

                        const levelText = document.createElement('span');
                        levelText.className = 'level-text';

                        // Format level text
                        const formattedLevel = job.experienceLevel
                            ? job.experienceLevel.split('-')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')
                            : 'Not Specified';

                        levelText.textContent = formattedLevel;

                        levelDetail.appendChild(levelIcon);
                        levelDetail.appendChild(levelText);
                        jobDetailsSection.appendChild(levelDetail);
                    }
                }

                // 3. Create tags section
                const tagsSection = document.createElement('div');
                tagsSection.className = 'job-tags-section';

                // Get tags from body
                const oldTags = jobCardBody.querySelector('.job-tags');
                if (oldTags) {
                    // Clone tags content
                    Array.from(oldTags.children).forEach(tag => {
                        tagsSection.appendChild(tag.cloneNode(true));
                    });
                }

                // 4. Get description
                const description = jobCardBody.querySelector('.job-description');

                // 5. Set up footer
                const footer = card.querySelector('.job-card-footer');
                const cardButtons = document.createElement('div');
                cardButtons.className = 'card-buttons';

                // Add Save Job button if not already there
                if (!footer.querySelector('.save-job-btn')) {
                    const saveBtn = document.createElement('button');
                    saveBtn.className = 'btn btn-outline save-job-btn';
                    saveBtn.textContent = 'Save Job';
                    saveBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log(`Saving job: ${job.title} at ${job.company}`);
                        alert(`Job saved: ${job.title} at ${job.company}`);
                    });
                    cardButtons.appendChild(saveBtn);
                }

                // Move apply button to card buttons
                const applyBtn = footer.querySelector('.apply-btn');
                if (applyBtn) {
                    // Convert anchor to button if needed
                    if (applyBtn.tagName === 'A') {
                        const newApplyBtn = document.createElement('button');
                        newApplyBtn.className = applyBtn.className;
                        newApplyBtn.textContent = applyBtn.textContent;
                        newApplyBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            console.log(`Applying for job: ${job.title} at ${job.company}`);
                            alert(`Application submitted for ${job.title} at ${job.company}!`);
                        });
                        cardButtons.appendChild(newApplyBtn);
                    } else {
                        cardButtons.appendChild(applyBtn.cloneNode(true));
                    }
                }

                // Create new card structure
                jobCard.innerHTML = '';
                jobCard.appendChild(companySection);
                jobCard.appendChild(jobDetailsSection);
                jobCard.appendChild(tagsSection);
                if (description) jobCard.appendChild(description.cloneNode(true));

                // Update footer
                const postedDate = footer.querySelector('.posted-date');
                const newFooter = document.createElement('div');
                newFooter.className = 'job-card-footer';

                if (postedDate) newFooter.appendChild(postedDate.cloneNode(true));
                newFooter.appendChild(cardButtons);

                jobCard.appendChild(newFooter);
            }

            // Fill the card with actual data
            this.fillCardWithData(jobCard, job);

            return jobCard;
        } catch (error) {
            console.error('Error creating job card:', error);
            return null;
        }
    }

    /**
     * Fill the job card with data
     *
     * @param {HTMLElement} card The job card element
     * @param {Object} job The job data
     */
    fillCardWithData(card, job) {
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
        const levelText = card.querySelector('.level-text');

        if (locationText) locationText.textContent = job.location;
        if (typeText) typeText.textContent = job.type;
        if (salaryText) salaryText.textContent = job.salary;

        if (levelText && job.experienceLevel) {
            const formattedLevel = job.experienceLevel
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            levelText.textContent = formattedLevel;
        }

        // Job description
        const description = card.querySelector('.job-description');
        if (description) description.textContent = job.description;

        // Tags
        const tagsContainer = card.querySelector('.job-tags-section') || card.querySelector('.job-tags');
        if (tagsContainer && job.tags && job.tags.length > 0) {
            tagsContainer.innerHTML = '';
            job.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'tag';
                tagEl.textContent = tag;
                tagsContainer.appendChild(tagEl);
            });
        }

        // Posted date
        const postedDate = card.querySelector('.posted-date');
        if (postedDate && job.postedDate) {
            const postDate = new Date(job.postedDate);
            const now = new Date();
            const diffDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));

            let postedText = '';
            if (diffDays === 0) {
                postedText = 'Posted today';
            } else if (diffDays === 1) {
                postedText = 'Posted yesterday';
            } else {
                postedText = `Posted ${diffDays} days ago`;
            }

            postedDate.textContent = postedText;
        }
    }
}

// Initialize the adapter when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomepageJobAdapter();
});