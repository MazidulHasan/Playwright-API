const { test , expect, request } = require("@playwright/test")

const loginPayload = {
    username: "Admin",
    password: "admin123"
}
let token;


test.beforeAll(async ({  }) => {
    const apiContext = await request.newContext()
    const loginResponse = await apiContext.post("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    {
        data: loginPayload
    })
    console.log("loginResponse is", loginResponse)
    expect(loginResponse.status()).toBe(200)
    const responseBody = await loginResponse.json()
    console.log(responseBody)
    token = responseBody.token
    console.log(token)
    

})




test.describe("Web API Tests", () => {
    // test.beforeEach(async ({ request }) => {
    //     await request.newContext({
    //         extraHTTPHeaders: {     
    //             "Authorization": `Bearer ${token}`
    //         }
    //     })
    // })

    test("Get all employees", async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
        await page.getByPlaceholder("Username").fill("Admin")
        await page.getByPlaceholder("Password").fill("admin123")
        await page.getByRole("button", { name: "Login" }).click()
        await page.getByRole("link", { name: "PIM" }).click()
        await page.getByRole("link", { name: "Add Employee" }).click()
        await page.getByPlaceholder("First Name").fill("Anshika")
        await page.getByPlaceholder("Last Name").fill("Kumari")
        await page.getByRole("button", { name: "Save" }).click()
    })

})