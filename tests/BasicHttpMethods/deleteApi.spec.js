import {test,expect} from '@playwright/test';
import ApiJson from "../../testData/apidata.json";

let bookingId;

test.beforeAll(async ({ request }) => {
    const postResponse = await request.post("/booking",{
        data:ApiJson.postcallData
    });
    const jsonResponse = await postResponse.json();
    console.log(await jsonResponse);
    expect(postResponse.status()).toBe(200);
    expect(postResponse.ok()).toBeTruthy();
    expect(jsonResponse).toHaveProperty('bookingid');
    expect(jsonResponse.booking).toMatchObject(ApiJson.postcallData)
    bookingId = jsonResponse.bookingid;
});

test.describe("Web API DELETE Tests", () => {

    test("Delete Single book Data", async ({ request }) => {
        console.log("bookingId is : "+bookingId);
        const deleteResponse = await request.delete("/booking/"+bookingId,{
            headers: ApiJson.headerData
        });
        expect(deleteResponse.status()).toBe(201);
        const textResponse = await deleteResponse.text();
        console.log(await textResponse);
        expect(textResponse).toEqual('Created');
    });
});