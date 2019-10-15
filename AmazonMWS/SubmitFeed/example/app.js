const express = require('express');
const app = express();

require('dotenv').config();

const XMLConvert = require('xml-js');
const Axios = require('axios');

const { generateRequestURL } = require('./generateRequestURL');

app.listen(3000, () => console.log('Server started successfully!'));
app.use(express.json());

app.post('/amz/inventory', async (req, res) => {
    let reqData = req.body;
    if (Array.isArray(reqData) == false) {
        reqData = new Array(reqData); // If the request body only contains a single item, put it in an array in order to avoid looping issues
    };
    
    let Message = []; // Create empty array to store Message elements
    
    // For each element in the request body, create a new Message element, and store it in the Message array
    await reqData.forEach((item, index) => {
        
        Message.push({
            MessageID: index+1,
            OperationType: 'PartialUpdate',
            Inventory: {
                SKU: item.sku,
                Quantity: item.quantity
            }
        })
    })
    // Create JSON template to be converted to XML
    const feedData = {
        _declaration: {
            $: {
                version: '1.0',
                encoding: 'UTF-8'
            }
        },
        AmazonEnvelope: {
            $: {
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'xsi:noNamespaceSchemaLocation': 'amzn-envelope.xsd'
            },
            Header: {
                DocumentVersion: '1.0',
                MerchantIdentifier: process.env.SellerId
            },
            MessageType: 'Inventory',
            Message
        }
    }
    // Convert JSON to XML
    const XMLData = await XMLConvert.js2xml(feedData, {compact: true, spaces: 4, attributesKey: '$'});
        try {
            // Send feed to AMZ MWS via POST request using the generated URL + XML data
            const feed = await Axios.post(generateRequestURL(XMLData), XMLData)
            
            // Convert XML response from MWS to a JS object to allow for parsing
            const resData = await XMLConvert.xml2js(feed.data, {compact: true, spaces: 4, attributesKey: '$'});
            const feedResult = resData.SubmitFeedResponse.SubmitFeedResult.FeedSubmissionInfo;
            
            // Send parsed MWS response back to server
            return res.send(
                {
                    feedProcessingStatus: feedResult.FeedProcessingStatus['_text'],
                    feedSubmissionId: feedResult.FeedSubmissionId['_text'],
                    feedType: feedResult.FeedType['_text'],
                    requestId: resData.SubmitFeedResponse.ResponseMetadata.RequestId['_text'],
                    submittedDate: feedResult.SubmittedDate['_text'],
                    amountSubmitted: Message.length
                }
            );

        } catch (error) {
            return res.send(error.message);
        };
});