import CTextureAtlasElement from "./CTextureAtlasElement";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CTextureAtlasElements
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

	private _elementsVector:Array<CTextureAtlasElement>;
	private _elementsDictionary:Map<String,CTextureAtlasElement>;
	private _elementsByLinkage:Map<String,CTextureAtlasElement>;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor()
	{
		this._elementsVector=[];
		this._elementsDictionary=new Map<String,CTextureAtlasElement>();
		this._elementsByLinkage=new Map<String,CTextureAtlasElement>();
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	addElement(element:CTextureAtlasElement):void
	{
		if(this._elementsDictionary[element.id]==null)
		{
			this._elementsDictionary[element.id]=element;

			this._elementsVector.push(element);

			if(element.linkage!=null)
			{
				this._elementsByLinkage[element.linkage]=element;
			}
		}
	}

	getElement(id:string):CTextureAtlasElement
	{
		if(this._elementsDictionary[id]!=null)
		{
			return this._elementsDictionary[id];
		}
		else
		{
			return null;
		}
	}

	getElementByLinkage(linkage:string):CTextureAtlasElement
	{
		if(this._elementsByLinkage[linkage]!=null)
		{
			return this._elementsByLinkage[linkage];
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

	
 	get elementsVector():Array<CTextureAtlasElement>
	{
		return this._elementsVector;
	}

}