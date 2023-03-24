import { stateCodes } from "@/utils/misc";
import { KeysMatching, NonFunctionPublicInterface, WritableProps } from "./../utils/types";
import { Tennant } from "./tennant";

interface RentalCosts {
  moragagePerMonth: number;
  maintencePerMonth: number;
  miscPerMonth: number;
}

export type RentalPublicInterface = NonFunctionPublicInterface<Rental>;

export type RentalConstParams = ConstructorParameters<typeof Rental>;

export type RentalEditParams = WritableProps<NonFunctionPublicInterface<Rental>>;

interface AddressProps {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export class Address {
  public street: string;
  public city: string;
  #state: string = "";
  #zip: string = "";

  constructor({ street, city, state, zip }: AddressProps) {
    this.street = street;
    this.city = city;
    this.state = state;
    this.zip = zip;
  }

  set state(newState: string) {
    if (!stateCodes.includes(newState)) {
      throw new Error("Invalid state code");
    }
    this.#state = newState;
  }

  get state(): string {
    return this.#state;
  }

  set zip(newZip: string) {
    console.log(newZip)
    if (newZip.length > 5 || !/^\d+$/.test(newZip)) {
      throw new Error("Invalid zip code");
    }
    this.#zip = newZip;
  }

  get zip(): string {
    return this.#zip;
  }

  toString(): string {
    return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
  }

  toJSON() {
    return {
      street: this.street,
      city: this.city,
      state: this.state,
      zip: this.zip,
    };
  }

  clone(): Address {
    return new Address(this.toJSON());
  }
}

export class Rental {
  public name: string;
  public address: Address;
  public rentPerMonth: number;

  #rentalCosts: RentalCosts;
  #tennant: Tennant;
  #listeners: (() => void)[] = [];

  constructor(
    name: string,
    address: AddressProps,
    tennantName: string,
    tennantPhoneNumber: string,
    rentPerMonth: number = 0,
    moragagePerMonth: number = 0,
    maintencePerMonth: number = 0,
    miscPerMonth: number = 0,
  ) {
    this.name = name;
    this.address = new Address(address);
    this.rentPerMonth = rentPerMonth;

    this.#tennant = new Tennant(tennantName, tennantPhoneNumber);
    this.#rentalCosts = { moragagePerMonth, maintencePerMonth, miscPerMonth } as RentalCosts;
  }
  // custom getters so you don't need to access tennant property directly
  get tennantName(): string {
    return this.#tennant.name;
  }
  get tennantPhoneNumber(): string {
    return this.#tennant.phoneNumber;
  }
  // custom setters so you don't need to manually create a new tennant instance every time you want to modify tennant
  set tennantName(newName) {
    this.#tennant.name = newName;
  }
  set tennantPhoneNumber(phoneNumber) {
    this.#tennant.phoneNumber = phoneNumber;
  }

  set moragagePerMonth(newCost: number) {
    this.#rentalCosts.moragagePerMonth = newCost;
  }
  set maintencePerMonth(newCost: number) {
    this.#rentalCosts.maintencePerMonth = newCost;
  }
  set miscPerMonth(newCost: number) {
    this.#rentalCosts.miscPerMonth = newCost;
  }
  get moragagePerMonth(): number {
    return this.#rentalCosts.moragagePerMonth;
  }
  get maintencePerMonth(): number {
    return this.#rentalCosts.maintencePerMonth;
  }
  get miscPerMonth(): number {
    return this.#rentalCosts.miscPerMonth;
  }

  get totalMonthlyCost(): number {
    return (
      this.#rentalCosts.moragagePerMonth +
      this.#rentalCosts.maintencePerMonth +
      this.#rentalCosts.miscPerMonth
    );
  }

  get monthlyRevenue(): number {
    return this.rentPerMonth - this.totalMonthlyCost;
  }

  edit(edits: Partial<RentalEditParams>) {
    Object.keys(edits).forEach((key) => {
      const _value = edits[key as keyof RentalEditParams];
      switch (typeof _value) {
        case "string":
          this[key as KeysMatching<RentalEditParams, string>] = _value;
          break;
        case "number":
          this[key as KeysMatching<RentalEditParams, number>] = _value;
          break;
      }
    });
    this.emit();
  }

  toJSON() {
    return [
      this.name,
      this.address.toJSON(),
      this.tennantName,
      this.tennantPhoneNumber,
      this.rentPerMonth,
      this.#rentalCosts.moragagePerMonth,
      this.#rentalCosts.maintencePerMonth,
      this.#rentalCosts.miscPerMonth,
    ] as RentalConstParams;
  }

  static fromJSON(jsonRental: RentalConstParams) {
    // console.log(jsonRental[1]);
    // jsonRental[1] = new Address(
    //   jsonRental[1].street,
    //   jsonRental[1].city,
    //   jsonRental[1].state,
    //   jsonRental[1].zip,
    // );
    return new Rental(...jsonRental);
  }

  toString(): string {
    return `Name: ${this.name}, Address: ${this.address}, Rent Per Month: ${
      this.rentPerMonth
    }, Tennant: [${this.#tennant}], Monthly Cost: ${this.monthlyRevenue}, Monthly Revenue: ${
      this.monthlyRevenue
    }`;
  }

  emit() {
    console.log("rental emit");
    this.#listeners.forEach((fn) => fn());
  }

  addListener = (fn: () => void) => {
    this.#listeners.push(fn);
  };

  clone(): Rental {
    return Rental.fromJSON(this.toJSON());
  }
}
