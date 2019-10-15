require('dotenv').config();
const Crypto = require('crypto-js');

const generateRequestURL = (reqbody) => {
    const secret = process.env.Secret;

    const MD5Hash = Crypto.MD5(reqbody); // Create MD5 Hash of entire XML body
    const Base64MD5Hash = Crypto.enc.Base64.stringify(MD5Hash); // Convert MD5 Hash to Base64

    const params = {
        AWSAccessKeyId: process.env.AWSAccessKey,
        Action: 'SubmitFeed',
        FeedType: '_POST_INVENTORY_AVAILABILITY_DATA_',
        PurgeAndReplace: false,
        MWSAuthToken: process.env.MWSAuthToken,
        Merchant: process.env.SellerId,
        SignatureMethod: 'HmacSHA256',
        ContentMD5Value: encodeURIComponent(Base64MD5Hash), // URL-Encode Base64 MD5 Hash
        SignatureVersion: 2,
        Timestamp: encodeURIComponent(new Date().toISOString()), // URL-Encode timestamp
        Endpoint: 'Feeds',
        Version: '2009-01-01'
    };

    const signatureInput = `POST\nmws.amazonservices.com\n/${params.Endpoint}/${params.Version}\nAWSAccessKeyId=${params.AWSAccessKeyId}&Action=${params.Action}&ContentMD5Value=${params.ContentMD5Value}&FeedType=${params.FeedType}&MWSAuthToken=${params.MWSAuthToken}&Merchant=${params.Merchant}&PurgeAndReplace=${params.PurgeAndReplace}&SignatureMethod=${params.SignatureMethod}&SignatureVersion=${params.SignatureVersion}&Timestamp=${params.Timestamp}&Version=${params.Version}`;

    const hash = Crypto.HmacSHA256(signatureInput, secret); // Encrypting the signature
    const base64hash = Crypto.enc.Base64.stringify(hash); // Converting the encrypted signature into a Base64 string
    const signature = encodeURIComponent(base64hash); // URL-Encoding the Base64 string to get the Signature parameter
    const urlParams = `AWSAccessKeyId=${params.AWSAccessKeyId}&Action=${params.Action}&ContentMD5Value=${params.ContentMD5Value}&FeedType=${params.FeedType}&MWSAuthToken=${params.MWSAuthToken}&Merchant=${params.Merchant}&PurgeAndReplace=${params.PurgeAndReplace}&SignatureMethod=${params.SignatureMethod}&SignatureVersion=${params.SignatureVersion}&Timestamp=${params.Timestamp}&Version=${params.Version}&Signature=${signature}`
    
    return `https://mws.amazonservices.com/${params.Endpoint}/${params.Version}?${urlParams}`;
}

module.exports.generateRequestURL = generateRequestURL;