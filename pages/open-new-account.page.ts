import { Locator, Page } from "playwright";
import { DynamicElementHandler } from "../utils/dynamic-element-handling";
import { HomePage } from "./home.page";
import { request } from "http";
import { expect } from "playwright/test";

export class OpenNewAccountPage {
  readonly page: Page;
  readonly dynamicElementHandler: DynamicElementHandler;
  readonly accountTypeDropdown: Locator;
  readonly homePage: HomePage;
  readonly openAccountButton: Locator;
  readonly accountNumberLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dynamicElementHandler = new DynamicElementHandler(page);
    this.homePage = new HomePage(page);
    this.accountTypeDropdown = page.locator("#type");
    this.openAccountButton = page.locator("input[value='Open New Account']");
    this.accountNumberLabel = page.locator("a#newAccountId");
  }

  async verifyOpenNewAccountHeader(): Promise<Boolean> {
    return (
      await this.dynamicElementHandler.getLocatorByRole(
        "heading",
        "Open New Account"
      )
    ).isVisible();
  }
  async createAnAccount(accountType: string): Promise<string | null> {
    await this.homePage.openNewAccountLink.click();
    await this.accountTypeDropdown.selectOption(accountType);
    await this.page.waitForResponse(
      (response) =>
        response.url().includes("services_proxy/bank/customers") &&
        response.ok()
    );
    await this.openAccountButton.click();
    await this.page.waitForResponse(
      (response) =>
        response.url().includes("services_proxy/bank/createAccount") &&
        response.ok()
    );
    const accountNumber = await this.accountNumberLabel.textContent();
    expect(Number(accountNumber)).toBeGreaterThan(0);
    return accountNumber;
  }
}
