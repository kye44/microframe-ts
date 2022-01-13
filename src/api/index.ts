import { Application, urlencoded, json} from 'express';
import * as express from 'express';
import { IController} from './controller';

/**
 * Manages an Express Application, and API Controllers.
 */
export class ApiManager{
    public app: Application;
    private readonly port: number;
    private controllers: IController[];

    public constructor(
        port: number,
        controllers: IController[]
    ){
        this.app = express();
        this.port = port;
        this.InitMiddleware();
        this.controllers = controllers;
        this.InitControllers();
    }
    /**
     * Triggers the Express Application to start listening for requests.
     */
    public Listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Express server has started at http://localhost:${this.port}`);
        });
    }

    private InitMiddleware(): void {
        this.app.use(urlencoded({ extended: true }));
        this.app.use(json());
    }

    private InitControllers(): void {
        this.controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }
}

export * from './controller';