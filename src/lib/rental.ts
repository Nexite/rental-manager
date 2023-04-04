import { stateCodes } from "@/utils/misc";
import {
  NonFunctionPublicInterface,
  NonFunctionPublicInterfaceRecurse,
  WritableProps,
} from "./../utils/types";
import { Tennant } from "./tennant";

interface RentalCosts {
  moragagePerMonth: number;
  maintencePerMonth: number;
  miscPerMonth: number;
}

export type RentalPublicInterface = NonFunctionPublicInterface<Rental>;

export type RentalConstParams = ConstructorParameters<typeof Rental>;

export type RentalUpdateParams = WritableProps<NonFunctionPublicInterface<Rental>>;
export type RentalObjectInterface = WritableProps<NonFunctionPublicInterfaceRecurse<Rental>>;

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
    // validate zip code is 5 digits and that it only contains numbers
    if (newZip.length != 5 || !/^\d+$/.test(newZip)) {
      throw new Error("Invalid zip code");
    }
    this.#zip = newZip;
  }

  get zip(): string {
    return this.#zip;
  }

  toString(): string {
    return `${this.street},\n${this.city}, ${this.state} ${this.zip}`;
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

// Rental class

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

  // Returns the name of the tenant
  get tennantName(): string {
    return this.#tennant.name;
  }

  // Returns the tennant phone number for the current tennant.
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
    return parseInt(this.#rentalCosts.moragagePerMonth as unknown as string);
  }
  get maintencePerMonth(): number {
    return parseInt(this.#rentalCosts.maintencePerMonth as unknown as string);
  }
  get miscPerMonth(): number {
    return parseInt(this.#rentalCosts.miscPerMonth as unknown as string);
  }

  get totalMonthlyCost(): number {
    return this.moragagePerMonth + this.maintencePerMonth + this.miscPerMonth;
  }

  get monthlyRevenue(): number {
    return this.rentPerMonth - this.totalMonthlyCost;
  }

  edit(edits: Partial<RentalUpdateParams>) {
    if (edits.address) {
      console.log(edits.address);
      Object.assign(this.address, edits.address);
      delete edits.address;
      console.log(this.address);
    }
    Object.assign(this, edits);
    console.log(this);
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
    return new Rental(...jsonRental);
  }

  toObject(): RentalObjectInterface {
    return {
      name: this.name,
      address: this.address.toJSON(),
      rentPerMonth: this.rentPerMonth,
      tennantName: this.tennantName,
      tennantPhoneNumber: this.tennantPhoneNumber,
      moragagePerMonth: this.moragagePerMonth,
      maintencePerMonth: this.maintencePerMonth,
      miscPerMonth: this.miscPerMonth,
    };
  }
  static fromObject(object: RentalObjectInterface): Rental {
    return new Rental(
      object.name,
      object.address,
      object.tennantName,
      object.tennantPhoneNumber,
      object.rentPerMonth,
      object.moragagePerMonth,
      object.maintencePerMonth,
      object.miscPerMonth,
    );
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
