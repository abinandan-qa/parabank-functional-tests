import { Page } from "playwright";

type TableRow = Record<string, string | null>;

export async function parseTable(
  page: Page,
  tableSelector: string
): Promise<TableRow[]> {
  const table = page.locator(tableSelector);

  // Get headers
  const headers = await table.locator("thead tr th").allTextContents();
  const trimmedHeaders = headers.map((header) => header.trim());

  // Get all rows' cells
  const rows = await table.locator("tbody tr").all();
  const tableData: TableRow[] = [];

  for (const row of rows) {
    const cells = await row.locator("td").allTextContents();
    const rowData: TableRow = {};
    trimmedHeaders.forEach((header, index) => {
      rowData[header] = cells[index]?.trim() || null;
    });

    tableData.push(rowData);
  }

  return tableData;
}
