declare module 'ngeohash' {
    export function encode(latitude: number, longitude: number, precision?: number): string;
    export function decode(geohash: string): { latitude: number; longitude: number };
    export function bounds(geohash: string): [[number, number], [number, number]];
    export function neighbor(geohash: string, direction: string): string;
  }