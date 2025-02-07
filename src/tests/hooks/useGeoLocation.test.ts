// import { renderHook, act } from '@testing-library/react-hooks';
// import { useGeoLocation } from '../../hooks/useGeoLocation';

// xdescribe('useGeoLocation', () => {
//   it('should return location when geolocation is available', () => {
//     const mockGeolocation = {
//       getCurrentPosition: jest.fn((success) =>
//         success({ coords: { latitude: 51.1, longitude: 45.3 } })
//       ),
//     };
//     global.navigator.geolocation = mockGeolocation as any;

//     const { result } = renderHook(() => useGeoLocation());
//     act(() => result.current.getLocation());

//     expect(result.current.location).toEqual({ lat: 51.1, lng: 45.3 });
//   });
// });