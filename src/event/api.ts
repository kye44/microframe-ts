import { PubSubBase } from '.';
import {Request} from 'express';

export class NewApiRequestEvent extends PubSubBase<NewApiRequestEvent> {
    private request: Request | null = null;

    public get Request(): Request | null{
        return this.request;
    }

    public set Request(value: Request | null){
        this.request = value;
    }
}