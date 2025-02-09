// src/types/index.ts
// This matches your Amplify Data model EXACTLY:
export type GeoUserProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  lookingFor: string;    // stored as a single string (CSV if multi-check)
  kids: boolean;
  drinking: boolean;
  lat: number;
  lng: number;
  hobbies: string[];     // stored as actual string array
  availability: string[]; 
  married: boolean;
  ageRange: string;      // single selection
  friendAgeRange: string; // stored as a single string (CSV if multi-check)
  pets: boolean;
  employed: boolean;
  work: string;
  political?: string;    
  createdAt?: string;
  updatedAt?: string;
};