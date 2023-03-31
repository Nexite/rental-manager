import { useState, useEffect } from "react";
import { RentalManager } from "./rental-manager";

export const useRentals = (rentalManagerInstance: RentalManager) => {
  // create a state variable to hold the rentals
  const [rentals, setRentals] = useState(rentalManagerInstance.rentals);
  // add eventListener that updates the state variable when the rentals change
  useEffect(
    () =>
      rentalManagerInstance.addListener(() => {
        setRentals(rentalManagerInstance.rentals);
      }),
    [rentalManagerInstance],
  );
  // return the rentals for hook consumers
  return [rentals];
};
