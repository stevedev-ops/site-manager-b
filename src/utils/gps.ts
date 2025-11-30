import { GPSLocation } from '../types';

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @returns Distance in meters
 */
export const calculateDistance = (
    location1: GPSLocation,
    location2: GPSLocation
): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (location1.latitude * Math.PI) / 180;
    const φ2 = (location2.latitude * Math.PI) / 180;
    const Δφ = ((location2.latitude - location1.latitude) * Math.PI) / 180;
    const Δλ = ((location2.longitude - location1.longitude) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

/**
 * Verify if user location is within site radius
 */
export const verifySiteLocation = (
    userLocation: GPSLocation,
    siteLocation: GPSLocation,
    radiusMeters: number = 200
): boolean => {
    const distance = calculateDistance(userLocation, siteLocation);
    return distance <= radiusMeters;
};
