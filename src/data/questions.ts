// src/data/questions.ts
export interface Question {
  field: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'checkbox' | 'switch' | 'location';
  required?: boolean;
  options?: string[];
  multi?: boolean; 
}

export const questions: Question[] = [
  {
    field: 'lookingFor',
    label: 'What are you looking for?',
    type: 'checkbox',
    required: true,
    options: ['Male Friends', 'Female Friends', 'Other Parents'],
    multi: true, // We'll convert to a single CSV string for storage
  },
  { field: 'kids', label: 'Do you have Kids?', type: 'switch' },
  { field: 'drinking', label: 'Do you drink Alcohol?', type: 'switch' },
  {
    field: 'hobbies',
    label: 'Hobbies?',
    type: 'checkbox',
    required: true,
    options: [
      'Sports',
      'Hiking',
      'Yoga',
      'Bowling',
      'Gaming',
      'Cooking',
      'Reading',
      'Traveling',
      'Dancing',
      'Music',
    ],
    multi: true, // We'll store as an actual array in final object
  },
  {
    field: 'availability',
    label: 'Availability?',
    type: 'checkbox',
    options: ['Weekends', 'Weeknights', 'WeekDays'],
    multi: true, // We'll store as an actual array
  },
  { field: 'married', label: 'Are you Married?', type: 'switch' },
  {
    field: 'ageRange',
    label: 'Your Age Range?',
    type: 'select',
    required: true,
    options: ['18-25', '25-35', '35-45', '45-55', '55-65', '65+'],
  },
  {
    field: 'friendAgeRange',
    label: 'Preferred Age Range for Friends?',
    type: 'checkbox',
    required: true,
    options: ['18-25', '25-35', '35-45', '45-55', '55-65', '65+'],
    multi: true, // We'll flatten to CSV
  },
  { field: 'pets', label: 'Have any Pets?', type: 'switch' },
  { field: 'employed', label: 'Are you Employed?', type: 'switch' },
  {
    field: 'work',
    label: 'What do you do for Work?',
    type: 'select',
    required: true,
    options: [
      'Technology',
      'Education',
      'Healthcare',
      'Finance',
      'Retail',
      'Hospitality',
      'Manufacturing',
      'Other',
    ],
  },
  {
    field: 'political',
    label: 'Political Views (Optional)?',
    type: 'select',
    options: ['Republican', 'Democrat', 'Libertarian', 'Green', 'Other'],
    multi: true, // If user might pick multiple, store CSV
  },
  // Single question for lat/lng
  {
    field: 'location',
    label: 'Location (Lat & Lng)',
    type: 'location',
    required: false,
  },
  { field: 'firstName', label: 'First Name?', type: 'text', required: true },
  { field: 'lastName', label: 'Last Name?', type: 'text', required: true },
];