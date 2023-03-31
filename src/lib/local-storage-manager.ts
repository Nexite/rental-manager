import { Rental, RentalConstParams } from "./rental";

export class LocalStorageManager {
  constructor() {}

  // save rentals to local storage
  write(rentals: Rental[]) {
    const rentalsString = JSON.stringify(rentals);
    localStorage.setItem("rentals", rentalsString);
  }

  load(): Rental[] {
    // get rentals from local storage
    const rentals = localStorage?.getItem("rentals");
    if (rentals) {
      // parse rentals from string to array of Rental objects
      const parsed = JSON.parse(rentals);
      // map parsed rentals to Rental objects
      return parsed.map((parsedRental: RentalConstParams) => Rental.fromJSON(parsedRental));
    }
    // if rentals is null, return empty array
    return [];
  }
}
