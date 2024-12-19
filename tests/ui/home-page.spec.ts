import { test, expect, Page } from "@playwright/test";

import { HomePage } from "../../pages/home.page";
import { OpenNewAccountPage } from "../../pages/open-new-account.page";
import { AccountsOverviewPage } from "../../pages/accounts-overview.page";
import { TransferFundsPage } from "../../pages/transfer-funds.page";
import { BillPayPage } from "../../pages/bill-pay.page";
import { FindTransactionsPage } from "../../pages/find-transactions.page";
import { UpdateContactInfoPage } from "../../pages/update-contact-info.page";
import { RequestLoanPage } from "../../pages/request-loan.page";
import { User } from "../../data/userFactory";
import { config } from "../../data/config";

test.describe("Home Page Test", async () => {
  let baseURL: string;
  let page: Page;
  let homePage: HomePage;
  let openNewAccountPage: OpenNewAccountPage;
  let accountsOverviewPage: AccountsOverviewPage;
  let transferFundsPage: TransferFundsPage;
  let billPayPayPage: BillPayPage;
  let findTransactionsPage: FindTransactionsPage;
  let updateContactInfoPage: UpdateContactInfoPage;
  let requestLoanPage: RequestLoanPage;
  let registeredData: User;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    baseURL = config.baseUrl;
    homePage = new HomePage(page);
    accountsOverviewPage = new AccountsOverviewPage(page);
    openNewAccountPage = new OpenNewAccountPage(page);
    transferFundsPage = new TransferFundsPage(page);
    billPayPayPage = new BillPayPage(page);
    findTransactionsPage = new FindTransactionsPage(page, browser);
    updateContactInfoPage = new UpdateContactInfoPage(page);
    requestLoanPage = new RequestLoanPage(page);
  });

  test.beforeEach(async ({}) => {
    await page.goto(baseURL);
    registeredData = await homePage.registerAndRelogin();
  });

  test("Verify Global Navigation", async ({}) => {
    await homePage.openNewAccountLink.click();
    const isOpenNewAccountHeaderExists =
      await openNewAccountPage.verifyOpenNewAccountHeader();
    await homePage.accountsOverviewLink.click();
    const isAccountsOverviewHeaderExists =
      await accountsOverviewPage.verifyAccountsOverviewHeader();
    await homePage.transferFundsLink.click();
    const isTransferFundsHeaderExists =
      await transferFundsPage.verifyTransferFundsHeader();
    await homePage.billPayLink.click();
    const isBillPaymentServiceHeaderExists =
      await billPayPayPage.verifyBillPaymentServiceHeader();
    await homePage.findTransactionsLink.click();
    const isFindTransactionsHeaderExists =
      await findTransactionsPage.verifyFindTransactionsHeader();
    await homePage.updateContactInfoLink.click();
    const isUpdateContactInfoHeaderExists =
      await updateContactInfoPage.verifyUpdateProfileHeader();
    await homePage.requestLoanLink.click();
    const isApplyForALoanHeaderExists =
      await requestLoanPage.verifyApplyForALoanHeader();

    expect(isOpenNewAccountHeaderExists).toBeTruthy();
    expect(isAccountsOverviewHeaderExists).toBeTruthy();
    expect(isTransferFundsHeaderExists).toBeTruthy();
    expect(isBillPaymentServiceHeaderExists).toBeTruthy();
    expect(isFindTransactionsHeaderExists).toBeTruthy();
    expect(isUpdateContactInfoHeaderExists).toBeTruthy();
    expect(isApplyForALoanHeaderExists).toBeTruthy();
  });

  test.afterAll(async () => {
    await homePage.logout();
  });
});
