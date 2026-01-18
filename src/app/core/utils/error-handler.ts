import { HttpErrorResponse } from '@angular/common/http';

/**
 * Utility functions for handling HTTP errors
 */
export class ErrorHandler {
  
  /**
   * Extract error message from HttpErrorResponse
   * Handles different error response formats from the backend
   */
  static extractErrorMessage(error: any): string {
    // If it's an HttpErrorResponse
    if (error instanceof HttpErrorResponse) {
      // Check for error.error.message (most common backend format)
      if (error.error?.message) {
        return error.error.message;
      }
      
      // Check for error.error.error (alternative format)
      if (error.error?.error) {
        return error.error.error;
      }
      
      // Check for error.message
      if (error.message) {
        return error.message;
      }
      
      // Check for error.statusText
      if (error.statusText) {
        return error.statusText;
      }
    }
    
    // If it's a plain error object
    if (error?.message) {
      return error.message;
    }
    
    // If it's a string
    if (typeof error === 'string') {
      return error;
    }
    
    // Default fallback
    return 'An unexpected error occurred';
  }

  /**
   * Get user-friendly error message based on HTTP status code
   */
  static getStatusMessage(status: number): string {
    const statusMessages: { [key: number]: string } = {
      400: 'Invalid request. Please check your input.',
      401: 'You are not authorized. Please login again.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      409: 'This operation conflicts with existing data.',
      422: 'The data provided is invalid.',
      500: 'Server error. Please try again later.',
      502: 'Server is temporarily unavailable.',
      503: 'Service is currently unavailable.'
    };
    
    return statusMessages[status] || 'An error occurred';
  }

  /**
   * Get complete error message combining status and backend message
   */
  static getCompleteErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      const backendMessage = this.extractErrorMessage(error);
      const statusMessage = this.getStatusMessage(error.status);
      
      // If backend message is different from status message, combine them
      if (backendMessage !== statusMessage && backendMessage !== 'An unexpected error occurred') {
        return backendMessage;
      }
      
      return statusMessage;
    }
    
    return this.extractErrorMessage(error);
  }
}
