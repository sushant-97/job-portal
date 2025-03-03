/**
 * JobCard Component
 * Handles job card creation and rendering
 */
class JobCard {
    /**
     * Create a new JobCard instance
     */
    constructor() {
        this.template = document.getElementById('job-card-template');

        if (!this.template) {
            console.error('Job card template not found!');
        }
    }

    /**
     * Create a job card element from a job object
     * @param {Object} job - The job data
     * @returns {HTMLElement} The job card element
     */
    createCard(job) {
        if (!this.template) {
            console.error('Cannot create job card: template not found');
            return null;
        }

        try {
            // Clone the template
            const card = this.template.content.cloneNode(true);

            // Set company name and job title
            card.querySelector('.company-name').textContent = job.company;
            card.querySelector('.job-title').textContent = job.title;

            // Set company logo
            const logoImg = card.querySelector('.company-logo img');
            logoImg.src = job.logo || 'https://via.placeholder.com/50';
            logoImg.alt = `${job.company} logo`;

            // Set job details
            card.querySelector('.location-text').textContent = job.location;
            card.querySelector('.type-text').textContent = job.type;
            card.querySelector('.salary-text').textContent = job.salary;

            // Set experience level
            const levelText = card.querySelector('.level-text');
            if (levelText) {
                // Convert experience level format (e.g., "mid-level" to "Mid Level")
                const formattedLevel = job.experienceLevel
                    ? job.experienceLevel.split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                    : 'Not Specified';

                levelText.textContent = formattedLevel;
            }

            // Set job description
            card.querySelector('.job-description').textContent = job.description;

            // Set posted date
            const postedDate = new Date(job.postedDate);
            const now = new Date();
            const diffDays = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));

            let postedText = '';
            if (diffDays === 0) {
                postedText = 'Posted today';
            } else if (diffDays === 1) {
                postedText = 'Posted yesterday';
            } else {
                postedText = `Posted ${diffDays} days ago`;
            }

            card.querySelector('.posted-date').textContent = postedText;

            // Set job tags
            const tagsContainer = card.querySelector('.job-tags-section');
            if (job.tags && job.tags.length > 0) {
                job.tags.forEach(tag => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'tag';
                    tagEl.textContent = tag;
                    tagsContainer.appendChild(tagEl);
                });
            }

            // Add event listeners
            const applyBtn = card.querySelector('.apply-btn');
            if (applyBtn) {
                applyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleApply(job);
                });
            }

            const saveBtn = card.querySelector('.save-job-btn');
            if (saveBtn) {
                saveBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleSaveJob(job);
                });
            }

            return card.firstElementChild;
        } catch (error) {
            console.error('Error creating job card:', error);
            return null;
        }
    }

    /**
     * Handle apply button click
     * @param {Object} job - The job being applied for
     */
    handleApply(job) {
        console.log(`Applying for job: ${job.title} at ${job.company}`);
        // In a real app, this would open an application form or redirect to an application page
        alert(`Application submitted for ${job.title} at ${job.company}!`);
    }

    /**
     * Handle save job button click
     * @param {Object} job - The job being saved
     */
    handleSaveJob(job) {
        console.log(`Saving job: ${job.title} at ${job.company}`);
        alert(`Job saved: ${job.title} at ${job.company}`);
    }
}