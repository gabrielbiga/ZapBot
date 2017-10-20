declare type EventListenerFn<T> = (param: T) => void;

declare type BotEvent =
    | SendEvent
    | ReceiveEvent;

declare interface SendEvent
{
    message: string;
    date: Date;
}

declare interface ReceiveEvent
{
    sender: string;
    message: string;
    rawElement: Element;
    date: Date;
    me: boolean;
}
