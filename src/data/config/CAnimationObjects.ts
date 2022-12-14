import CAnimationObject from "./CAnimationObject";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CAnimationObjects
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

	private _animationObjectsDictionary:Map<string,CAnimationObject>;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor()
	{
		this._animationObjectsDictionary=new Map<string,CAnimationObject>();
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	addAnimationObject(animationObject:CAnimationObject):void
	{
		if(this._animationObjectsDictionary[animationObject.instanceID]==null)
		{
			this._animationObjectsDictionary[animationObject.instanceID]=animationObject;
		}
	}

	getAnimationObject(instanceID:string):CAnimationObject
	{
		if(this._animationObjectsDictionary[instanceID]!=null)
		{
			return this._animationObjectsDictionary[instanceID];
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

	
 	get animationObjectsDictionary():Map<string,CAnimationObject>
	{
		return this._animationObjectsDictionary;
	}

}