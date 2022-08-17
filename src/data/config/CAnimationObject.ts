import { Point } from "pixi.js";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CAnimationObject
{
	// --------------------------------------------------------------------------
	//
	//  PUBLIC VARIABLES
	//
	// --------------------------------------------------------------------------

	public static TYPE_TEXTURE:string="texture";
	public static TYPE_TEXTFIELD:string="textField";
	public static TYPE_TIMELINE:string="timeline";

	// --------------------------------------------------------------------------
	//
	//  PRIVATE VARIABLES
	//
	// --------------------------------------------------------------------------

	private _instanceID:string;
	private _regionID:string;
	private _type:string;
	private _mask:boolean=false;
	private _maxSize:Point;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor(instanceID:string, regionID:string, type:string, mask:boolean)
	{
		this._instanceID=instanceID;
		this._regionID=regionID;
		this._type=type;
		this._mask=mask;
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	// --------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	// --------------------------------------------------------------------------
	//
	// OVERRIDDEN METHODS
	//
	// --------------------------------------------------------------------------

	// --------------------------------------------------------------------------
	//
	//  EVENT HANDLERS
	//
	// --------------------------------------------------------------------------

	// --------------------------------------------------------------------------
	//
	//  GETTERS AND SETTERS
	//
	// --------------------------------------------------------------------------

	
 	get instanceID():string
	{
		return this._instanceID;
	}

	
 	get regionID():string
	{
		return this._regionID;
	}

	
 	get mask():boolean
	{
		return this._mask;
	}

	
 	get type():string
	{
		return this._type;
	}

	
 	get maxSize():Point
	{
		return this._maxSize;
	}

	set maxSize(value:Point)
	{
		this._maxSize=value;
	}
}