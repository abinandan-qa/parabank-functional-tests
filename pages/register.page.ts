import { Locator, Page } from "playwright";
import { LoginPage } from "./login.page";
import { UserFactory } from "../data/userFactory";

export class RegisterPage extends LoginPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly SSNInput: Locator;
  readonly customerUserNameInput: Locator;
  readonly customerPasswordInput: Locator;
  readonly confirmCustomerPasswordInput: Locator;
  readonly registerButton: Locator;
  customerRegistrationData = UserFactory.createRandomUser();

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator("input[id='customer.firstName']");
    this.lastNameInput = page.locator("input[id='customer.lastName']");
    this.addressInput = page.locator("input[id='customer.address.street']");
    this.cityInput = page.locator("input[id='customer.address.city']");
    this.stateInput = page.locator("input[id='customer.address.state']");
    this.zipCodeInput = page.locator("input[id='customer.address.zipCode']");
    this.phoneInput = page.locator("input[id='customer.phoneNumber']");
    this.SSNInput = page.locator("input[id='customer.ssn']");
    this.customerUserNameInput = page.locator("input[id='customer.username']");
    this.customerPasswordInput = page.locator("input[id='customer.password']");
    this.confirmCustomerPasswordInput = page.locator("#repeatedPassword");
    this.registerButton = page.locator("input[value='Register']");
  }

  async registerAUser() {
    await this.registerLink.click();
    await this.firstNameInput.fill(this.customerRegistrationData.firstName);
    await this.lastNameInput.fill(this.customerRegistrationData.lastName);
    await this.addressInput.fill(this.customerRegistrationData.address);
    await this.cityInput.fill(this.customerRegistrationData.city);
    await this.stateInput.fill(this.customerRegistrationData.state);
    await this.zipCodeInput.fill(this.customerRegistrationData.zipcode);
    await this.phoneInput.fill(this.customerRegistrationData.phone);
    await this.SSNInput.fill(this.customerRegistrationData.ssn);
    await this.customerUserNameInput.fill(
      this.customerRegistrationData.username
    );
    await this.customerPasswordInput.fill(
      this.customerRegistrationData.password
    );
    await this.confirmCustomerPasswordInput.fill(
      this.customerRegistrationData.password
    );
    await this.registerButton.click();
    return this.customerRegistrationData;
  }
}
