// src/components/SignupForm.tsx
import React, { useState, FormEvent } from 'react';
import { Button, Flex, Heading, View, Text } from '@aws-amplify/ui-react';
import QuestionForm from './QuestionForm';
import { questions, Question } from '../data/questions';
import ProgressBar from './ProgressBar';
// import type { Schema } from '../../amplify/data/resource';
// import { generateClient } from 'aws-amplify/data';

// const client = generateClient<Schema>();

interface FormData {
  [key: string]: any;
}

const SignupForm: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Validate answer for required questions
  const isAnswerValid = (question: Question, answer: any): boolean => {
    if (!question.required) return true;
    switch (question.type) {
      case 'checkbox':
        return Array.isArray(answer) && answer.length > 0;
      case 'switch':
        // We expect a boolean value (true/false)
        return typeof answer === 'boolean';
      case 'slider':
        return typeof answer === 'number';
      default:
        return answer !== undefined && answer !== null && String(answer).trim() !== '';
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      // Transform the loosely typed formData into a profile that matches your schema
      // const profile = {
      //   // Use the email as the userId for this example (or generate your own)
      //   userId: formData.email,
      //   firstName: formData.firstName,
      //   lastNameInitial: formData.lastNameInitial,
      //   email: formData.email,
      //   // For multi-select checkboxes, join the array into a comma-separated string if desired.
      //   // Alternatively, you can leave them as arrays if your schema expects arrays.
      //   lookingFor: Array.isArray(formData.lookingFor)
      //     ? formData.lookingFor.join(', ')
      //     : formData.lookingFor,
      //   // Convert boolean values from SwitchFields to "yes"/"no"
      //   kids: formData.kids,
      //   zipcode: formData.zipcode,
      //   drinking: formData.drinking,
      //   hobbies: formData.hobbies || [],
      //   availability: formData.availability || [],
      //   married: formData.married,
      //   // Convert slider value (number) to string
      //   ageRange: String(formData.ageRange),
      //   friendAgeRange: formData.friendAgeRange,
      //   pets: formData.pets,
      //   employed: formData.employed,
      //   work: formData.work,
      //   political: formData.political || '',
      // };

      // Use the Amplify Data client to create the user profile
      // await client.models.UserProfile.create(profile);
      alert('Sign up successful!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestionObj: Question = questions[currentQuestion];
  const currentAnswer = formData[currentQuestionObj.field];
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