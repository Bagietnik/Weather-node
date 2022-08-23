const {
    OPCUAServer,
    ServerState,
    coerceLocalizedText,
    DataType,
    UAVariable,
    Variant,
    DataValue,
    StatusCode,
    StatusCodes,
    BindVariableOptionsVariation2,
    DataValueCallback,
    StatusCodeCallback,
    VariantArrayType,
    ErrorCallback,
    SessionContext
    } = require("node-opcua");
    
    const os = require("os");
    
    const {
    callbackify,
    } = require("util");

    var serverContent = require("./serverContent");
        
    (async () => {
        try {  
            const server = new OPCUAServer({ 
                port: 26543,
                buildInfo: {
                    manufacturerName: "A4BEE",
                    buildDate: "12.08.2022",
                    productName: "piotrekbServerOPCUA",
                    softwareVersion: "1.0.0",
                    },
            });
    
            await server.start();       
            serverContent(server);
    
            const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
            console.log("server is working on:", endpointUrl);
            console.log("CTRL+C to stop");
        } catch(err) { }
    })();
    