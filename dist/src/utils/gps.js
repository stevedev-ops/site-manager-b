"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySiteLocation = exports.calculateDistance = void 0;
/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @returns Distance in meters
 */
const calculateDistance = (location1, location2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (location1.latitude * Math.PI) / 180;
    const φ2 = (location2.latitude * Math.PI) / 180;
    const Δφ = ((location2.latitude - location1.latitude) * Math.PI) / 180;
    const Δλ = ((location2.longitude - location1.longitude) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
};
exports.calculateDistance = calculateDistance;
/**
 * Verify if user location is within site radius
 */
const verifySiteLocation = (userLocation, siteLocation, radiusMeters = 200) => {
    const distance = (0, exports.calculateDistance)(userLocation, siteLocation);
    return distance <= radiusMeters;
};
exports.verifySiteLocation = verifySiteLocation;
//# sourceMappingURL=gps.js.map