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

 module.exports = function serverContent(server) {

    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();
 
    const myDevice = namespace.addFolder("ObjectsFolder", {
        browseName: "MyDevice"
    });  

    const myObject1 = namespace.addObject({
        browseName: "MyObject1",
        organizedBy: myDevice,
    });    

    const variable1 = 10.0;

    server.nodeVariable1 = namespace.addVariable({
        componentOf: myObject1,
        nodeId: "s=Temperature",
        browseName: "Temperature",
        dataType: "Double",
        value: {
            get: () => {
                const t = new Date() / 10000.0;
                const value = variable1 + 10.0 * Math.sin(t);
                return new Variant({ dataType: DataType.Double, value: value });
            }
        }
    });

    const nodeVariable2 = namespace.addVariable({
        componentOf: myObject1,
        browseName: "City1",
        nodeId: "s=City1",
        dataType: "String",
        accessLevel: "CurrentRead | CurrentWrite",
        userAccessLevel: "CurrentRead | CurrentWrite",
        valueRank: 1
    });

    nodeVariable2.setValueFromSource({
        dataType: DataType.String,
        value: "Tokyo"
    });
}