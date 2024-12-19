import { Locator, Page } from "playwright";
import { HomePage } from "./home.page";
import { DynamicElementHandler } from "../utils/dynamic-element-handling";
import { parseTable } from "../utils/web-tables";
import { expect } from "playwright/test";

export class AccountsOverviewPage {
  dynamicElementHandler: DynamicElementHandler;
  homePage: HomePage;
  readonly page: Page;
  readonly accountTableHeader: Locator;
  readonly balanceTableHeader: Locator;
  readonly availableAmountHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dynamicElementHandler = new DynamicElementHandler(page);
    this.homePage = new HomePage(page);
    this.accountTableHeader = page.locator("//th[normalize-space()='Account']");
    this.balanceTableHeader = page.locator(
      "//th[normalize-space()='Balance*']"
    );
    this.availableAmountHeader = page.locator(
      "//th[normalize-space()='Available Amount']"
    );
  }

  async verifyAccountsOverviewHeader(): Promise<Boolean> {
    return (
      await this.dynamicElementHandler.getLocatorByRole(
        "heading",
        "Accounts Overview"
      )
    ).isVisible();
  }

  async verifyAccountsOverviewDetails(newAccountId?) {
    await this.homePage.accountsOverviewLink.click();
    await this.page.waitForResponse(
      (response) =>
        response.url().includes("services_proxy/bank/customers") &&
        response.ok()
    );
    await this.verifyAccountsOverviewHeader();
    await this.accountTableHeader.isVisible();
    await this.balanceTableHeader.isVisible();
    await this.availableAmountHeader.isVisible();
    if (newAccountId) {
      (
        await this.dynamicElementHandler.getLocatorByText(newAccountId)
      ).isVisible();
    }
    const tableValues = await parseTable(this.page, "table#accountTable");
    expect(this.verifyTotal(tableValues)).toBeTruthy();
    return tableValues;
  }

  async verifyTransferFundsTransaction(
    transferDetails,
    dataBeforeFundTransfer
  ) {
    const dataAfterFundTransfer: any =
      await this.verifyAccountsOverviewDetails();
    const getAccountBalance = (data, account) =>
      Number(
        data
          .find((item) => item.Account === account)
          ["Balance*"].replace("$", "")
          .trim()
      );

    function balanceAfterTransfer(accountSource) {
      return getAccountBalance(dataAfterFundTransfer, accountSource); // Added `return`
    }

    function balanceBeforeTransfer(accountSource) {
      return getAccountBalance(dataBeforeFundTransfer, accountSource); // Added `return`
    }

    expect(balanceAfterTransfer(transferDetails.fromAccount)).toEqual(
      Number(balanceBeforeTransfer(transferDetails.fromAccount)) -
        Number(transferDetails.amount)
    );
    expect(balanceAfterTransfer(transferDetails.toAccount)).toEqual(
      Number(balanceBeforeTransfer(transferDetails.toAccount)) +
        Number(transferDetails.amount)
    );

    return dataAfterFundTransfer;
  }

  async verifyBillPayTransaction(billPayDetails, dataBeforeBillPay) {
    const dataAfterBillPay: any = await this.verifyAccountsOverviewDetails();
    const getAccountBalance = (data, account) =>
      Number(
        data
          .find((item) => item.Account === account)
          ["Balance*"].replace("$", "")
          .trim()
      );

    function balanceBeforeTransfer(accountSource) {
      return getAccountBalance(dataBeforeBillPay, accountSource);
    }

    function balanceAfterTransfer(accountSource) {
      return getAccountBalance(dataAfterBillPay, accountSource);
    }

    expect(balanceAfterTransfer(billPayDetails.fromAccount)).toEqual(
      Number(balanceBeforeTransfer(billPayDetails.fromAccount)) -
        Number(billPayDetails.amount)
    );
  }

  verifyTotal(data: any[]): Boolean {
    let calculatedTotal = 0;

    for (const item of data) {
      if (item["Available Amount"] && item.Account !== "Total") {
        calculatedTotal += parseFloat(
          item["Available Amount"].replace("$", "")
        );
      }
    }

    const totalBalance = parseFloat(
      data.find((item) => item.Account === "Total")["Balance*"].replace("$", "")
    );

    if (calculatedTotal === totalBalance) {
      return true;
    } else {
      return false;
    }
  }
}
