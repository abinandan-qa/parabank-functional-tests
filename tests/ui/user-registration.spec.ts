import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { RegisterPage } from "../../pages/register.page";
import { HomePage } from "../../pages/home.page";
import { config } from "../../data/config";

test.describe("User Registration Tests", async () => {
  let baseURL: string;
  let page: Page;
  let loginPage: LoginPage;
  let registerPage: RegisterPage;
  let homePage: HomePage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
    homePage = new HomePage(page);
    baseURL = config.baseUrl;
  });

  test("Verify User Registration", { tag: "@smoke" }, async ({}) => {
    page.goto(baseURL);
    const { firstName, lastName, username, password } =
      await registerPage.registerAUser();
    const isWelcomeMesssageWithUserNameHeaderExists =
      homePage.verifyWelcomeHeaderAndMessage(username);
    homePage.logout();
    await loginPage.login(username, password);
    const isWelcomeFirstNameLastNameLbelExists =
      await homePage.verifyWelcomeText(firstName, lastName);

    expect(isWelcomeMesssageWithUserNameHeaderExists).toBeTruthy;
    expect(isWelcomeFirstNameLastNameLbelExists).toBeTruthy;
  });
});
