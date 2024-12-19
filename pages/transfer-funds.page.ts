import { Page, Locator } from "playwright";
import { HomePage } from "./home.page";
import { DynamicElementHandler } from "../utils/dynamic-element-handling";
import { getValueWithoutSpecialCharacters } from "../utils/string-handling";
import { expect } from "playwright/test";

export class TransferFundsPage {
  page: Page;
  dynamicElementHandler: DynamicElementHandler;
  homePage: HomePage;
  readonly amountInput: Locator;
  readonly fromAccountInput: Locator;
  readonly toAccountInput: Locator;
  readonly transferButton: Locator;
  readonly transferredAmountLabel: Locator;
  readonly transferredFromAccountLabel: Locator;
  readonly transferredToAccountLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dynamicElementHandler = new DynamicElementHandler(page);
    this.homePage = new HomePage(page);
    this.amountInput = page.locator("#amount");
    this.fromAccountInput = page.locator("select#fromAccountId");
    this.toAccountInput = page.locator("select#toAccountId");
    this.transferButton = page.locator("input[value='Transfer']");
    this.transferredAmountLabel = page.locator("span#amountResult");
    this.transferredFromAccountLabel = page.locator("span#fromAccountIdResult");
    this.transferredToAccountLabel = page.locator("span#toAccountIdResult");
  }
  async verifyTransferFundsHeader(): Promise<Boolean> {
    return (
      await this.dynamicElementHandler.getLocatorByRole(
        "heading",
        "Transfer Funds"
      )
    ).isVisible();
  }

  async performFundsTransferAndVerifyMessage(transferFundDetails) {
    await this.homePage.transferFundsLink.click();
    await this.amountInput.fill(transferFundDetails.amount);
    await this.fromAccountInput.selectOption(transferFundDetails.fromAccount);
    await this.toAccountInput.selectOption(transferFundDetails.toAccount);
    await this.transferButton.click();
    await this.page.waitForResponse(
      (response) =>
        response.url().includes("services_proxy/bank/transfer") && response.ok()
    );
    expect(
      getValueWithoutSpecialCharacters(
        await this.transferredAmountLabel.textContent()
      )
    ).toEqual(transferFundDetails.amount);
    expect(await this.transferredFromAccountLabel.textContent()).toEqual(
      transferFundDetails.fromAccount
    );
    expect(await this.transferredToAccountLabel.textContent()).toEqual(
      transferFundDetails.toAccount
    );
  }
}
