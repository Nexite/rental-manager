import { LocalStorageManager } from "@/lib/local-storage-manager";
import { Rental, RentalUpdateParams } from "@/lib/rental";
import { SearchType, RentalManager, SortType } from "@/lib/rental-manager";
import { useRentals } from "@/lib/useRentals";
import { useToast } from "@chakra-ui/react";
import { useState, useEffect, PropsWithChildren, createContext, useCallback, useMemo } from "react";

export const RentalContext = createContext<
  [
    Rental[],
    (rental: Rental) => void | undefined,
    (nameOrAddress: string, searchType: SearchType) => void | undefined,
    (nameOrAddress: string, searchType?: SearchType | undefined) => Rental[] | undefined,
    (sortType?: SortType | undefined) => void | undefined,
    (
      nameOrAddress: string,
      updates: RentalUpdateParams,
      searchType?: SearchType,
    ) => void | undefined,
  ]
>([
  [],
  function (_rental: Rental): void | undefined {},
  function (_nameOrAddress: string, _searchType: SearchType): void | undefined {},
  function (_nameOrAddress: string, _searchType?: SearchType | undefined): Rental[] {
    return [];
  },
  function (_sortType?: SortType | undefined): void | undefined {},
  function (
    _nameOrAddress: string,
    _updates: RentalUpdateParams,
    _searchType?: SearchType,
  ): void | undefined {},
]);

// useErrorToast is a custom hook that wraps a function and catches any errors that are thrown
// and displays them as a toast
export function useErrorToast<T extends any[], R>(fn: (...x: T) => R) {
  // useToast is a Chakra UI hook that displays a toast
  const toast = useToast();
  // callback function that wraps the function and catches any errors that are thrown
  return (...x: T) => {
    try {
      return fn(...x);
    } catch (error: any) {
      console.error(error);
      // display the error as a toast
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
}

export default function RentalProvider({ children }: PropsWithChildren<{}>) {
  // useMemo is used to ensure that the rentalManager is only created once and doesn't get duplicated on a re-render
  const rentalManager = useMemo(() => new RentalManager(), []);
  const localStorageManager = new LocalStorageManager();

  // useRentals is a custom hook that returns the rentals and adds an event listener to update the rentals when they change
  const [rentals] = useRentals(rentalManager);
  const [hasDataLoaded, setHasDataLoaded] = useState(false);

  useEffect(() => {
    if (!hasDataLoaded && typeof window !== "undefined") {
      const loadedRentals = localStorageManager.load();
      loadedRentals.forEach((rental) => {
        try {
          rentalManager.addRental(rental);
        } catch (error) {
          console.error(error);
        }
      });
      setHasDataLoaded(true);
    }
    return () => {
      setHasDataLoaded(false);
      rentalManager.unmount();
    };
  }, []);

  useEffect(() => {
    if (hasDataLoaded) {
      localStorageManager.write(rentals);
    }
  }, [rentals]);

  const addRental = useErrorToast(
    useCallback((rental: Rental) => rentalManager.addRental(rental), [rentalManager]),
  );

  const deleteRental = useErrorToast(
    // useCallback is used to ensure that the function is only created once
    // and doesn't get duplicated on a re-render
    useCallback(
      (nameOrAddress: string, searchType: SearchType) =>
        rentalManager.deleteRental(nameOrAddress, searchType),
      [rentalManager],
    ),
  );

  const searchRental = useErrorToast(
    useCallback(
      (nameOrAddress: string, searchType: SearchType = SearchType.Name) =>
        rentalManager.searchRental(nameOrAddress, searchType),
      [rentalManager],
    ),
  );

  const sortRentals = useErrorToast(
    useCallback(
      (sortType: SortType = SortType.Name) => rentalManager.sortRentals(sortType),
      [rentalManager],
    ),
  );

  const editRental = useErrorToast(
    useCallback(
      (searchTerm: string, updates: RentalUpdateParams, sortType: SearchType = SearchType.Name) =>
        rentalManager.editRental(searchTerm, updates, sortType),
      [rentalManager],
    ),
  );

  return (
    <RentalContext.Provider
      value={[rentals, addRental, deleteRental, searchRental, sortRentals, editRental]}
    >
      {children}
    </RentalContext.Provider>
  );
}
