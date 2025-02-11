// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Flex,
  Heading,
  View,
  Text,
  TextField,
  SwitchField,
  SelectField,
  CheckboxField,
  Divider,
  Loader
} from '@aws-amplify/ui-react';
import { questions, Question } from '../data/questions';
import { useGeoLocation } from '../hooks/useGeoLocation';
// import { generateClient } from 'aws-amplify/data';
import { getCognitoUserId } from '../utils/auth';
// import type { Schema } from '../../amplify/data/resource';
import { motion, AnimatePresence } from 'framer-motion';
// import geohash from 'ngeohash'; // Ensure you install this package
import '../styles/SignupForm.css';

// const client = generateClient<Schema>();

const transformObjectToArray = (obj: any) =>
  Object.keys(obj).filter((key) => obj[key]);

const SignupForm: React.FC = () => {
  const { register, handleSubmit, control, setValue, trigger, formState: { errors, isSubmitting } } = useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const { location, getLocation, error: geoError } = useGeoLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location) {
      setValue('lat', location.lat);
      setValue('lng', location.lng);
    }
  }, [location, setValue]);

  const groupedQuestions = [
    questions.slice(0, 5),
    questions.slice(5, 10),
    questions.slice(10, 15),
    questions.slice(15),
  ];

  const onSubmit = async (data: any) => {
    try {
      const userId = await getCognitoUserId();

      const transformedData: any = {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        lookingFor: transformObjectToArray(data.lookingFor),
        kids: data.kids,
        drinking: data.drinking,
        lat: data.lat,
        lng: data.lng,
        hobbies: transformObjectToArray(data.hobbies),
        availability: transformObjectToArray(data.availability),
        married: data.married,
        ageRange: data.ageRange,
        friendAgeRange: transformObjectToArray(data.friendAgeRange),
        pets: data.pets,
        employed: data.employed,
        work: data.work,
        political: data.political,
      };

      console.log('Final Payload:', transformedData);

      // await client.models.GeoUserProfile.create(transformedData);
      alert('Sign up successful!');
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const handleNext = async () => {
    const currentFields = groupedQuestions[currentStep]
      .filter((q) => q.required)
      .map((q) => q.field);

    const isValid = await trigger(currentFields);

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleGetLocation = async () => {
    setIsLoading(true);
    await getLocation();
    setIsLoading(false);
  };

  const renderField = (question: Question) => {
    switch (question.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <TextField
            label={question.label}
            {...register(question.field, { required: question.required })}
            errorMessage={errors[question.field] && 'This field is required'}
          />
        );
      case 'switch':
        return (
          <Controller
            control={control}
            name={question.field}
            render={({ field }) => (
              <SwitchField
                label={question.label}
                isChecked={field.value || false}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        );
      case 'select':
        return (
          <SelectField
            label={question.label}
            {...register(question.field, { required: question.required })}
          >
            <option value="">Select...</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </SelectField>
        );
      case 'checkbox':
        return (
          <Flex wrap="wrap" gap="1rem">
            {question.options?.map((option) => (
              <Controller
                key={option}
                control={control}
                name={`${question.field}.${option}`}
                render={({ field }) => (
                  <CheckboxField
                    name={field.name}
                    label={option}
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            ))}
          </Flex>
        );
      case 'location':
        return (
          <Flex direction="column" gap="1rem">
            <Button onClick={handleGetLocation} isDisabled={isLoading}>
              {isLoading ? <Loader variation="linear" /> : 'Get My Location'}
            </Button>
            {geoError && <Text className="error-text">{geoError}</Text>}
            {location && (
              <Text>
                Latitude: {location.lat}, Longitude: {location.lng}
              </Text>
            )}
          </Flex>
        );
      default:
        return null;
    }
  };

  return (
    <View className='signup-form'> 
      {isLoading && <Loader variation="linear" />}  {/* Linear Loader at the top */}
      <Heading level={1}>Sign Up</Heading>
      <AnimatePresence>
        <motion.form
          key={currentStep}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          {groupedQuestions[currentStep].map((question: Question, index: number) => (
            <div key={question.field}>
              {renderField(question)}
              {errors[question.field] && (
                <Text className="required-warning">* This field is required</Text>
              )}
              {index < groupedQuestions[currentStep].length - 1 && <Divider size="small" />}
            </div>
          ))}

          <Flex className="navigation-buttons" gap="1rem">
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep((prev) => prev - 1)}>
                Back
              </Button>
            )}
            {currentStep < groupedQuestions.length - 1 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" isLoading={isSubmitting}>
                Submit
              </Button>
            )}
          </Flex>

          {geoError && <Text className="error-text">{geoError}</Text>}
        </motion.form>
      </AnimatePresence>
    </View>
  );
};

export default SignupForm;
