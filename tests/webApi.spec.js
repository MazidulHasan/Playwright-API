const { test , expect, request } = require("@playwright/test")

const loginPayload = {
    "userEmail": "test1010@gmail.com", 
    "userPassword": "7RMW#L5XHCgwEsK"
}
let token;
test.beforeAll(async ({  }) => {
    const apiContext = await request.newContext()
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
    {
        data: loginPayload
    })
    expect(loginResponse.ok()).toBeTruthy()
    const responseBody = await loginResponse.json()
    token = responseBody.token
    console.log(token)
})




test.describe("Web API Tests", () => {
    
    test("Client App login", async ({ page }) => {
        console.log("token is 2", token);
        await page.addInitScript(value => {
            window.localStorage.setItem('token', value)
        },token);

        await page.goto("https://rahulshettyacademy.com/client")
    })

})