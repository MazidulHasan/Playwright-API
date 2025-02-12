class ApiUtils {

    constructor(apiContext,loginPayload){
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }
    async getToken() {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
            {
                data: this.loginPayload
            })
            const responseBody = await loginResponse.json()
            const token = responseBody.token
            console.log(token)
            return token;
    }

    async createOrder(orderPayload) {
        let respons={};
        respons.token = await this.getToken();
        const createOrderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",{
            data: orderPayload,
            headers: {
                'Authorization': respons.token,
                'contentType': "application/json"
            },
        })
        const responseBody = await createOrderResponse.json()
        const orderId = responseBody.orders[0]
        console.log("orderId check::",orderId)

        respons.orderId = orderId;
        return respons;
    }
}

module.exports = {ApiUtils}