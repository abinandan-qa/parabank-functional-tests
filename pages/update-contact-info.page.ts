import { Page } from "playwright";
import { DynamicElementHandler } from "../utils/dynamic-element-handling";

export class UpdateContactInfoPage {
  dynamicElementHandler: DynamicElementHandler;
  constructor(page: Page) {
    this.dynamicElementHandler = new DynamicElementHandler(page);
  }
  async verifyUpdateProfileHeader(): Promise<Boolean> {
    return (
      await this.dynamicElementHandler.getLocatorByRole(
        "heading",
        "Update Profile"
      )
    ).isVisible();
  }
}
