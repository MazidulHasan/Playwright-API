const { test , expect, request } = require("@playwright/test")
const { ApiUtils } = require("../utils/ApiUtils")


const loginPayload = {
    "userEmail": "test1010@gmail.com", 
    "userPassword": "7RMW#L5XHCgwEsK"
}
const orderPayload = {
    orders: [{country: "India", productOrderedId: "67a8dde5c0d3e6622a297cc8"}]
}

let respons;

test.beforeAll(async ({  }) => {
    const apiContext = await request.newContext();
    const apiUtils = new ApiUtils(apiContext,loginPayload);
    respons = await apiUtils.createOrder(orderPayload);
})




test.describe("Web API Tests", () => {
    
    test("Client App login", async ({ page }) => {
        
        console.log("orderId check::",respons.orderId);
        
        await page.addInitScript(value => {
            window.localStorage.setItem('token', value)
        },respons.token);

        await page.goto("https://rahulshettyacademy.com/client")
    })
})