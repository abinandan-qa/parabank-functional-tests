import { Browser, Page, request } from "playwright";
import { DynamicElementHandler } from "../utils/dynamic-element-handling";
import { config } from "../data/config";
import { expect } from "playwright/test";

export class FindTransactionsPage {
  dynamicElementHandler: DynamicElementHandler;
  page: Page;
  browser: Browser;

  constructor(page: Page, browser: Browser) {
    this.page = page;
    this.browser = browser;
    this.dynamicElementHandler = new DynamicElementHandler(page);
  }
  async verifyFindTransactionsHeader(): Promise<Boolean> {
    return (
      await this.dynamicElementHandler.getLocatorByRole(
        "heading",
        "Find Transactions"
      )
    ).isVisible();
  }

  async validateFindTrasactionsByAmount(accountID, amount) {
    const context = await this.browser.contexts()[0];
    const cookies = await context.cookies();
    const JSESSIONID: any = cookies.find(
      (cookie) => cookie.name === "JSESSIONID"
    );

    const apiRequestContext = await request.newContext();
    const response = await apiRequestContext.get(
      `${config.baseUrl}/parabank/services_proxy/bank/accounts/${accountID}/transactions/amount/${amount}?timeout=30000`,
      {
        headers: {
          Cookie: `JSESSIONID=${JSESSIONID["value"]}`,
        },
      }
    );

    const parseJSONResponse = await JSON.parse(await response.text());
    const sanitisedResponse = parseJSONResponse.find(
      (item) => item.accountId == accountID
    );

    expect(sanitisedResponse.amount).toEqual(Number(amount));
    expect(sanitisedResponse.type).toEqual("Debit");
  }
}
