import { useState, useEffect } from "react";
import { RentalManager } from "./rental-manager";

export const useRentals = (rentalManagerInstance: RentalManager) => {
  const [rentals, setRentals] = useState(rentalManagerInstance.rentals);
  useEffect(
    () =>
      rentalManagerInstance.addListener(() => {
        setRentals(rentalManagerInstance.rentals);
      }),
    [rentalManagerInstance],
  );
  return [rentals];
};
