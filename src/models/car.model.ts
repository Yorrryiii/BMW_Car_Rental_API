export interface Car {
    id: number;
    plate: string;           // Unique identifier for the car
    model: string;
    status: 'available' | 'rented'; 
    parkingLocationId: number; // Reference to the parking location where the car is parked
  }
  