export interface GeoUserProfile {
  id: string | null;
  userId: string;
  firstName: string;
  lastNameInitial: string;
  email: string;
  lookingFor: string;
  kids: string;
  zipcode: string;
  drinking: string;
  lat: number;
  lng: number;
  hobbies: (string | null)[];
  availability: (string | null)[];
  married: string | null;
  ageRange: string;
  friendAgeRange: string;
  pets: string;
  employed: string;
  work: string;
  political?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}