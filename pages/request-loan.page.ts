import { Page } from "playwright";
import { DynamicElementHandler } from "../utils/dynamic-element-handling";

export class RequestLoanPage {
  dynamicElementHandler: DynamicElementHandler;
  constructor(page: Page) {
    this.dynamicElementHandler = new DynamicElementHandler(page);
  }
  async verifyApplyForALoanHeader(): Promise<Boolean> {
    return (
      await this.dynamicElementHandler.getLocatorByRole(
        "heading",
        "Apply for a Loan"
      )
    ).isVisible();
  }
}
