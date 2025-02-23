import { test, expect } from '@playwright/test';
import ApiJson from "../../testData/apidata.json";


let token;
test.beforeAll(async ({ request }) => {
    const respToken = await request.post("https://restful-booker.herokuapp.com/auth", {
        data: {
            username: "admin",
            password: "password123"
        }
    });

    expect(respToken.status()).toBe(200);

    const jsonToken = await respToken.json();
    console.log("The token is: " + jsonToken.token);
    token = jsonToken.token;
});

test.describe("API BasicAuth Tests", () => {
    test("Put Single book Data", async ({ request }) => {
        const putResponse = await request.put("/booking/1",{    
            headers: {
                'cookie': "token=" + token
            },
            data: ApiJson.putcallData
        });
        const jsonResponse = await putResponse.json();
        console.log(await jsonResponse);
        expect(putResponse.status()).toBe(200);
        expect(putResponse.ok()).toBeTruthy();
        expect(jsonResponse).toMatchObject(ApiJson.putcallData)
    });
});
