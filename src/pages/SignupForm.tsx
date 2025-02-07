// src/components/SignupForm.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { Button, Flex, Heading, View, Text } from '@aws-amplify/ui-react';
import { questions, Question } from '../data/questions';
import QuestionForm from '../components/QuestionForm';
import ProgressBar from '../components/ProgressBar';
import { useGeoLocation } from '../hooks/useGeoLocation';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { GeoUserProfile } from '../types';

// Amplify data client
const client = generateClient<Schema>();

/** 
 * Some questions like 'password' or 'location' aren't in your GeoUserProfile,
 * so let's define a form state that extends it with optional fields.
 */
type FormDataType = Partial<GeoUserProfile> & {
  password?: string;
  location?: { lat?: number | string; lng?: number | string };
};

const SignupForm: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Geolocation hook
  const { location, getLocation, error: geoError } = useGeoLocation();

  // If location changes, sync it into formData for question "location"
  useEffect(() => {
    if (location) {
      setFormData((prev) => ({
        ...prev,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
      }));
    }
  }, [location]);

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // Move to previous question
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  // Validate required answers
  const isAnswerValid = (question: Question, answer: any): boolean => {
    if (!question.required) return true;
    switch (question.type) {
      case 'checkbox':
        return Array.isArray(answer) && answer.length > 0;
      case 'switch':
        // Expecting boolean
        return typeof answer === 'boolean';
      case 'location':
        // If location is required, check lat/lng
        return !!(answer?.lat && answer?.lng);
      default:
        return answer !== undefined && answer !== null && String(answer).trim() !== '';
    }
  };

  // For multi-check arrays that must be stored as a single string, we do CSV
  const arrayToCSV = (val: any) => (Array.isArray(val) ? val.join(', ') : '');

  // field change handler
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit final form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Build final object. Because your Amplify Data model expects:
      // - booleans for kids, married, etc.
      // - string for lookingFor, friendAgeRange
      // - string[] for hobbies, availability
      // - number for lat, lng
      // - optional string for political

      const finalProfile: any = {
        userId: formData.email || '', // Or however you generate userId
        firstName: formData.firstName || '',
        lastNameInitial: formData.lastNameInitial || '',
        email: formData.email || '',
        lookingFor: formData.lookingFor
          ? arrayToCSV(formData.lookingFor)
          : '', // flatten to CSV if multi
        kids: !!formData.kids,       // ensure boolean
        zipcode: formData.zipcode || '',
        drinking: !!formData.drinking,
        lat: Number(formData.location?.lat) || 0,
        lng: Number(formData.location?.lng) || 0,
        // If user didn't select any, default to []
        hobbies: Array.isArray(formData.hobbies) ? formData.hobbies : [],
        availability: Array.isArray(formData.availability)
          ? formData.availability
          : [],
        married: !!formData.married,
        ageRange: formData.ageRange || '',
        friendAgeRange: formData.friendAgeRange
          ? arrayToCSV(formData.friendAgeRange)
          : '',
        pets: !!formData.pets,
        employed: !!formData.employed,
        work: formData.work || '',
        political: formData.political
          ? arrayToCSV(formData.political)
          : undefined,
      };
      await client.models.GeoUserProfile.create(finalProfile);
      alert('Sign up successful!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Current question info
  const currentQuestionObj: Question = questions[currentQuestion];
  const currentAnswer = (formData as any)[currentQuestionObj.field]; // simpler
  const isCurrentAnswerValid = isAnswerValid(currentQuestionObj, currentAnswer);

  return (
    <View as="main" padding="2rem">
      <Heading level={1}>Sign Up</Heading>
      <ProgressBar currentStep={currentQuestion + 1} totalSteps={questions.length} />

      <form onSubmit={handleSubmit}>
        <QuestionForm
          question={currentQuestionObj}
          value={currentAnswer}
          onChange={handleFieldChange}
        />

        {/* Only show "Get My Location" button if this question is type: 'location' */}
        {currentQuestionObj.type === 'location' && (
          <>
            <Button onClick={getLocation} marginTop="1rem">
              Get My Location
            </Button>
            {geoError && (
              <Text color="red" marginTop="0.5rem">
                {geoError}
              </Text>
            )}
          </>
        )}

        <Flex direction="row" gap="1rem" marginTop="20px">
          {currentQuestion > 0 && (
            <Button onClick={prevQuestion} variation="primary">
              Back
            </Button>
          )}
          {currentQuestion < questions.length - 1 && (
            <Button
              onClick={nextQuestion}
              variation="primary"
              disabled={currentQuestionObj.required && !isCurrentAnswerValid}
            >
              Next
            </Button>
          )}
          {currentQuestion === questions.length - 1 && (
            <Button
              type="submit"
              variation="primary"
              isLoading={isSubmitting}
              disabled={currentQuestionObj.required && !isCurrentAnswerValid}
            >
              Submit
            </Button>
          )}
        </Flex>

        {error && (
          <Text color="red" marginTop="1rem">
            {error}
          </Text>
        )}
      </form>
    </View>
  );
};

export default SignupForm;