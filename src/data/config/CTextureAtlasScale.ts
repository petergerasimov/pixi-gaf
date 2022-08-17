import { MathUtility } from "../../utils/MathUtility";
import CTextureAtlasCSF from "./CTextureAtlasCSF";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CTextureAtlasScale
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

	private _scale:number;

	private _allContentScaleFactors:Array<CTextureAtlasCSF>;
	private _contentScaleFactor:CTextureAtlasCSF;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor()
	{
		this._allContentScaleFactors=[];
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	dispose():void
	{
		for(const cTextureAtlasCSF of this._allContentScaleFactors)
		{
			cTextureAtlasCSF.dispose();
		}
	}

	getTextureAtlasForCSF(csf:number):CTextureAtlasCSF
	{
		for(const textureAtlas of this._allContentScaleFactors)
		{
			if(MathUtility.equals(textureAtlas.csf, csf))
			{
				return textureAtlas;
			}
		}

		return null;
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

	set scale(scale:number)
	{
		this._scale=scale;
	}

	
 	get scale():number
	{
		return this._scale;
	}

	
 	get allContentScaleFactors():Array<CTextureAtlasCSF>
	{
		return this._allContentScaleFactors;
	}

	set allContentScaleFactors(value:Array<CTextureAtlasCSF>)
	{
		this._allContentScaleFactors=value;
	}

	
 	get contentScaleFactor():CTextureAtlasCSF
	{
		return this._contentScaleFactor;
	}

	set contentScaleFactor(value:CTextureAtlasCSF)
	{	
		this._contentScaleFactor=value;
	}
}