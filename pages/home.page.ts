import { Locator, Page } from "playwright";
import { DynamicElementHandler } from "../utils/dynamic-element-handling";
import { LoginPage } from "./login.page";
import { RegisterPage } from "./register.page";
import { User } from "../data/userFactory";

export class HomePage {
  readonly page: Page;
  readonly openNewAccountLink: Locator;
  readonly accountsOverviewLink: Locator;
  readonly transferFundsLink: Locator;
  readonly billPayLink: Locator;
  readonly findTransactionsLink: Locator;
  readonly updateContactInfoLink: Locator;
  readonly requestLoanLink: Locator;
  readonly logOutLink: Locator;
  readonly welcomeUserNameHeader: Locator;
  readonly registerPage: RegisterPage;
  readonly loginPage: LoginPage;
  dynamicElementHandler: DynamicElementHandler;

  constructor(page: Page) {
    this.page = page;
    this.openNewAccountLink = page.locator("a[href='openaccount.htm']");
    this.accountsOverviewLink = page.locator("a[href='overview.htm']");
    this.transferFundsLink = page.locator("a[href='transfer.htm']");
    this.billPayLink = page.locator("a[href='billpay.htm']");
    this.findTransactionsLink = page.locator("a[href='findtrans.htm']");
    this.updateContactInfoLink = page.locator("a[href='updateprofile.htm']");
    this.requestLoanLink = page.locator("a[href='requestloan.htm']");
    this.logOutLink = page.locator("a[href='logout.htm']");
    this.dynamicElementHandler = new DynamicElementHandler(this.page);
    this.registerPage = new RegisterPage(this.page);
    this.loginPage = new LoginPage(this.page);
  }

  async verifyWelcomeHeaderAndMessage(userName: string): Promise<Boolean> {
    const isHeaderExists = (
      await this.dynamicElementHandler.getLocatorByRole(
        "heading",
        `Welcome ${userName}`
      )
    ).isVisible();

    const isAccountCreatedMessageDisplayed = (
      await this.dynamicElementHandler.getLocatorByText(
        "Your account was created"
      )
    ).isVisible();

    return (await isHeaderExists) && isAccountCreatedMessageDisplayed;
  }

  async verifyWelcomeText(
    firstName: string,
    lastName: string
  ): Promise<boolean> {
    return (
      await this.dynamicElementHandler.getLocatorByText(
        `Welcome ${firstName} ${lastName}`
      )
    ).isVisible();
  }

  async logout() {
    await this.logOutLink.click();
  }

  async registerAndRelogin(): Promise<User> {
    const userDetails = await this.registerPage.registerAUser();
    await this.logout();
    await this.loginPage.login(userDetails.username, userDetails.password);
    return userDetails;
  }
}
