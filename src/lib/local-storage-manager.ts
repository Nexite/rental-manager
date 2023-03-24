import { Rental, RentalConstParams } from "./rental";

export class LocalStorageManager {
  constructor() {}

  write(rentals: Rental[]) {
    const rentalsString = JSON.stringify(rentals);
    localStorage.setItem("rentals", rentalsString);
  }

  load(): Rental[] {
    const rentals = localStorage?.getItem("rentals");
    if (rentals) {
      const parsed = JSON.parse(rentals);
      return parsed.map((parsedRental: RentalConstParams) => Rental.fromJSON(parsedRental));
    }
    return [];
  }
}
