module.exports = function(RED) {

const {
    OPCUAClient,
    AttributeIds,
    ClientSubscription,
    TimestampsToReturn
} = require("node-opcua");

const async = require("async");

const client = OPCUAClient.create({ 
    endpointMustExist: false,
    connectionStrategy: {
        initialDelay: 2000,
        maxDelay: 10 * 1000,
        maxRetry: 10,
        }});

const endpointUrl = "opc.tcp://rpi-piotrek-b:26543";
const nodeId = "ns=1;s=Temperature";

/** @type ClientSession */
let theSession = null;

/** @type ClientSubscription */
let theSubscription = null;
async.series([

    // step 1 : connect to
    function(callback) {

        client.connect(endpointUrl, function(err) {

            if (err) {
                console.log(" Can't connect to endpoint :", endpointUrl);
            } else {
                console.log("Connected to OPC UA Server!");
            }
            callback(err);
        });
    },
    // step 2 : createSession
    function(callback) {
        client.createSession(function(err, session) {
            if (!err) {
                theSession = session;
            }
            callback(err);
        });

    },

    // step 3 : browse
    function(callback) {
        theSession.browse("RootFolder", function(err, browse_result) {
            if (!err) {
                browse_result.references.forEach(function(reference) {
                    console.log(reference.browseName); 
                    //Zwraca strukturę pod folderem Root
                });
            }
            callback(err);
        });
    },

    // step 5: install a subscription and monitored item
    //
    // -----------------------------------------
    // create subscription
    function(callback) {

        theSession.createSubscription2({
            requestedPublishingInterval: 1000,
            requestedLifetimeCount: 1000,
            requestedMaxKeepAliveCount: 20,
            maxNotificationsPerPublish: 10,
            publishingEnabled: true,
            priority: 10
        }, function(err, subscription) {
            if (err) { return callback(err); }
            theSubscription = subscription;

            theSubscription.on("keepalive", function() {
                console.log("keepalive");
            }).on("terminated", function() {
            });
            callback();
        });

    }, function(callback) {        
            setTimeout(() => {                
                callback();
            }, 3000);

    }, function(callback) {
        // install monitored item
        //
        theSubscription.monitor({
            nodeId,
            attributeId: AttributeIds.Value
        },
            {
                samplingInterval: 1000,
                discardOldest: true,
                queueSize: 10
            }, TimestampsToReturn.Both,
            (err, monitoredItem) => {
                console.log("-------------------------------------");
                monitoredItem
                    .on("changed", function(value) {
                        console.log(" New Temp Value = ", value.value.toString());
                    })
                    .on("err", (err) => {
                        console.log("MonitoredItem err =", err.message);
                    });
                callback(err);

            });

    }, function(callback) {        
        callback();
    }]);
}