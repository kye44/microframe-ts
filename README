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