import { Page } from "playwright";

export class DynamicElementHandler {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getLocatorByRole(roleType, validationText?: string) {
    return this.page.getByRole(roleType, { name: `${validationText}` });
  }

  async getLocatorByText(validationText:string){
    return this.page.getByText(validationText);
  }
}
