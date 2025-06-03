
import { useState, useCallback } from 'react';
import { useWorkTimeLocations } from './use-work-time-locations';
import { useToast } from '@/components/ui/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface VerificationResult {
  isValid: boolean;
  location?: WorkTimeLocation;
  userLocation?: LocationData;
  distance?: number;
}

export function useLocationVerification() {
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const { locations } = useWorkTimeLocations();
  const { toast } = useToast();

  const getUserLocation = useCallback((): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no está disponible en este dispositivo'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setCurrentLocation(locationData);
          resolve(locationData);
        },
        (error) => {
          let message = 'Error al obtener la ubicación';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Permisos de ubicación denegados';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Ubicación no disponible';
              break;
            case error.TIMEOUT:
              message = 'Tiempo de espera agotado';
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const verifyLocation = useCallback(async (): Promise<VerificationResult> => {
    setLoading(true);
    
    try {
      const userLocation = await getUserLocation();
      const activeLocations = locations.filter(loc => loc.is_active && loc.latitude && loc.longitude);
      
      if (activeLocations.length === 0) {
        return { isValid: true, userLocation };
      }

      for (const location of activeLocations) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          location.latitude!,
          location.longitude!
        );

        if (distance <= location.radius_meters) {
          return {
            isValid: true,
            location,
            userLocation,
            distance
          };
        }
      }

      return {
        isValid: false,
        userLocation,
        distance: Math.min(...activeLocations.map(loc => 
          calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            loc.latitude!,
            loc.longitude!
          )
        ))
      };
    } catch (error) {
      console.error('Error verifying location:', error);
      toast({
        variant: "destructive",
        title: "Error de ubicación",
        description: error instanceof Error ? error.message : "No se pudo verificar la ubicación"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [locations, getUserLocation, toast]);

  const getUserIP = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP address:', error);
      throw new Error('No se pudo obtener la dirección IP');
    }
  }, []);

  const verifyIP = useCallback(async (allowedIPs: string[]): Promise<boolean> => {
    if (!allowedIPs || allowedIPs.length === 0) {
      return true;
    }

    try {
      const userIP = await getUserIP();
      return allowedIPs.includes(userIP);
    } catch (error) {
      console.error('Error verifying IP:', error);
      return false;
    }
  }, [getUserIP]);

  return {
    loading,
    currentLocation,
    getUserLocation,
    verifyLocation,
    verifyIP,
    getUserIP,
    calculateDistance
  };
}
