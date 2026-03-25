import { apiClient } from './client';
import { ApiResponse } from '@/types';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactAPI = {
  // Send contact form
  sendContactForm: async (data: ContactFormData) => {
    const response = await apiClient.post<ApiResponse<null>>('/contact/send', data);
    return response.data;
  },
};
