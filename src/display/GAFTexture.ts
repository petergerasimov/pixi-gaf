import { Matrix } from "pixi.js";
import TextureWrapper from "../data/textures/TextureWrapper";
import IGAFTexture from "./IGAFTexture";
/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class GAFTexture implements IGAFTexture
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
	private _texture:TextureWrapper;
	private _pivotMatrix:Matrix;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor(id:string, texture:TextureWrapper, pivotMatrix:Matrix)
	{
		this._id=id;
		this._texture=texture;
		this._pivotMatrix = pivotMatrix;
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------
	copyFrom(newTexture:IGAFTexture):void
	{
		if(newTexture instanceof GAFTexture)
		{
			this._id=newTexture.id;
			this._texture=newTexture.texture;
			this._pivotMatrix.copyFrom(newTexture.pivotMatrix);
		}
		else
		{
			throw new Error("Incompatiable types GAFexture and "+ typeof newTexture);
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

 	get texture():TextureWrapper
	{
		return this._texture;
	}

 	get pivotMatrix():Matrix
	{
		return this._pivotMatrix;
	}

 	get id():string
	{
		return this._id;
	}

	clone():IGAFTexture
	{
		return new GAFTexture(this._id, this._texture, this._pivotMatrix.clone());
	}
}