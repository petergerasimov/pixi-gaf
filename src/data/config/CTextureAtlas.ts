import { Matrix } from "pixi.js";
import GAFScale9Texture from "../../display/GAFScale9Texture";
import GAFTexture from "../../display/GAFTexture";
import IGAFTexture from "../../display/IGAFTexture";
import TextureAtlas from "../textures/TextureAtlas";
import TextureWrapper from "../textures/TextureWrapper";
import CTextureAtlasCSF from "./CTextureAtlasCSF";
import CTextureAtlasElement from "./CTextureAtlasElement";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CTextureAtlas
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

	private _textureAtlasesDictionary:Map<String,TextureAtlas>;
	private _textureAtlasConfig:CTextureAtlasCSF;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor(textureAtlasesDictionary:Map<String,TextureAtlas>, textureAtlasConfig:CTextureAtlasCSF)
	{
		this._textureAtlasesDictionary=textureAtlasesDictionary;
		this._textureAtlasConfig=textureAtlasConfig;
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	public static createFromTextures(texturesDictionary:Map<String,TextureWrapper>,textureAtlasConfig:CTextureAtlasCSF):CTextureAtlas
	{
		const atlasesDictionary:Map<String,TextureAtlas>=new Map<String,TextureAtlas>();

		let atlas:TextureAtlas;

		for(const element of textureAtlasConfig.elements.elementsVector)
		{
			if(atlasesDictionary[element.atlasID]==null)
			{
				
				atlasesDictionary[element.atlasID]=new TextureAtlas(texturesDictionary[element.atlasID]);
			}

			atlas=atlasesDictionary[element.atlasID];
			
			atlas.addRegion(element.id, element.region, null, element.rotated);
		}
		
		return new CTextureAtlas(atlasesDictionary, textureAtlasConfig);
	}

	dispose():void
	{
		for(const textureAtlas of this._textureAtlasesDictionary.values())
		{
			textureAtlas.dispose();
		}
	}

	getTexture(id:string):IGAFTexture
	{
		const textureAtlasElement:CTextureAtlasElement=this._textureAtlasConfig.elements.getElement(id);
		if(textureAtlasElement!=null)
		{
			const texture:TextureWrapper=this.getTextureByIDAndAtlasID(id, textureAtlasElement.atlasID);

			let pivotMatrix:Matrix;

			if(this._textureAtlasConfig.elements.getElement(id)!=null)
			{
				pivotMatrix=this._textureAtlasConfig.elements.getElement(id).pivotMatrix;
			}
			else
			{
				pivotMatrix=new Matrix();
			}

			if(textureAtlasElement.scale9Grid !=null)
			{
				return new GAFScale9Texture(id, texture, pivotMatrix, textureAtlasElement.scale9Grid);
			}
			else
			{
				return new GAFTexture(id, texture, pivotMatrix);
			}
		}

		return null;
	}

	// --------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	getTextureByIDAndAtlasID(id:string, atlasID:string):TextureWrapper
	{
		const textureAtlas:TextureAtlas=this._textureAtlasesDictionary[atlasID];

		return textureAtlas.getTexture(id);
	}

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
}