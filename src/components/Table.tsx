import React from 'react';
import { UserProfile } from '../types';

interface TableProps {
  data: UserProfile[];
  onRowClick: (profile: UserProfile) => void;
}

const Table: React.FC<TableProps> = ({ data, onRowClick }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Zipcode</th>
        <th>Age Range</th>
      </tr>
    </thead>
    <tbody>
      {data.map((profile) => (
        <tr key={profile.userId} onClick={() => onRowClick(profile)} style={{ cursor: 'pointer' }}>
          <td>{`${profile.firstName} ${profile.lastNameInitial}`}</td>
          <td>{profile.email}</td>
          <td>{profile.zipcode}</td>
          <td>{profile.ageRange}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;