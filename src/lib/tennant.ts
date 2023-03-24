export class Tennant {
  // define variables as private with # prefix so we can use getters and setters for validation
  #name: string;
  #phoneNumber: string;

  constructor(name: string, phoneNumber: string) {
    this.#name = name;
    this.#phoneNumber = phoneNumber;
  }

  get name(): string {
    return this.#name;
  }

  set name(newName: string) {
    // regex to validate newName only contains letters, spaces, apostrophes and dashes
    const nameValidator = /^[\\p{L} .'-]+$/;
    if (nameValidator.test(newName) === false) {
      throw new Error("Name can only contain letters, spaces, apostrophes and dashes");
    } else {
      this.name = newName;
    }
  }

  get phoneNumber(): string {
    return this.#phoneNumber;
  }
  set phoneNumber(newNumber: string) {
    // regex to validate newNumber only contains numbers, dashes, parentheses, spaces, and plus signs
    const nameValidator = /^[0-9-()+ ]+$/;
    if (nameValidator.test(newNumber) === false) {
      throw new Error(
        "Phone number can only contain numbers, dashes, parentheses, spaces, and plus signs",
      );
    }
    this.phoneNumber = newNumber;
  }

  // method to return a string of the Tennant's name and phone number, will be used for debugging
  toString(): string {
    return `Name: ${this.name}, Phone Number: ${this.phoneNumber}`;
  }
}
