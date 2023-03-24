import { Rental } from "./rental";

export enum SearchType {
  Name = "name",
  Address = "address",
}

export enum SortType {
  Name = "name",
  Address = "address",
  Revenue = "monthlyRevenue",
}

export class RentalManager {
  #rentals: Rental[];
  #listeners: ((rentals: Rental[]) => void)[] = [];

  constructor(rentals: Rental[] = []) {
    this.#rentals = rentals;
    // sort rentals by name by default
    this.sortRentals(SortType.Name);
  }

  addListener = (fn: (rentals: Rental[]) => void) => {
    this.#listeners.push(fn);
    return () => {
      this.#listeners = this.#listeners.filter((l) => l !== fn);
    };
  };
  notify() {
    this.#listeners.forEach((l) => {
      l(this.#rentals);
    });
  }
  unmount() {
    this.#rentals = [];
    this.#listeners = [];
  }

  get rentals(): Rental[] {
    return [...this.#rentals];
  }

  addRental(rental: Rental): void {
    // check if rental already exists
    for (const existingRental of this.#rentals) {
      if (existingRental.name === rental.name && existingRental.address.toString() === rental.address.toString()) {
        throw new Error("Rental with same name already exists");
      }
    }
    rental.addListener(() => this.notify());
    // otherwise, add rental
    this.#rentals.push(rental);
    this.notify();
  }

  deleteRental(nameOrAddress: string, searchType: SearchType) {
    // SearchType enum gives us property name, so we can use it to access the property of the rental class
    const rentalIndex = this.#rentals.findIndex((rental) => rental[searchType] === nameOrAddress);
    if (rentalIndex === -1) {
      throw new Error("Rental not found");
    }
    this.#rentals.splice(rentalIndex, 1);
    this.notify();
  }

  sortRentals(sortType: SortType = SortType.Name): void {
    switch (sortType) {
      case SortType.Name:
        this.#rentals.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SortType.Address:
        this.#rentals.sort((a, b) => a.address.street.localeCompare(b.address.street));
        break;
      case SortType.Revenue:
        this.#rentals.sort((a, b) => a.monthlyRevenue - b.monthlyRevenue);
        break;
    }
    this.notify();
  }

  searchRental(searchTerm: string, searchType: SearchType = SearchType.Name): Rental[] {
    // SearchType enum gives us property name, so we can use it to access the property of the rental class
    const searchResults = this.#rentals.filter((rental) => {
      return searchType === SearchType.Address
        ? rental.address.street.includes(searchTerm)
        : rental[searchType].includes(searchTerm);
    });
    return searchResults;
  }

  toJSON() {
    return this.#rentals.map((rental) => rental.toJSON());
  }
}
