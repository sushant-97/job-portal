/**
 * FilterComponent
 * Handles the filtering functionality for job listings
 */
class FilterComponent {
    /**
     * Create a new FilterComponent instance
     * @param {Function} onFilterChange - Callback function when filters change
     */
    constructor(onFilterChange) {
        this.filters = {
            jobType: '',
            experienceLevel: '',
            category: '',
            datePosted: ''
        };
        this.onFilterChange = onFilterChange;
        this.initialized = false;
    }

    /**
     * Initialize the filter component
     */
    init() {
        if (this.initialized) return;
        
        // Get filter elements
        this.jobTypeFilter = document.getElementById('job-type-filter');
        this.experienceFilter = document.getElementById('experience-filter');
        this.categoryFilter = document.getElementById('category-filter');
        this.dateFilter = document.getElementById('date-filter');
        this.filterBtn = document.querySelector('.filter-btn');
        
        // Add event listeners
        this.addEventListeners();
        
        this.initialized = true;
    }

    /**
     * Add event listeners to filter elements
     */
    addEventListeners() {
        // Apply filters button
        this.filterBtn.addEventListener('click', () => {
            this.applyFilters();
        });
        
        // Real-time filtering (optional)
        this.jobTypeFilter.addEventListener('change', () => this.applyFilters());
        this.experienceFilter.addEventListener('change', () => this.applyFilters());
        this.categoryFilter.addEventListener('change', () => this.applyFilters());
        this.dateFilter.addEventListener('change', () => this.applyFilters());
    }

    /**
     * Apply the selected filters
     */
    applyFilters() {
        // Get filter values
        this.filters.jobType = this.jobTypeFilter.value;
        this.filters.experienceLevel = this.experienceFilter.value;
        this.filters.category = this.categoryFilter.value;
        this.filters.datePosted = this.dateFilter.value;
        
        // Call the callback function with the updated filters
        if (typeof this.onFilterChange === 'function') {
            this.onFilterChange(this.filters);
        }
    }

    /**
     * Reset all filters to default values
     */
    resetFilters() {
        this.jobTypeFilter.value = '';
        this.experienceFilter.value = '';
        this.categoryFilter.value = '';
        this.dateFilter.value = '';
        
        this.applyFilters();
    }

    /**
     * Get the current filter values
     * @returns {Object} The current filters
     */
    getFilters() {
        return { ...this.filters };
    }

    /**
     * Set filter values programmatically
     * @param {Object} filters - The filter values to set
     */
    setFilters(filters) {
        if (filters.jobType !== undefined) {
            this.jobTypeFilter.value = filters.jobType;
            this.filters.jobType = filters.jobType;
        }
        
        if (filters.experienceLevel !== undefined) {
            this.experienceFilter.value = filters.experienceLevel;
            this.filters.experienceLevel = filters.experienceLevel;
        }
        
        if (filters.category !== undefined) {
            this.categoryFilter.value = filters.category;
            this.filters.category = filters.category;
        }
        
        if (filters.datePosted !== undefined) {
            this.dateFilter.value = filters.datePosted;
            this.filters.datePosted = filters.datePosted;
        }
    }
}

// Export the FilterComponent class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FilterComponent;
}