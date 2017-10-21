/**
 * Event function prototype for EventEmitter
 */
declare type EventListenerFn<T> = (meta: T) => void;

/**
 * Simple key value buffer that is faster to seek
 */
declare interface SimpleBufferFastSeek<T>
{
    [digest: number]: T;
}

/**
 * Bot supported events
 */
declare type BotEvent =
    | SendEvent
    | ReceiveEvent;

/**
 * Bufferable types in PeekBuffer
 */
declare interface Bufferable
{
    // Date of the item
    date: Date;

    // Checksum of the object
    digest: number;
}

/**
 * Metadata triggered by onReceive
 */
declare interface ReceiveEvent extends Bufferable
{
    /**
     * Who is the message sender?
     * Note: If you dont have him in your contact list, it will be the number (with county code)
     */
    sender: string;

    // The message
    message: string;

    // DOM Element
    rawElement?: Element;

    // Date of the message
    date: Date;

    // Is from myself?
    me: boolean;

    // Unique checksum for this message
    digest: number;

    // Process digest provided by the system
    processDigest: number;
}

/**
 * Metadata triggered by onSend
 */
declare interface SendEvent
{
    // The message
    message: string;

    // Date of the message
    date: Date;
}