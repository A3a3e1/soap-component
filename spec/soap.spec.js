const soap = require('soap');
const assert = require('assert');
const expect = require('chai').expect;

describe('Given coplex WSDL ', function () {
    it('parse QueryCustomerIn.wsdl from SAP ByD', function () {
        return soap.createClientAsync(__dirname + '/data/sapbyd/QueryCustomerIn.wsdl').then((client) => {
            const description = client.describe();

            const services = Object.keys(description);
            assert.deepEqual(services,['service']);

            const service = description[services[0]];
            const ports = Object.keys(service);
            assert.deepEqual(ports, ['binding_SOAP12', 'binding']);
        });
    });
});

xdescribe('givesn simple WSDL', function () {
    let client = null;
    let description = null;

    function toJSONSchema(se) {
        console.log(se);
        const result = {};
        if (se.$type) {
            result.type = 'string';
            result.default = se.$default;
        } else if (se.children && se.children.length === 1) {
            const child = se.children[0];
            if (child.name === 'complexType') {
                result.type = 'object';
                result.properties = [];
                console.log(child);
            }
        }
        return result;
    }

    beforeEach(function (done) {
        // Here we assume the http://www.webservicex.com/globalweather.asmx?wsdl is accessible
        soap.createClient(__dirname + '/data/HelloWorldCXF.wsdl', function (err, result) {
            expect(err).toBeNull();
            client = result;
            description = result.describe();
            expect(description).not.toBeNull();
            done();
        });
    });

    it('has service and port', function () {
        const services = Object.keys(description);
        expect(services).toEqual(['SOAPServiceGreeting']);

        const service = description[services[0]];
        const ports = Object.keys(service);
        expect(ports).toEqual(['SoapPortName']);
    });

    xit('converts simple type', function () {
        const element = client.wsdl.findSchemaObject('http://apache.org/hello_world_soap_http/types', 'simpleTypeElement')
        const result = toJSONSchema(element);
        expect(result).toEqual({type: 'string', default: 'red'});
    });

    it('convers complex type', function () {
        const greetMeEl = client.wsdl.findSchemaObject('http://apache.org/hello_world_soap_http/types', 'greetMe')
        console.log(toJSONSchema(greetMeEl));
    });

});
