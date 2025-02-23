import {expect, test} from '@playwright/test';
import ApiJson from "../../testData/apidata.json";

test.describe("Web API POST Tests", () => {
    test("Post book Data", async ({ request }) => { 
        const postResponse = await request.post("/booking",{
            data:ApiJson.postcallData
        });
        const jsonResponse = await postResponse.json();
        console.log(await jsonResponse);
        expect(postResponse.status()).toBe(200);
        expect(postResponse.ok()).toBeTruthy();
        expect(jsonResponse).toHaveProperty('bookingid');
        expect(jsonResponse.booking).toMatchObject(ApiJson.postcallData)
    });


    test("Put Single book Data", async ({ request }) => {
        const putResponse = await request.put("/booking/1",{    
            headers: ApiJson.headerData,
            data: ApiJson.putcallData
        });
        const jsonResponse = await putResponse.json();
        console.log(await jsonResponse);
        expect(putResponse.status()).toBe(200);
        expect(putResponse.ok()).toBeTruthy();
        expect(jsonResponse).toMatchObject(ApiJson.putcallData)
        expect(jsonResponse.additionalneeds).toBe(ApiJson.putcallData.additionalneeds);
    });
});