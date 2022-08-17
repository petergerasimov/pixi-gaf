import { TextStyle, Point } from "pixi.js";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CTextFieldObject
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
	private _width:number;
	private _height:number;
	private _text:string;
	private _embedFonts:boolean=false;
	private _multiline:boolean=false;
	private _wordWrap:boolean=false;
	private _restrict:string;
	private _editable:boolean=false;
	private _selectable:boolean=false;
	private _displayAsPassword:boolean=false;
	private _maxChars:number=0;
	private _textFormat:TextStyle;
	private _pivotPoint:Point;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor(id:string, text:string, textFormat:TextStyle, width:number, height:number)
	{
		this._id=id;
		this._text=text;
		this._textFormat=textFormat;

		this._width=width;
		this._height=height;

		this._pivotPoint=new Point();
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

	set id(value:string)
	{
		this._id=value;
	}

	
 	get text():string
	{
		return this._text;
	}

	set text(value:string)
	{
		this._text=value;
	}

	
 	get textFormat():TextStyle
	{
		return this._textFormat;
	}

	set textFormat(value:TextStyle)
	{
		this._textFormat=value;
	}

	
 	get width():number
	{
		return this._width;
	}

	set width(value:number)
	{
		this._width=value;
	}

	
 	get height():number
	{
		return this._height;
	}

	set height(value:number)
	{
		this._height=value;
	}

	// --------------------------------------------------------------------------
	//
	//  STATIC METHODS
	//
	// --------------------------------------------------------------------------

	
 	get embedFonts():boolean
	{
		return this._embedFonts;
	}

	set embedFonts(value:boolean)
	{
		this._embedFonts=value;
	}

	
 	get multiline():boolean
	{
		return this._multiline;
	}

	set multiline(value:boolean)
	{
		this._multiline=value;
	}

	
 	get wordWrap():boolean
	{
		return this._wordWrap;
	}

	set wordWrap(value:boolean)
	{
		this._wordWrap=value;
	}

	
 	get restrict():string
	{
		return this._restrict;
	}

	set restrict(value:string)
	{
		this._restrict=value;
	}

	
 	get editable():boolean
	{
		return this._editable;
	}

	set editable(value:boolean)
	{
		this._editable=value;
	}

	
 	get selectable():boolean
	{
		return this._selectable;
	}

	set selectable(value:boolean)
	{
		this._selectable=value;
	}

	
 	get displayAsPassword():boolean
	{
		return this._displayAsPassword;
	}

	set displayAsPassword(value:boolean)
	{
		this._displayAsPassword=value;
	}

	
 	get maxChars():number
	{
		return this._maxChars;
	}

	set maxChars(value:number)
	{
		this._maxChars=value;
	}

	
 	get pivotPoint():Point
	{
		return this._pivotPoint;
	}

	set pivotPoint(value:Point)
	{
		this._pivotPoint=value;
	}
}