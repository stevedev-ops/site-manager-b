import { GPSLocation } from '../types';
/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @returns Distance in meters
 */
export declare const calculateDistance: (location1: GPSLocation, location2: GPSLocation) => number;
/**
 * Verify if user location is within site radius
 */
export declare const verifySiteLocation: (userLocation: GPSLocation, siteLocation: GPSLocation, radiusMeters?: number) => boolean;
//# sourceMappingURL=gps.d.ts.map