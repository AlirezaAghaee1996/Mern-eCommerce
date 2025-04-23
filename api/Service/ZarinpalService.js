const ZARINPAL = {
    CREATE: 'https://api.zarinpal.com/pg/v4/payment/request.json',
    VERIFY: 'https://api.zarinpal.com/pg/v4/payment/verify.json',
    GATEWAY: 'https://www.zarinpal.com/pg/StartPay/'
  };
  
  /**
   * createPayment:
   * - Request Body: { merchant_id, amount, callback_url, description }
   * - Successful Response:
   *   {
   *     "data": {
   *       "code": 100,
   *       "authority": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   *     }
   *   }
   * - Error Response Example:
   *   {
   *     "errors": [{ "code": x, "message": "..." }],
   *     "data": null
   *   }
   */
  export async function createPayment(amount, description, orderId) {
    const payload = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount,
      callback_url: `${process.env.SERVER_URL}/api/orders/zarinpal/callback?orderId=${orderId}`,
      description
    };
    const response = await fetch(ZARINPAL.CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    // Example data: { data: { code: 100, authority: 'AUTH1234' } }
    return data;
  }
  
  /**
   * verifyPayment:
   * - Request Body: { merchant_id, amount, authority }
   * - Successful Response:
   *   {
   *     "data": {
   *       "code": 100,
   *       "ref_id": "123456789012345678"
   *     }
   *   }
   * - Error Response Example:
   *   {
   *     "errors": [{ "code": x, "message": "..." }],
   *     "data": null
   *   }
   */
  export async function verifyPayment(amount, authority) {
    const payload = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount,
      authority
    };
    const response = await fetch(ZARINPAL.VERIFY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    // Example data: { data: { code: 100, ref_id: 'REF123456789' } }
    return data;
  }