import { test, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

import { HomePage } from "../../pages/home.page";
import { OpenNewAccountPage } from "../../pages/open-new-account.page";
import { AccountsOverviewPage } from "../../pages/accounts-overview.page";
import { TransferFundsPage } from "../../pages/transfer-funds.page";
import { BillPayPage } from "../../pages/bill-pay.page";
import { FindTransactionsPage } from "../../pages/find-transactions.page";
import { User } from "../../data/userFactory";
import { config } from "../../data/config";

test.describe("Home Page Test", async () => {
  let baseURL: string;
  let page: Page;
  let homePage: HomePage;
  let openNewAccountPage: OpenNewAccountPage;
  let accountsOverviewPage: AccountsOverviewPage;
  let transferFundsPage: TransferFundsPage;
  let billPayPage: BillPayPage;
  let findTransactionsPage: FindTransactionsPage;
  let registeredData: User;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    baseURL = config.baseUrl;
    homePage = new HomePage(page);
    accountsOverviewPage = new AccountsOverviewPage(page);
    openNewAccountPage = new OpenNewAccountPage(page);
    transferFundsPage = new TransferFundsPage(page);
    billPayPage = new BillPayPage(page);
    findTransactionsPage = new FindTransactionsPage(page, browser);
  });

  test.beforeEach(async ({}) => {
    await page.goto(baseURL);
    registeredData = await homePage.registerAndRelogin();
  });

  test.only("Parabank E2E Sanity", async ({}) => {
    const newAccountId: any = await openNewAccountPage.createAnAccount(
      "SAVINGS"
    );
    const accountsDetails =
      await accountsOverviewPage.verifyAccountsOverviewDetails(newAccountId);
    const transferAccountDetails = {
      amount: faker.number
        .int({
          min: 10,
          max: Number(accountsDetails[0]["Available Amount"]?.replace("$", "")),
        })
        .toString(),
      fromAccount: accountsDetails[0].Account,
      toAccount: newAccountId,
    };
    await transferFundsPage.performFundsTransferAndVerifyMessage(
      transferAccountDetails
    );

    const newAccountDetails =
      await accountsOverviewPage.verifyTransferFundsTransaction(
        transferAccountDetails,
        accountsDetails
      );

    const billPaymentData = {
      amount: faker.number
        .int({
          min: 10,
          max: Number(
            newAccountDetails
              .find((item) => item.Account === newAccountId)
              ["Balance*"].replace("$", "")
          ),
        })
        .toString(),
      fromAccount: newAccountId,
    };
    await billPayPage.enterPayeeInfoAndMakePayment(
      billPaymentData.fromAccount,
      billPaymentData.amount
    );

    await accountsOverviewPage.verifyBillPayTransaction(
      billPaymentData,
      newAccountDetails
    );
    await findTransactionsPage.validateFindTrasactionsByAmount(
      billPaymentData.fromAccount,
      billPaymentData.amount
    );
  });

  test.afterAll(async () => {
    await homePage.logout();
  });
});
