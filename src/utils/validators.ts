export const isValidZipcode = (zipcode: string): boolean => /^[0-9]{5}$/.test(zipcode);
export const isValidLatitude = (lat: string): boolean => /^-?([1-8]?[0-9]|90)\.\d{1,6}$/.test(lat);
export const isValidLongitude = (lng: string): boolean => /^-?(180(\.0{1,6})?|((1[0-7][0-9]|[1-9]?[0-9])(\.\d{1,6})?))$/.test(lng);