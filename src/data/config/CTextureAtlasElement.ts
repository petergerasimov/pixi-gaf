import { Rectangle, Matrix } from "pixi.js";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CTextureAtlasElement
{
	// --------------------------------------------------------------------------
	//
	//  PUBLIC VARIABLES
	//
	// --------------------------------------------------------------------------

	// --------------------------------------------------------------------------
	//
	//  PRIVATE VARIABLES
	//
	// --------------------------------------------------------------------------

	private _id:string;
	private _linkage:string;
	private _atlasID:string;
	private _region:Rectangle;
	private _pivotMatrix:Matrix;
	private _scale9Grid:Rectangle;
	private _rotated:boolean=false;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor(id:string, atlasID:string)
	{
		this._id=id;
		this._atlasID=atlasID;
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

	
 	get id():string
	{
		return this._id;
	}

	
 	get region():Rectangle
	{
		return this._region;
	}

	set region(region:Rectangle)
	{
		this._region=region;
	}

	
 	get pivotMatrix():Matrix
	{
		return this._pivotMatrix;
	}

	set pivotMatrix(pivotMatrix:Matrix)
	{
		this._pivotMatrix=pivotMatrix;
	}

	
 	get atlasID():string
	{
		return this._atlasID;
	}

	
 	get scale9Grid():Rectangle
	{
		return this._scale9Grid;
	}

	set scale9Grid(value:Rectangle)
	{
		this._scale9Grid=value;
	}

	
 	get linkage():string
	{
		return this._linkage;
	}

	set linkage(value:string)
	{
		this._linkage=value;
	}

	
 	get rotated():boolean
	{
		return this._rotated;
	}

	set rotated(value:boolean)
	{
		this._rotated=value;
	}
}