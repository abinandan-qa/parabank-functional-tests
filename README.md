
# Playwright Test Setup

This project is configured to run Playwright tests, using the Playwright testing framework and Faker for generating fake data.

## Prerequisites

Ensure you have the following installed:

- Node.js (>= 16.0.0)

## Installation

1. Clone this repository to your local machine.

2. Navigate to the project folder:

   ```bash
   cd <project-folder>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Dependencies

- `playwright`: The Playwright library for browser automation.
- `@faker-js/faker`: A library for generating fake data such as names, addresses, emails, etc.
- `@playwright/test`: The Playwright testing framework for writing and running tests.
- `@types/node`: Type definitions for Node.js.

## Scripts

### Running Tests

To run the tests, execute the following command:

```bash
npm test
```

This will invoke `npx playwright test` to run the tests.

### Running Tests with Different Options

You can also run tests with different configurations. For example:

- Run tests in parallel:

  ```bash
  npx playwright test --workers=4
  ```

- Run tests with debugging:

  ```bash
  npx playwright test --project=firefox --debug
  ```

- Generate a test report:

  ```bash
  npx playwright test --reporter=html
  ```