export interface User {
    id: number;
    name: string;            // User's full name
    email: string;           // User's email address
    phone: string;           // User's phone number
    role?: string;           // Optional field for the user's role (e.g., customer, admin)
    location?: string;       // Optional field for the user's location/address
    age?: number;            // Optional field for the user's age
  }
  