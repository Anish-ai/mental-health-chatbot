// frontend/src/utils/dateUtils.js
/**
 * Format a date to a human-readable string
 * @param {Date|string|number} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    // Check if valid date
    if (isNaN(dateObj.getTime())) return '';
    
    // Format: "March 9, 2025 at 2:30 PM"
    return dateObj.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).replace(',', ' at');
  };
  
  /**
   * Get relative time string (e.g., "2 hours ago")
   * @param {Date|string|number} date - The date to format
   * @returns {string} Relative time string
   */
  export const getRelativeTime = (date) => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    // Check if valid date
    if (isNaN(dateObj.getTime())) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      return formatDate(dateObj);
    }
  };