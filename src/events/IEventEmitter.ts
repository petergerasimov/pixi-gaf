/**
 * Equivalent to AS3 IEventDispatcher
 * @author Mathieu Anthoine
 */
export interface IEventEmitter<Dynamic>
{
	listeners: (event:string) => Array<Dynamic>;
	emit: (event:string, a1?:Dynamic, a2?:Dynamic, a3?:Dynamic, a4?:Dynamic, a5?:Dynamic) => boolean;
	on: (event:string, fn:(args: Dynamic) => void, context?:Dynamic) => void;
	once: (event:string, fn:(args: Dynamic) => void, context?:Dynamic) => void;
	addListener: (event:string, fn:(args: Dynamic) => void, context?:Dynamic) =>void;
	off: (event:string, fn:(args: Dynamic) => void, once?:boolean)=>void;
	removeListener: (event:string, fn:(args: Dynamic) => void, once?:boolean) => void;
	removeAllListeners: (event?:string) => void;
}