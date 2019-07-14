var request = require('request');
var crypto = require('crypto');
const BitMEXClient = require('./index');
const client = new BitMEXClient({testnet: true});



var apiKey = "BSQo-7V_GMFCm9tqz_PnoocI";
var apiSecret = "6TbeMsEnwd6LbJLJdgdsct7BYb7bmD16K5myvGpAia7E_7HQ";

var verb = 'POST',
  path = '/api/v1/order',
  expires = Math.round(new Date().getTime() / 1000) + 60, // 1 min in the future
  data = {symbol:"XBTUSD",orderQty:1,price:590,ordType:"Limit"};

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
var postBody = JSON.stringify(data);

var signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

var headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
  // https://www.bitmex.com/app/apiKeysUsage for more details.
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};

const requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody
};







// handle errors here. If no 'error' callback is attached. errors will crash the client.
client.on('error', console.error);
client.on('open', () => console.log('Connection opened.'));
client.on('close', () => console.log('Connection closed.'));
client.on('initialize', () => console.log('Client initialized, data is flowing.'));

client.addStream('XBTUSD', 'instrument', function(data, symbol, tableName) {
  console.log(`AskPrice: ${data[0].askPrice} | BidPrice: ${data[0].bidPrice} | LastPrice: ${data[0].lastPrice}`);

  // Logic here when and how to submit the order
  var submitOrder = false;
  if(submitOrder) {
    request(requestOptions, function(error, response, body) {
        if (error) { console.log(error); }
            console.log(body);
        }
    );
  }
});
