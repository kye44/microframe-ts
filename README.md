# Api
### ApiManager
The ApiManager handles the Express Application and all of the registered controllers.
### BaseController
The BaseController provides base functionality for an Api Controller, and should be extended when creating a controller. Controller routes can be registered using the BaseController's `RegisterRoutes` method. 
### Events
#### NewApiRequestEvent 
The `NewApiRequestEvent` is published to the EventAggregator when a Api request is received by a controller.

# Event
### EventAggregator
The EventAggregator aggregates published events to subscribed handlers. The EventAggregator singleton can be accessed via the `UseEventAggregator` function.
#### Usage
The EventAggregator works best when used with Dependecy Injection. Below is an example of getting the EventAggregator singleton, then registering the singleton with a `typedi` container.
```typescript
const eventAggregator = UseEventAggregator();
Container.set(EventAggregator, eventAggregator);
```
When registered in a `typedi` container, the EventAggregator can be resolved anywhere with access to the container, or via constructor injection (example below).

```typescript
@Service()
export default class ArticleService {
    constructor (eventAggregator: EventAggregator) {
        eventAggregator.GetEvent(NewApiRequestEvent).Subscribe((args: NewApiRequestEvent) => {console.log(args.Request)});
    }
}
```
# Creating a Microservice
### Setup
First thing to do is setup the Depenecy Injection for the service, `typedi` works well with `microframe-ts` but any Dependecy Injection package should work (setup for typedi can be found [here](https://github.com/typestack/typedi). 
Start by registering any packages outside your project with the `typedi` container, example below shows the `microframe-ts` ApiManager being registered with the container.
```typescript
Container.set(ApiManager, apiManager);
```
Any classes you wish to be automatically registered with the container as a singleton should have the `Service` decorator.
```Typescript
@Service()
export default class ExampleService {
}
```
### Web Api
A Web Api allows for communication via HTTP requests. `microframe-ts` uses controllers to handle the Api requests recieved.
Start by creating a controller, a controller should be a class that extends the `BaseController` class; controllers should also be marked with the `Service` `typedi` decorator or manually registered with the DI container. To initialise routes, the controller needs a method named `InitRoutes` which will be called by the `BaseController` when it is ready to initialise; this is where routes can be registered (see example below).
```Typescript
@Service()
export default class ExampleController extends BaseController {
    public constructor() {
        super('/example');
    }

    public InitRoutes(): void {
        // Routes go here.
        console.log(`Init routes - ${this.path}`);
        this.RegisterRoutes([
            { method: HttpMethod.GET, path: `${this.path}/helloworld`, handler: async (_, response: Express.Response) => await this.helloWorld(response) },
        ]);
        console.log(`Routes registered - ${this.routes}`);
    }

    private async helloWorld(response: Express.Response): Promise<void> {
        response.send('Hello World');
    }
}
```
Next step is to create an instance of `ApiManager`, the ApiManager expects a port number and a list of controllers, this list of controllers can be resolved from the container as seen below.
```Typescript
 const apiManager = new ApiManager(5000,[Container.get(ArticleController)]);
 Container.set(ApiManager, apiManager);
```
Finally call the `Listen` method on the `ApiManager`.
```Typescript
 const apiManager = new ApiManager(5000,[Container.get(ArticleController)]);
 Container.set(ApiManager, apiManager);
 apiManager.Listen();
```

### Logger
`microframe-ts` uses the package `tslog` for logging, more information on `tslog` can be found [here](https://github.com/fullstack-build/tslog). In order to use the `Logger` throughout the microservice, register the `Logger` with the DI container using `UseLogger` to get the `Logger` singleton; as shown below.
```Typescript
const logger = UseLogger();
Container.set(Logger, logger);
```
The `Logger` can then be injected in services as so.
```Typescript
@Service()
class ExampleService {
    private readonly logger: Logger;
    
    constructor(logger: Logger) {
        this.logger = logger;
        this.logger.info('Hello World');
    }
}
```

Information on Microservice architecture can be found [here](https://docs.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices).
