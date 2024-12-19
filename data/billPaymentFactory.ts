import { faker } from "@faker-js/faker";

export interface BillPayment {
  payeeName: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  account: string;
  amount: string;
  fromAccountId: string;
}

export const BillPaymentFactory = {
  createRandomBillPayment: (
    sourceAccountId: string,
    amount: string
  ): BillPayment => ({
    payeeName: faker.person.firstName(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipcode: faker.location.zipCode(),
    phone: faker.phone.number(),
    account: faker.number.int({ min: 10000, max: 20000 }).toString(),
    amount: amount,
    fromAccountId: sourceAccountId,
  }),
};
