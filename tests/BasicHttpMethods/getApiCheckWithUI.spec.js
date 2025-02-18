const { test , expect, request } = require("@playwright/test")

test.beforeAll(async ({  }) => {
    console.log("Before all");
    
})

test.describe("Api with UI verification", () => {
    test("Get all book Data", async ({ request, page }) => {
        const getResponse = await request.get("https://api.demoblaze.com/entries");
        const getJson = await getResponse.json();
        console.log(getJson.Items[0].title);
        await page.goto("https://www.demoblaze.com/");
        const firstTitle = page.getByRole('link', { name: 'Samsung galaxy s6' })
        expect(await firstTitle.textContent()).toBe('Samsung galaxy s6');
    });
})