// src/services/modelServices.ts
import { callApi } from './awsApi';

// Types for your models
interface GeoItem {
  hashKey: string;
  rangeKey: string;
  lat: number;
  lng: number;
  userId: string;
}

interface Contact {
  email: string;
  name: string;
  summary: string;
}

interface Chat {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
}

// GeoItem service
export const geoItemService = {
  async create(data: Partial<GeoItem>) {
    return callApi('/geoitems', 'POST', data, true);
  },

  async get(id: string) {
    return callApi(`/geoitems/${id}`, 'GET', null, true);
  },

  async list(params?: { limit?: number; nextToken?: string }) {
    return callApi('/geoitems', 'GET', params, true);
  },

  async update(id: string, data: Partial<GeoItem>) {
    return callApi(`/geoitems/${id}`, 'PUT', data, true);
  },

  async delete(id: string) {
    return callApi(`/geoitems/${id}`, 'DELETE', null, true);
  },

  async searchByLocation(lat: number, lng: number, radius: number) {
    return callApi('/geoitems/search', 'POST', { lat, lng, radius }, true);
  },

  async getByUserId(userId: string) {
    return callApi(`/geoitems/user/${userId}`, 'GET', null, true);
  }
};

// Contact service (allows guest access)
export const contactService = {
  async create(data: Partial<Contact>) {
    return callApi('/contacts', 'POST', data, false);
  },

  async get(id: string) {
    return callApi(`/contacts/${id}`, 'GET', null, false);
  },

  async list(params?: { limit?: number; nextToken?: string }) {
    return callApi('/contacts', 'GET', params, false);
  },

  async update(id: string, data: Partial<Contact>) {
    return callApi(`/contacts/${id}`, 'PUT', data, false);
  },

  async delete(id: string) {
    return callApi(`/contacts/${id}`, 'DELETE', null, false);
  },

  async searchByEmail(email: string) {
    return callApi('/contacts/search', 'POST', { email }, false);
  },

  async bulkCreate(contacts: Partial<Contact>[]) {
    return callApi('/contacts/bulk', 'POST', { contacts }, false);
  }
};

// Chat service
export const chatService = {
  async create(data: Partial<Chat>) {
    return callApi('/chats', 'POST', data, true);
  },

  async get(id: string) {
    return callApi(`/chats/${id}`, 'GET', null, true);
  },

  async list(params?: { limit?: number; nextToken?: string }) {
    return callApi('/chats', 'GET', params, true);
  },

  async update(id: string, data: Partial<Chat>) {
    return callApi(`/chats/${id}`, 'PUT', data, true);
  },

  async delete(id: string) {
    return callApi(`/chats/${id}`, 'DELETE', null, true);
  },

  async getConversation(senderId: string, receiverId: string, params?: { 
    limit?: number; 
    nextToken?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return callApi('/chats/conversation', 'POST', {
      senderId,
      receiverId,
      ...params
    }, true);
  },

  async getUserChats(userId: string) {
    return callApi(`/chats/user/${userId}`, 'GET', null, true);
  },

  async markAsRead(chatId: string) {
    return callApi(`/chats/${chatId}/read`, 'POST', null, true);
  },

  async getUnreadCount(userId: string) {
    return callApi(`/chats/unread/${userId}`, 'GET', null, true);
  }
};

// Shared types for pagination and responses
export interface PaginatedResponse<T> {
  items: T[];
  nextToken?: string;
}

export interface SearchResponse<T> {
  items: T[];
  total: number;
  nextToken?: string;
}

// Error types
export class ServiceError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

// Helper function to handle common error cases
export function handleServiceError(error: unknown): never {
  if (error instanceof ServiceError) {
    throw error;
  }
  
  if (error instanceof Error) {
    throw new ServiceError(error.message);
  }
  
  throw new ServiceError('An unknown error occurred');
}

// Usage example:
/*
try {
  // Create a new GeoItem
  const newGeoItem = await geoItemService.create({
    lat: 123.456,
    lng: 789.012,
    userId: 'user123'
  });

  // Search for contacts
  const contacts = await contactService.searchByEmail('user@example.com');

  // Get chat conversation
  const conversation = await chatService.getConversation('user1', 'user2', {
    limit: 20,
    startDate: new Date('2023-01-01')
  });
} catch (error) {
  handleServiceError(error);
}
*/
