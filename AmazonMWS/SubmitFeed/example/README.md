# Quick Start Guide

1. Clone the entire **/example** directory
2. Ensure you have [Node.js](https://nodejs.org/en/) installed ([Postman](https://www.getpostman.com/) is also recommended)
3. Once cloned onto your machine, navigate into the folder using the terminal
4. Run `npm install` within your terminal, and wait for the dependencies to install
5. Create a file in the **/example** directory named **.env**
6. Fill in the **.env** file with your MWS credentials using the following syntax:
```
AWSAccessKey=""
MWSAuthToken=""
SellerId=""
Secret=""
```

7. Run `npm start` once all of the dependencies have been installed

You should see the following message(s) appear in your terminal:
```
> nodemon app.js

[nodemon] 1.19.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
Server started successfully!
```
*If you receive a* `Error: listen EADDRINUSE: address already in use :::3000` *error, change the port number used in app.js.*


Once your server has started, send a `POST` request to **http://localhost:3000/amz/inventory** with the following structure:
```
{
	"sku": "ITEM12345",
	"quantity": 5
}
```

*or*

```
[
    {
        "sku": "ITEM12345",
        "quantity": 5
    },
    {
        "sku": "ITEM23456",
        "quantity": 10
    }
]
```


***(If you receive a 400 error, please check your credentials.)***

