var server = new grpc.Server();
server.addService(hello_proto.Greeter.service,
    { sayHello: sayHello, sayHelloAgain: sayHelloAgain });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});
