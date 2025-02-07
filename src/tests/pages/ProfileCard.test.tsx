// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import ProfileCard from '../../components/ProfileCard';
// import { GeoUserProfile } from '../../types';

// const mockProfile: GeoUserProfile = {
//   userId: '1',
//   firstName: 'John',
//   lastNameInitial: 'D',
//   email: 'john.d@example.com',
//   zipcode: '12345',
//   ageRange: '25-30',
//   married: 'No',
//   employed: 'Yes',
// };

// describe('ProfileCard', () => {
//   it('renders profile information correctly', () => {
//     render(<ProfileCard profile={mockProfile} />);
//     expect(screen.getByText('John D')).toBeInTheDocument();
//     expect(screen.getByText('john.d@example.com')).toBeInTheDocument();
//     expect(screen.getByText('Zipcode: 12345')).toBeInTheDocument();
//   });
// });