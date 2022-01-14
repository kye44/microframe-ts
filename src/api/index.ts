import { Application, urlencoded, json } from 'express';
import * as express from 'express';
import { IController } from './controller';
import { Logger, UseLogger } from '../log';

/**
 * Manages an Express Application, and API Controllers.
 */
export class ApiManager {
    public app: Application;
    private readonly port: number;
    private controllers: IController[];
    private readonly logger: Logger;

    public constructor(
        port: number,
        controllers: IController[]
    ) {
        this.app = express();
        this.logger = UseLogger();
        this.port = port;
        this.InitMiddleware();
        this.controllers = controllers;
        this.InitControllers();
    }
    /**
     * Triggers the Express Application to start listening for requests.
     */
    public Listen(): void {
        try {
            this.app.listen(this.port, () => {
                this.logger.info(`Express server has started at http://localhost:${this.port}`);
            });
        }
        catch (e) {
            this.logger.error(`Failed to listen on port ${this.port} with exception ${e}`);
        }
    }

    private InitMiddleware(): void {
        this.app.use(urlencoded({ extended: true }));
        this.app.use(json({ verify: (req: any, _, buf) => { req.rawBody = buf } }));
    }

    private InitControllers(): void {
        this.controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }
}

export * from './controller';