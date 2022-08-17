import CTextureAtlas from "./CTextureAtlas";
import CTextureAtlasElements from "./CTextureAtlasElements";
import CTextureAtlasSource from "./CTextureAtlasSource";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CTextureAtlasCSF
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
	private _csf:number;

	private _sources:Array<CTextureAtlasSource>;

	private _elements:CTextureAtlasElements;

	private _atlas:CTextureAtlas;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor(csf:number, scale:number)
	{
		this._csf=csf;
		this._scale = scale;

		this._sources=[];
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	dispose():void
	{
		if (this._atlas != null) {
			this._atlas.dispose();
			this._atlas=null;
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

	
 	get csf():number
	{
		return this._csf;
	}

	
 	get sources():Array<CTextureAtlasSource>
	{
		return this._sources;
	}

	set sources(sources:Array<CTextureAtlasSource>)
	{
		this._sources=sources;
	}

	
 	get atlas():CTextureAtlas
	{
		return this._atlas;
	}

	set atlas(atlas:CTextureAtlas)
	{
		this._atlas=atlas;
	}

	
 	get elements():CTextureAtlasElements
	{
		return this._elements;
	}

	set elements(elements:CTextureAtlasElements)
	{
		this._elements=elements;
	}
}