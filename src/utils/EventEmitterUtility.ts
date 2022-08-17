import { utils } from "pixi.js";

/**
 * Class that adds equivalents to AS3 methods
 * @author Mathieu Anthoine
 */
export class EventEmitterUtility
{

	public static hasEventListener(pEmitter:utils.EventEmitter,pEvent:string):boolean{
		if (pEmitter.listeners == null) return false;
		return pEmitter.listeners(pEvent).length > 0;
	}
	
}