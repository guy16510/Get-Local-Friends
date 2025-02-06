// src/data/questions.ts

export interface Question {
    field: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'select' | 'checkbox' | 'switch' | 'slider';
    required?: boolean;
    options?: string[];
    multi?: boolean; // For checkboxes that allow multiple selections
  
    // Optional slider configuration
    min?: number;
    max?: number;
    defaultValue?: number;
  }
  
  export const questions: Question[] = [
    // Preferences
    // Use a CheckboxField for "Looking For" with three options
    {
      field: 'lookingFor',
      label: 'What are you looking for?',
      type: 'checkbox',
      required: true,
      options: ['Male Friends', 'Female Friends', 'Other Parents'],
      multi: true,
    },
    // Yes/No question for Kids (SwitchField)
    { field: 'kids', label: 'Do you have any Kids?', type: 'switch' },
  
    { field: 'zipcode', label: 'What is your Zipcode?', type: 'text', required: true },
    { field: 'drinking', label: 'Do you Drink Alcohol?', type: 'switch'},
  
    // Hobbies & Availability
    {
      field: 'hobbies',
      label: 'Do you have any Hobbies?',
      type: 'checkbox',
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
        'Music'
      ],
      multi: true,
      required: true 
    },
    {
      field: 'availability',
      label: 'What is your Availability?',
      type: 'checkbox',
      options: ['Weekends', 'Weeknights', 'WeekDays'],
      multi: true,
    },
  
    // More Preferences
    { field: 'married', label: 'Are you Married?', type: 'switch' },
  
    // Age & Pets
    // Use a SliderField for "Your Age Range" so the user can specify the range in which they’d like to be considered
    {
      field: 'ageRange',
      label: 'What is your Age Range?',
      type: 'select',
      required: true,
      options: ['18-25', '25-35', '35-45', '45-55', '55-65', '65+'],
    },
    // Use a SelectField for Preferred Age Range for Friends, so a 40‑year‑old isn’t paired with a 21‑year‑old
    {
      field: 'friendAgeRange',
      label: 'What is your preferred Age Range for Friends?',
      type: 'checkbox',
      required: true,
      options: ['18-25', '25-35', '35-45', '45-55', '55-65', '65+'],
      multi: true,
    },
    { field: 'pets', label: 'Do you have any Pets?', type: 'switch' },
  
    // Employment
    { field: 'employed', label: 'Are you Employed?', type: 'switch'},
    {
      field: 'work',
      label: 'What do you do for work?',
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
        'Other'
      ]
    },
  
    // Optional
    {
      field: 'political',
      label: 'What are your Political Views (Optional)?',
      type: 'select',
      options: [
        'Republican',
        'Democrat',
        'Libertarian',
        'Green',
        'Other'
      ],
      multi: true,
    },
    { field: 'firstName', label: 'What is your First Name?', type: 'text', required: true },
    { field: 'lastNameInitial', label: 'What is your Last Name Initial?', type: 'text', required: true },
    { field: 'email', label: 'What is your Email?', type: 'email', required: true },
    { field: 'password', label: 'Enter a Password', type: 'password', required: true },
  ];