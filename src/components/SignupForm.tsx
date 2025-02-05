import React, { useState, ChangeEvent, FormEvent } from 'react';
import ProgressBar from './ProgressBar';

interface FormData {
  firstName: string;
  lastNameInitial: string;
  email: string;
  password: string;
  lookingFor: string;
  kids: string;
  zipcode: string;
  drinking: string;
  hobbies: string[];
  availability: string[];
  married: string;
  ageRange: string;
  friendAgeRange: string;
  pets: string;
  employed: string;
  work: string;
  political?: string;
}

const SignupForm: React.FC = () => {
  // Break the form into multiple steps
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastNameInitial: '',
    email: '',
    password: '',
    lookingFor: '',
    kids: '',
    zipcode: '',
    drinking: '',
    hobbies: [],
    availability: [],
    married: '',
    ageRange: '',
    friendAgeRange: '',
    pets: '',
    employed: '',
    work: '',
    political: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    'Basic Info',
    'Preferences',
    'Hobbies & Availability',
    'Age & Pets',
    'Employment',
    'Political'
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // For fields that allow multiple selections (like hobbies/availability)
  const handleArrayChange = (name: keyof FormData, value: string) => {
    setFormData(prev => {
      const array = (prev[name] as unknown as string[]) || [];
      return {
        ...prev,
        [name]: array.includes(value)
          ? array.filter(item => item !== value)
          : [...array, value]
      };
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }
      alert('Sign up successful!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2>Basic Info</h2>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Last Name Initial:
              <input
                type="text"
                name="lastNameInitial"
                value={formData.lastNameInitial}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        );
      case 1:
        return (
          <div>
            <h2>Preferences</h2>
            <label>
              Looking For:
              <input
                type="text"
                name="lookingFor"
                value={formData.lookingFor}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Kids (Yes/No):
              <input
                type="text"
                name="kids"
                value={formData.kids}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Zipcode:
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Drinking (e.g. Yes/No or frequency):
              <input
                type="text"
                name="drinking"
                value={formData.drinking}
                onChange={handleChange}
              />
            </label>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Hobbies & Availability</h2>
            <label>
              Hobbies (Select multiple):
              <div>
                {['Sports', 'Hiking', 'Yoga', 'Bowling', 'Gaming', 'Cooking', 'Reading', 'Traveling', 'Dancing', 'Music'].map((hobby) => (
                  <label key={hobby} style={{ marginRight: '10px' }}>
                    <input
                      type="checkbox"
                      name="hobbies"
                      value={hobby}
                      checked={formData.hobbies.includes(hobby)}
                      onChange={() => handleArrayChange('hobbies', hobby)}
                    />
                    {hobby}
                  </label>
                ))}
              </div>
            </label>
            <br />
            <label>
              Availability (Select multiple):
              <div>
                {['Weekends', 'Weeknights'].map((slot) => (
                  <label key={slot} style={{ marginRight: '10px' }}>
                    <input
                      type="checkbox"
                      name="availability"
                      value={slot}
                      checked={formData.availability.includes(slot)}
                      onChange={() => handleArrayChange('availability', slot)}
                    />
                    {slot}
                  </label>
                ))}
              </div>
            </label>
            <br />
            <label>
              Married (Yes/No):
              <input
                type="text"
                name="married"
                value={formData.married}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Age & Pets</h2>
            <label>
              Your Age Range:
              <input
                type="text"
                name="ageRange"
                value={formData.ageRange}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Your Age Range of Friends:
              <input
                type="text"
                name="friendAgeRange"
                value={formData.friendAgeRange}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Do you have any pets? (Yes/No):
              <input
                type="text"
                name="pets"
                value={formData.pets}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        );
      case 4:
        return (
          <div>
            <h2>Employment</h2>
            <label>
              Employed (Yes/No):
              <input
                type="text"
                name="employed"
                value={formData.employed}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              What do you do for work?
              <select name="work" value={formData.work} onChange={handleChange} required>
                <option value="">Select one</option>
                {['Technology', 'Education', 'Healthcare', 'Finance', 'Retail', 'Hospitality', 'Manufacturing', 'Other'].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
        );
      case 5:
        return (
          <div>
            <h2>Political (Optional)</h2>
            <label>
              Political Views (or leave blank if you prefer not to answer):
              <input
                type="text"
                name="political"
                value={formData.political}
                onChange={handleChange}
              />
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div style={{ marginTop: '20px' }}>
          {currentStep > 0 && (
            <button type="button" onClick={prevStep}>
              Back
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button type="button" onClick={nextStep}>
              Next
            </button>
          )}
          {currentStep === steps.length - 1 && (
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default SignupForm;
