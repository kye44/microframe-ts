import * as Express from 'express';
import { Request } from 'express';
import { NewApiRequestEvent } from '../event/api';
import { UseEventAggregator } from '../singleton';
/** 
 * Enum that represents HTTP methods.
*/
export enum HttpMethod {
    GET,
    POST,
    PUT,
    DELETE
}

/**
 * Represents a route in express.
 */
export interface ExpressRoute {
    method: HttpMethod,
    path: string,
    handler: (request: Express.Request, response: Express.Response) => Promise<void>;
}

export interface IController {
    router: Express.Router;
    routes: string[];
}

/**
 * Base controller for REST controllers.
 */
export class BaseController implements IController {
    public router: Express.Router;
    public routes: string[];
    protected path: string;

    public constructor(path: string) {
        this.path = path;
        this.routes = [];
        this.router = Express.Router();
        this.InitRoutes();
    }

    protected InitRoutes() { }

    /**
     * Registers ExpressRoutes with the controller router.
     * @remark Also populates the controller routes property; which can be used for debug.
     * @param expressRoutes the routes to register with the router.
     */
    public RegisterRoutes(expressRoutes: ExpressRoute[]): void {
        expressRoutes.forEach(expressRoute => {
            this.routes.push(expressRoute.path);
            switch (expressRoute.method) {
                case HttpMethod.GET:
                    this.router.get(expressRoute.path, publishNewApiRequestEvent, expressRoute.handler);
                    break;
                case HttpMethod.POST:
                    this.router.post(expressRoute.path, publishNewApiRequestEvent, expressRoute.handler);
                    break;
                case HttpMethod.PUT:
                    this.router.put(expressRoute.path, publishNewApiRequestEvent, expressRoute.handler);
                    break;
                case HttpMethod.DELETE:
                    this.router.delete(expressRoute.path, publishNewApiRequestEvent, expressRoute.handler);
                    break;
            }
        });
    }
}

const publishNewApiRequestEvent = (request: Request) => {
    const eventAggregator = UseEventAggregator();
    eventAggregator.GetEvent(NewApiRequestEvent).Publish({ Request: request } as NewApiRequestEvent);
}