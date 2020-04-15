/**
 * Class representing an API Resonse.
 */
export class APIResponse {
  data: any;
  message: string;
  status: number;
  error: any;
  /**
   * Creates an API Response.
   * @param {JSONObjects} Data - data of API response.
   * @param {string} message - Response message.
   * @param {number} status - Application staus.
   * @param {JSONObjects} error - if status is partial.
   */
  constructor(data = null, message = '', status = 200, error = null) {
    if (data) {
      this.data = data;
    }
    
    if (message) {
      this.message = message;
    }

    if (status) {
      this.status = status;
    }

    if (error) {
      this.error = error;
    }
  }
}

