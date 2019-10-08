require('dotenv').config();
const Crypto = require('crypto-js');

function generateRequestURL(asin) {
    const secret = process.env.Secret;

    const params = {
        AWSAccessKey : process.env.AWSAccessKey,
        Action: 'GetMatchingProductForId',
        IdList: asin,
        IdType: 'ASIN',
        MWSAuthToken: process.env.MWSAuthToken,
        Marketplace: process.env.MarketplaceID,
        SellerId: process.env.SellerID,
        SignatureMethod: 'HmacSHA256',
        SignatureVersion: 2,
        Timestamp: encodeURIComponent(new Date().toISOString()),
        Endpoint: 'Products',
        Version: '2011-10-01'
    };

    const signatureInput = `POST\nmws.amazonservices.com\n/${params.Endpoint}/${params.Version}\nAWSAccessKeyId=${params.AWSAccessKey}&Action=${params.Action}&IdList.Id.1=${params.IdList}&IdType=${params.IdType}&MWSAuthToken=${params.MWSAuthToken}&MarketplaceId=${params.Marketplace}&SellerId=${params.SellerId}&SignatureMethod=${params.SignatureMethod}&SignatureVersion=${params.SignatureVersion}&Timestamp=${params.Timestamp}&Version=${params.Version}`;

    const hash = Crypto.HmacSHA256(signatureInput, secret);
    const base64hash = Crypto.enc.Base64.stringify(hash);
    const signature = encodeURIComponent(base64hash);
    
    console.log(`https://mws.amazonservices.com/${params.Endpoint}/${params.Version}?AWSAccessKeyId=${params.AWSAccessKey}&Action=${params.Action}&IdList.Id.1=${params.IdList}&IdType=${params.IdType}&MWSAuthToken=${params.MWSAuthToken}&MarketplaceId=${params.Marketplace}&SellerId=${params.SellerId}&SignatureMethod=${params.SignatureMethod}&SignatureVersion=${params.SignatureVersion}&Timestamp=${params.Timestamp}&Version=${params.Version}&Signature=${signature}`);
}

generateRequestURL('B01234567');