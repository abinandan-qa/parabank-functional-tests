import { faker } from "@faker-js/faker";

export interface User {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
  confirm: string;
}


const generateSSN = (): string => {
  const areaNumber = faker.number.int({ min: 100, max: 899 });
  const groupNumber = faker.number.int({ min: 1, max: 99 });
  const serialNumber = faker.number.int({ min: 1000, max: 9999 });

  return `${areaNumber}-${groupNumber
    .toString()
    .padStart(2, "0")}-${serialNumber}`;
};

const password = faker.internet.password();

export const UserFactory = {
  createRandomUser: (): User => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipcode: faker.location.zipCode(),
    phone: faker.phone.number(),
    ssn: generateSSN(),
    username: faker.internet.username(),
    password: password,
    confirm: password,
  }),
};
