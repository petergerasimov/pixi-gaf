import CAnimationObject from "./CAnimationObject";
import CTextFieldObject from "./CTextFieldObject";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CTextFieldObjects
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

	private _textFieldObjectsDictionary:Map<String,CTextFieldObject>;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor()
	{
		this._textFieldObjectsDictionary=new Map<String,CTextFieldObject>();
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	addTextFieldObject(textFieldObject:CTextFieldObject):void
	{
		if(this._textFieldObjectsDictionary[textFieldObject.id]==null)
		{
			this._textFieldObjectsDictionary[textFieldObject.id]=textFieldObject;
		}
	}

	getAnimationObject(id:string):CAnimationObject
	{
		if(this._textFieldObjectsDictionary[id]!=null)
		{
			return this._textFieldObjectsDictionary[id] as CAnimationObject;
		}
		else
		{
			return null;
		}
	}

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

	
 	get textFieldObjectsDictionary():Map<String,CTextFieldObject>
	{
		return this._textFieldObjectsDictionary;
	}

	// --------------------------------------------------------------------------
	//
	//  STATIC METHODS
	//
	// --------------------------------------------------------------------------

}