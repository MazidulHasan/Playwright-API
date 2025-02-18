const { test , expect, request } = require("@playwright/test")

test.beforeAll(async ({  }) => {
    console.log("Before all");
    
})

test.describe("Web API GET Tests", () => {
    test("Get all book Data", async ({ request }) => {
        const getResponse = await request.get("/booking");
        console.log(await getResponse.json());
    });

    test("Get Specific book Data", async ({ request }) => {
        const getResponse = await request.get("/booking/21");
        console.log(await getResponse.json());
        expect(getResponse.status()).toBe(200);
        expect(getResponse.ok()).toBeTruthy();  
    });

    test("Get Specific book Data and match with own object", async ({ request }) => {
        const getResponse = await request.get("/booking/21");
        console.log(await getResponse.json());
        expect(getResponse.status()).toBe(200);
        expect(await getResponse.json()).toMatchObject(
            {
                firstname: 'Jane',
                lastname: 'Doe',
                totalprice: 111,
                depositpaid: true,
                bookingdates: { checkin: '2018-01-01', checkout: '2019-01-01' },
                additionalneeds: 'Extra pillows please'
              }
        );
    });

    test("Get Specific book Data and match with each data", async ({ request }) => {
        const getResponse = await request.get("/booking/21");
        console.log(await getResponse.json());
        expect(getResponse.status()).toBe(200);
        const getJson = await getResponse.json();
        expect(getJson.firstname).toBe('Jane');
        expect(getJson.lastname).toBe('Doe');
        expect(getJson.totalprice).toBe(111);
        expect(getJson.depositpaid).toBe(true);
        expect(getJson.bookingdates.checkin).toBe('2018-01-01');
        expect(getJson.bookingdates.checkout).toBe('2019-01-01');
        expect(getJson.additionalneeds).toBe('Extra pillows please');
    });

    test("Get with name", async ({ request }) => {
        const getResponse = await request.get("/booking?firstname=John&lastname=Smith");
        console.log(await getResponse.json());
    });

    test("Get with name with param", async ({ request }) => {
        const getResponse = await request.get("/booking",{
            params: {
                firstname: "John",
                lastname: "Smith"
            }
        });
        console.log(await getResponse.json());
    });
});