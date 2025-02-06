import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import {
  View,
  Flex,
  Heading,
  TextField,
  Button,
  Text,
} from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

interface ProfileData {
  firstName: string;
  lastNameInitial: string;
  email: string;
  lookingFor: string;
  kids: string;
  zipcode: string;
  drinking: string;
  hobbies: (string | null)[];
  availability: (string | null)[];
  married: string;
  ageRange: string;
  friendAgeRange: string;
  pets: string;
  employed: string;
  work: string;
  political?: string | null;
  createdAt?: string | null;
}

const ProfilePage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // If there is an email query parameter, set it and fetch the profile.
    const emailQuery = searchParams.get('email');
    if (emailQuery) {
      setEmail(emailQuery);
      fetchProfile(emailQuery);
    }
  }, [searchParams]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const fetchProfile = async (emailToFetch: string) => {
    setLoading(true);
    setError(null);
    try {
      const profiles = await client.models.UserProfile.list({
        filter: {
          email: {
            eq: emailToFetch,
          },
        },
      });

      if (profiles.data.length === 0) {
        throw new Error('Profile not found');
      }

      const rawProfile = profiles.data[0];

      // Normalize hobbies and availability by filtering out any null values.
      const normalizedProfile: ProfileData = {
        firstName: rawProfile.firstName,
        lastNameInitial: rawProfile.lastNameInitial,
        email: rawProfile.email,
        lookingFor: rawProfile.lookingFor,
        kids: rawProfile.kids,
        zipcode: rawProfile.zipcode,
        drinking: rawProfile.drinking,
        hobbies: (rawProfile.hobbies || []).filter(
          (item): item is string => item !== null
        ),
        availability: (rawProfile.availability || []).filter(
          (item): item is string => item !== null
        ),
        married: rawProfile.married,
        ageRange: rawProfile.ageRange,
        friendAgeRange: rawProfile.friendAgeRange,
        pets: rawProfile.pets,
        employed: rawProfile.employed,
        work: rawProfile.work,
        political: rawProfile.political,
        createdAt: rawProfile.createdAt,
      };

      setProfile(normalizedProfile);
    } catch (err: any) {
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchProfile(email);
    // update the URL query string for bookmarking/sharing
    setSearchParams({ email });
  };

  return (
    <View padding="1rem">
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap="1rem"
        maxWidth="800px"
        margin="0 auto"
      >
        <Heading level={1}>User Detail Page</Heading>
        <View
          as="form"
          onSubmit={handleSubmit}
          width="100%"
          maxWidth={{ base: '90%', medium: '70%' }}
        >
          <TextField
            label="Enter Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="example@example.com"
            labelHidden={false}
          />
          <Button type="submit" variation="primary" isLoading={loading}>
            Fetch Profile
          </Button>
        </View>
        {loading && <Text>Loading profile...</Text>}
        {error && (
          <Text color="red" fontWeight="bold">
            {error}
          </Text>
        )}
        {profile && (
          <View
            border="1px solid var(--amplify-colors-neutral-60)"
            borderRadius="medium"
            padding="1rem"
            width="100%"
            marginTop="1rem"
          >
            <Heading level={2}>
              {profile.firstName} {profile.lastNameInitial}
            </Heading>
            <Text>Email: {profile.email}</Text>
            <Text>Looking For: {profile.lookingFor}</Text>
            <Text>Kids: {profile.kids}</Text>
            <Text>Zipcode: {profile.zipcode}</Text>
            <Text>Drinking: {profile.drinking}</Text>
            <Text>Hobbies: {profile.hobbies.join(', ')}</Text>
            <Text>Availability: {profile.availability.join(', ')}</Text>
            <Text>Married: {profile.married}</Text>
            <Text>Age Range: {profile.ageRange}</Text>
            <Text>Friend Age Range: {profile.friendAgeRange}</Text>
            <Text>Pets: {profile.pets}</Text>
            <Text>Employed: {profile.employed}</Text>
            <Text>Work: {profile.work}</Text>
            {profile.political && (
              <Text>Political Views: {profile.political}</Text>
            )}
            <Text>Created At: {profile.createdAt}</Text>
          </View>
        )}
      </Flex>
    </View>
  );
};

export default ProfilePage;