import {expect, test} from '@playwright/test';

test.describe("Web API POST Tests", () => {
    test("Post all book Data", async ({ request }) => { 
        const postResponse = await request.post("/booking",{
            data:{
                "firstname" : "Jim",
                "lastname" : "Brown",
                "totalprice" : 111,
                "depositpaid" : true,
                "bookingdates" : {
                    "checkin" : "2018-01-01",
                    "checkout" : "2019-01-01"
                },
                "additionalneeds" : "Breakfast"
            }
        });
        const jsonResponse = await postResponse.json();
        console.log(await jsonResponse);
        expect(postResponse.status()).toBe(200);
        expect(postResponse.ok()).toBeTruthy();
        expect(jsonResponse).toHaveProperty('bookingid');
        expect(jsonResponse.booking).toMatchObject({
            firstname: 'Jim',
            lastname: 'Brown',
            totalprice: 111,
            depositpaid: true,
            bookingdates: { checkin: '2018-01-01', checkout: '2019-01-01' },
            additionalneeds: 'Breakfast'
        })
    });
});