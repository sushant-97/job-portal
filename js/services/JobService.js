/**
 * JobService
 * Handles fetching and filtering job data
 */
class JobService {
    /**
     * Create a new JobService instance
     */
    constructor() {
        // Initialize with empty array - will be populated in init()
        this.jobs = [];
        this.filteredJobs = [];
        this.currentPage = 1;
        this.jobsPerPage = 6;
        this.isLoading = false;
    }

    /**
     * Initialize the service and load initial data
     * @returns {Promise<Array>} The loaded jobs
     */
    async init() {
        try {
            // Load mock data
            this.jobs = [
                {
                    id: 1,
                    title: "Senior AI Engineer",
                    company: "TechCorp",
                    logo: "https://via.placeholder.com/50",
                    location: "San Francisco, CA",
                    type: "Full-time",
                    category: "ai-engineer",
                    experienceLevel: "senior-level",
                    salary: "$150,000 - $180,000",
                    description: "Looking for an experienced AI Engineer to lead machine learning initiatives...",
                    tags: ["Python", "TensorFlow", "Machine Learning", "AWS"],
                    postedDate: "2024-03-01"
                },
                {
                    id: 2,
                    title: "Machine Learning Engineer",
                    company: "AI Solutions Inc",
                    logo: "https://via.placeholder.com/50",
                    location: "Remote",
                    type: "Full-time",
                    category: "ai-engineer",
                    experienceLevel: "mid-level",
                    salary: "$130,000 - $160,000",
                    description: "Join our team to develop cutting-edge ML models...",
                    tags: ["PyTorch", "Python", "Deep Learning", "Computer Vision"],
                    postedDate: "2024-03-02"
                },
                {
                    id: 3,
                    title: "Data Scientist",
                    company: "Analytics Pro",
                    logo: "https://via.placeholder.com/50",
                    location: "New York, NY",
                    type: "Full-time",
                    category: "data-scientist",
                    experienceLevel: "mid-level",
                    salary: "$120,000 - $150,000",
                    description: "Seeking a data scientist to work on predictive modeling and machine learning projects...",
                    tags: ["Python", "R", "SQL", "Machine Learning"],
                    postedDate: "2024-03-03"
                },
                {
                    id: 4,
                    title: "Junior Data Analyst",
                    company: "DataCrunch Ltd",
                    logo: "https://via.placeholder.com/50",
                    location: "Chicago, IL",
                    type: "Full-time",
                    category: "data-analyst",
                    experienceLevel: "entry-level",
                    salary: "$80,000 - $95,000",
                    description: "Great opportunity for a junior analyst to work with big data and visualization tools...",
                    tags: ["SQL", "Tableau", "Excel", "Python"],
                    postedDate: "2024-03-05"
                },
                {
                    id: 5,
                    title: "Python Developer",
                    company: "CodeMasters",
                    logo: "https://via.placeholder.com/50",
                    location: "Remote",
                    type: "Contract",
                    category: "software-dev",
                    experienceLevel: "mid-level",
                    salary: "$115,000 - $135,000",
                    description: "Looking for a Python developer with experience in Django and FastAPI...",
                    tags: ["Python", "Django", "FastAPI", "PostgreSQL"],
                    postedDate: "2024-03-08"
                },
                {
                    id: 6,
                    title: "Senior Data Engineer",
                    company: "BigDataInc",
                    logo: "https://via.placeholder.com/50",
                    location: "Seattle, WA",
                    type: "Full-time",
                    category: "data-engineer",
                    experienceLevel: "senior-level",
                    salary: "$140,000 - $170,000",
                    description: "Experienced data engineer needed for building scalable data pipelines...",
                    tags: ["Spark", "Hadoop", "Python", "AWS"],
                    postedDate: "2024-03-10"
                },
                {
                    id: 7,
                    title: "ML Ops Engineer",
                    company: "AI Platforms",
                    logo: "https://via.placeholder.com/50",
                    location: "Austin, TX",
                    type: "Full-time",
                    category: "ai-engineer",
                    experienceLevel: "mid-level",
                    salary: "$125,000 - $155,000",
                    description: "Join our team to develop and maintain ML deployment infrastructure...",
                    tags: ["Kubernetes", "Docker", "Python", "MLflow"],
                    postedDate: "2024-03-12"
                }
            ];
            this.filteredJobs = [...this.jobs];
            return this.getJobsPage();
        } catch (error) {
            console.error('Error initializing job service:', error);
            return [];
        }
    }

    /**
     * Get a page of job listings
     * @param {number} page - The page number to get
     * @returns {Array} The jobs for the requested page
     */
    getJobsPage(page = 1) {
        const startIndex = (page - 1) * this.jobsPerPage;
        const endIndex = startIndex + this.jobsPerPage;
        return this.filteredJobs.slice(startIndex, endIndex);
    }

    /**
     * Get the total number of pages
     * @returns {number} Total pages
     */
    getTotalPages() {
        return Math.ceil(this.filteredJobs.length / this.jobsPerPage);
    }

    /**
     * Load the next page of jobs
     * @returns {Array} The jobs for the next page
     */
    loadNextPage() {
        if (this.currentPage < this.getTotalPages()) {
            this.currentPage++;
            return this.getJobsPage(this.currentPage);
        }
        return [];
    }

    /**
     * Apply filters to the job listings
     * @param {Object} filters - The filters to apply
     * @returns {Array} The filtered jobs
     */
    applyFilters(filters) {
        this.filteredJobs = this.jobs.filter(job => {
            // Job Type filter
            if (filters.jobType && filters.jobType.length > 0) {
                const jobTypeMatch = filters.jobType.some(type => {
                    // Convert checkbox ID to job type value (e.g., "full-time" to "Full-time")
                    const formattedType = type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    return job.type === formattedType;
                });

                if (!jobTypeMatch) return false;
            }

            // Experience Level filter
            if (filters.experienceLevel && filters.experienceLevel.length > 0) {
                if (!filters.experienceLevel.includes(job.experienceLevel)) {
                    return false;
                }
            }

            // Category filter
            if (filters.category && filters.category.length > 0) {
                if (!filters.category.includes(job.category)) {
                    return false;
                }
            }

            // Remote filter
            if (filters.remote && filters.remote.length > 0) {
                // Check if remote is selected and job is remote
                const isRemoteSelected = filters.remote.includes('remote');
                const isHybridSelected = filters.remote.includes('hybrid');
                const isOnsiteSelected = filters.remote.includes('on-site');

                if (isRemoteSelected && !job.location.toLowerCase().includes('remote') &&
                    isHybridSelected && !job.location.toLowerCase().includes('hybrid') &&
                    isOnsiteSelected && !job.location.toLowerCase().includes('on-site')) {
                    return false;
                }
            }

            // Salary filter
            if (filters.minSalary && filters.minSalary > 0) {
                // Extract minimum salary from range (e.g., "$80,000 - $95,000" -> 80000)
                const salaryMatch = job.salary.match(/\$([0-9,]+)/);
                if (salaryMatch) {
                    const minJobSalary = parseInt(salaryMatch[1].replace(/,/g, ''));
                    if (minJobSalary < filters.minSalary) {
                        return false;
                    }
                }
            }

            // Skills filter
            if (filters.skills && filters.skills.length > 0) {
                const jobHasSkill = filters.skills.some(skill => {
                    return job.tags.some(tag => tag.toLowerCase() === skill.toLowerCase());
                });

                if (!jobHasSkill) {
                    return false;
                }
            }

            return true;
        });

        // Reset to first page after filtering
        this.currentPage = 1;
        return this.getJobsPage();
    }

    /**
     * Search jobs by keyword
     * @param {string} keyword - The search keyword
     * @param {string} location - The location search term
     * @returns {Array} The search results
     */
    searchJobs(keyword, location) {
        if (!keyword && !location) {
            this.filteredJobs = [...this.jobs];
            this.currentPage = 1;
            return this.getJobsPage();
        }

        const keywordLower = keyword.toLowerCase();
        const locationLower = location.toLowerCase();

        this.filteredJobs = this.jobs.filter(job => {
            const matchesKeyword = !keyword ||
                job.title.toLowerCase().includes(keywordLower) ||
                job.company.toLowerCase().includes(keywordLower) ||
                job.description.toLowerCase().includes(keywordLower) ||
                job.tags.some(tag => tag.toLowerCase().includes(keywordLower));

            const matchesLocation = !location ||
                job.location.toLowerCase().includes(locationLower);

            return matchesKeyword && matchesLocation;
        });

        // Reset to first page after searching
        this.currentPage = 1;
        return this.getJobsPage();
    }

    /**
     * Get the total number of jobs after filtering
     * @returns {number} Total job count
     */
    getTotalJobCount() {
        return this.filteredJobs.length;
    }

    /**
     * Get jobs with optional filters
     * @param {Object} filters - Optional filters to apply
     * @returns {Promise<Array>} The filtered jobs
     */
    async getJobs(filters = {}) {
        try {
            // If jobs haven't been initialized yet, do it now
            if (this.jobs.length === 0) {
                await this.init();
            }

            // Apply any provided filters
            if (Object.keys(filters).length > 0) {
                return this.applyFilters(filters);
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            return this.getJobsPage();
        } catch (error) {
            console.error('Error getting jobs:', error);
            return [];
        }
    }
}