import React from 'react';
import { GeoUserProfile } from '../types';
import { View, Flex, Heading, Text} from '@aws-amplify/ui-react';


interface ProfileCardProps {
  profile: GeoUserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => (
<View padding="1rem">
      <Flex direction="column" alignItems="center" justifyContent="center" gap="1rem" maxWidth="800px" margin="0 auto">
        <Heading level={1}>User Detail Page</Heading>
        {/* <View as="form" onSubmit={handleSubmit} width="100%" maxWidth={{ base: '90%', medium: '70%' }}>
          <TextField label="Enter Email" type="email" value={email} onChange={handleEmailChange} required placeholder="example@example.com" />
          <Button type="submit" variation="primary" isLoading={loading}>
            Fetch Profile
          </Button>
        </View> */}
        {/* {loading && <Loader variation="linear" ariaLabel="Loading profile..." style={{ width: '100%', height: '4rem' }} />}
        {error && <Message variation="filled" className="error-message">{error}</Message>}
        {profile && ( */}
          <View border="1px solid var(--amplify-colors-neutral-60)" borderRadius="medium" padding="1rem" width="100%" marginTop="1rem">
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
            {/* {profile.political && <Text>Political Views: {profile.political}</Text>} */}
            <Text>Created At: {profile.createdAt}</Text>
          </View>
        {/* )} */}
      </Flex>
    </View>
);

export default ProfileCard;