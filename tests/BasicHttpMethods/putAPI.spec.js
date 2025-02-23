import {test , expect, request} from "@playwright/test";

test.describe("Web API PUT Tests", () => {
    test("Put Single book Data", async ({ request }) => {
        const putResponse = await request.put("/booking/1",{    
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM=',
            },
            data: {
                "firstname" : "testJohn",
                "lastname" : "testSmith",
                "totalprice" : 222,
                "depositpaid" : true,
                "bookingdates" : {
                    "checkin" : "2018-01-01",
                    "checkout" : "2019-01-01"
                },
                "additionalneeds" : "Breakfast"
            }
        });
        const jsonResponse = await putResponse.json();
        console.log(await jsonResponse);
        expect(putResponse.status()).toBe(200);
        expect(putResponse.ok()).toBeTruthy();
        expect(jsonResponse).toMatchObject({
            firstname: 'testJohn',
            lastname: 'testSmith',
            totalprice: 222,
            depositpaid: true,
            bookingdates: { checkin: '2018-01-01', checkout: '2019-01-01' },
            additionalneeds: 'Breakfast'
        })
        expect(jsonResponse.additionalneeds).toBe('Breakfast');

        // Now perform get call to check the updated data 
        const getResponse = await request.get("/booking/1");
        console.log(await getResponse.json());
        expect(getResponse.status()).toBe(200);
        expect(await getResponse.json()).toMatchObject(jsonResponse);
    
    }
        
    );
});