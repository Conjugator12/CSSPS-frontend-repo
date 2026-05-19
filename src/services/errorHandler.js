/**
 * Error handling utilities
 * Normalize various error formats from backend to user-friendly messages
 */

/**
 * Extract error message from various error formats
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return "An unexpected error occurred";

  // Axios error with response
  if (error.response) {
    const data = error.response.data;
    const status = error.response.status;

    // Handle validation errors (422)
    if (status === 422) {
      // Pydantic validation error format
      if (Array.isArray(data?.detail)) {
        return data.detail
          .map((err) => {
            if (typeof err === "object" && err.msg) {
              return err.msg;
            }
            return "Invalid input";
          })
          .join("; ");
      }
      // Simple detail string
      if (typeof data?.detail === "string") {
        return data.detail;
      }
    }

    // Handle 401/403 authentication errors
    if (status === 401 || status === 403) {
      return data?.detail || "Invalid index number or date of birth.";
    }

    // Handle 404 not found
    if (status === 404) {
      return data?.detail || "Resource not found";
    }

    // Handle 500 server errors
    if (status >= 500) {
      return "Server error. Please try again later.";
    }

    // Generic response error
    if (data?.detail) {
      return typeof data.detail === "string"
        ? data.detail
        : "An error occurred";
    }
  }

  // Network error
  if (error.message === "Network Error") {
    return "Network error. Please check your connection.";
  }

  // Timeout error
  if (error.code === "ECONNABORTED") {
    return "Request timeout. Please try again.";
  }

  // Generic error
  if (error.message) {
    return error.message;
  }

  return "An unexpected error occurred";
};

/**
 * Check if error response is a validation error
 * @param {Error} error
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return error?.response?.status === 422;
};

/**
 * Extract validation errors into a map
 * @param {Error} error
 * @returns {Object} Map of field names to error messages
 */
export const getValidationErrors = (error) => {
  const errors = {};

  if (
    error?.response?.status === 422 &&
    Array.isArray(error.response.data?.detail)
  ) {
    error.response.data.detail.forEach((err) => {
      if (err.loc && Array.isArray(err.loc) && err.msg) {
        const field = err.loc[1] || err.loc[0];
        errors[field] = err.msg;
      }
    });
  }

  return errors;
};
