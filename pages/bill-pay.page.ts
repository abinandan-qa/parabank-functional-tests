import { Page, Locator } from "playwright";
import { DynamicElementHandler } from "../utils/dynamic-element-handling";
import { BillPaymentFactory, BillPayment } from "../data/billPaymentFactory";
import { HomePage } from "./home.page";
import { th } from "@faker-js/faker";

export class BillPayPage {
  page: Page;
  dynamicElementHandler: DynamicElementHandler;
  readonly payeeNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly accountInput: Locator;
  readonly verifyAccountInput: Locator;
  readonly amountInput: Locator;
  readonly fromAccountInput: Locator;
  readonly sendPaymentButton: Locator;

  homePage: HomePage;

  constructor(page: Page) {
    this.page = page;
    this.dynamicElementHandler = new DynamicElementHandler(page);
    this.homePage = new HomePage(page);
    this.payeeNameInput = page.locator("input[name='payee.name']");
    this.addressInput = page.locator("input[name='payee.address.street']");
    this.cityInput = page.locator("input[name='payee.address.city']");
    this.stateInput = page.locator("input[name='payee.address.state']");
    this.zipCodeInput = page.locator("input[name='payee.address.zipCode']");
    this.phoneInput = page.locator("input[name='payee.phoneNumber']");
    this.accountInput = page.locator("input[name='payee.accountNumber']");
    this.verifyAccountInput = page.locator("input[name='verifyAccount']");
    this.amountInput = page.locator("input[name='amount']");
    this.fromAccountInput = page.locator("select[name='fromAccountId']");
    this.sendPaymentButton = page.locator("input[value='Send Payment']");
  }
  async verifyBillPaymentServiceHeader(): Promise<Boolean> {
    return (
      await this.dynamicElementHandler.getLocatorByRole(
        "heading",
        "Bill Payment Service"
      )
    ).isVisible();
  }

  async enterPayeeInfoAndMakePayment(amount: string, sourceAccountId) {
    const billPaymentData: BillPayment =
      BillPaymentFactory.createRandomBillPayment(amount, sourceAccountId);
    await this.homePage.billPayLink.click();
    await this.payeeNameInput.fill(billPaymentData.payeeName);
    await this.addressInput.fill(billPaymentData.address);
    await this.cityInput.fill(billPaymentData.city);
    await this.stateInput.fill(billPaymentData.state);
    await this.zipCodeInput.fill(billPaymentData.zipcode);
    await this.phoneInput.fill(billPaymentData.zipcode);
    await this.accountInput.fill(billPaymentData.account);
    await this.verifyAccountInput.fill(billPaymentData.account);
    await this.amountInput.fill(billPaymentData.amount);
    await this.fromAccountInput.selectOption(billPaymentData.fromAccountId);
    await this.page.waitForLoadState("domcontentloaded");
    await this.sendPaymentButton.click();
    await this.page.waitForResponse(
      (response) =>
        response.url().includes("services_proxy/bank/billpay") && response.ok()
    );

    return billPaymentData;
  }
}
