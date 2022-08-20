import { utils } from "pixi.js";
import DebugUtility from "../utils/DebugUtility";
import ITAGFX from "./tagfx/ITAGFX";
import TAGFXBase from "./tagfx/TAGFXBase";
import TextureWrapper from "./textures/TextureWrapper";

/**
 * Dispatched when he texture is decoded. It can only be used when the callback has been executed.
 */
// [Event(name="texturesReady", type="flash.events.Event")]

/**
 * Graphical data storage that used by<code>GAFTimeline</code>. It contain all created textures and all
 * saved images as<code>BitmapData</code>.
 * Used as shared graphical data storage between several GAFTimelines if they are used the same texture atlas(bundle created using "Create bundle" option)
 */

/**
 * TODO vu le système de chargement, les onReady et autre test de chargement ne servent a rien, a simplifier
 * @author Mathieu Anthoine
 * 
 */ 
export default class GAFGFXData extends utils.EventEmitter
{
	public static EVENT_TYPE_TEXTURES_READY:string="texturesReady";

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

	private _texturesDictionary:Map<string,Map<string,Map<string,TextureWrapper>>>= new Map<string,Map<string,Map<string,TextureWrapper>>>();
	private _taGFXDictionary:Map<string,Map<string,Map<string,ITAGFX>>> = new Map<string,Map<string,Map<string,ITAGFX>>>();

	private _textureLoadersSet:Map<ITAGFX,ITAGFX>=new Map<ITAGFX,ITAGFX>();

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor()
	{
		super();
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	addTAGFX(scale:number, csf:number, imageID:string, taGFX:ITAGFX):void
	{
		
		const lScale:string = string(scale);
		const lCsf:string = string(csf);
		
		if (this._taGFXDictionary[lScale]==null) this._taGFXDictionary[lScale]=new Map<string,Map<string,ITAGFX>>();
		if (this._taGFXDictionary[lScale][lCsf]==null) this._taGFXDictionary[lScale][lCsf]=new Map<string,ITAGFX>();
		if (this._taGFXDictionary[lScale][lCsf][imageID]==null) this._taGFXDictionary[lScale][lCsf][imageID]=taGFX;
	}

	getTAGFXs(scale:number, csf:number):Map<string,ITAGFX>
	{
		const lScale:string = string(scale);
		const lCsf:string = string(csf);
		
		if(this._taGFXDictionary!=null)
		{
			if(this._taGFXDictionary[lScale]!=null)
			{
				return this._taGFXDictionary[lScale][lCsf];
			}
		}

		return null;
	}

	getTAGFX(scale:number, csf:number, imageID:string):ITAGFX
	{
		const lScale:string = string(scale);
		const lCsf:string = string(csf);
		
		if(this._taGFXDictionary!=null)
		{
			if(this._taGFXDictionary[lScale]!=null)
			{
				if(this._taGFXDictionary[lScale][lCsf]!=null)
				{
					return this._taGFXDictionary[lScale][lCsf][imageID];
				}
			}
		}

		return null;
	}

	// Creates textures from all images for specified scale and csf.
	createTextures(scale:number, csf:number):boolean
	{
		const taGFXs:Map<string,ITAGFX>=this.getTAGFXs(scale, csf);
		if(taGFXs!=null)
		{
			const lScale:string = string(scale);
			const lCsf:string = string(csf);
			if (this._texturesDictionary[lScale]==null) this._texturesDictionary[lScale]=new Map<string,Map<string,TextureWrapper>>();
			if (this._texturesDictionary[lScale][lCsf]==null) this._texturesDictionary[lScale][lCsf] =new Map<string,TextureWrapper>();

			for(const imageAtlasID in taGFXs)
			{
				if(taGFXs[imageAtlasID]!=null)
				{
					this.addTexture(this._texturesDictionary[lScale][lCsf], taGFXs[imageAtlasID], imageAtlasID);
				}
			}
			return true;
		}

		return false;
	}

	// Creates texture from specified image.
	createTexture(scale:number, csf:number, imageID:string):boolean
	{
		const taGFX:ITAGFX=this.getTAGFX(scale, csf, imageID);
		if(taGFX!=null)
		{
			const lScale:string = string(scale);
			const lCsf:string = string(csf);
			if (this._texturesDictionary[lScale]==null) this._texturesDictionary[lScale]=new Map<string,Map<string,TextureWrapper>>();
			if (this._texturesDictionary[lScale][lCsf]==null) this._texturesDictionary[lScale][lCsf] =new Map<string,TextureWrapper>();

			this.addTexture(this._texturesDictionary[lScale][lCsf], taGFX, imageID);

			return true;
		}

		return false;
	}

	// Returns texture by unique key consist of scale + csf + imageID
	getTexture(scale:number, csf:number, imageID:string):TextureWrapper
	{
		const lScale:string = string(scale);
		const lCsf:string = string(csf);
		if(this._texturesDictionary!=null)
		{
			
			if(this._texturesDictionary[lScale]!=null)
			{
				
				if(this._texturesDictionary[lScale][lCsf]!=null)
				{
					if(this._texturesDictionary[lScale][lCsf][imageID]!=null)
					{
						return this._texturesDictionary[lScale][lCsf][imageID];
					}
				}
			}
		}

		// in case when there is no texture created
		// create texture and check if it successfully created
		if(this.createTexture(scale, csf, imageID))
		{
			return this._texturesDictionary[lScale][lCsf][imageID];
		}

		return null;
	}

	// Returns textures for specified scale and csf in Dynamic as combination key-value where key - is imageID and value - is Texture
	getTextures(scale:number, csf:number):Map<string,TextureWrapper>
	{
		
		const lScale:string = string(scale);
		const lCsf:string = string(csf);
		if(this._texturesDictionary!=null)
		{
			if(this._texturesDictionary[lScale]!=null)
			{
				return this._texturesDictionary[lScale][lCsf];
			}
		}
		
		return null;
	}

	// Dispose specified texture or textures for specified combination scale and csf. If nothing was specified - dispose all texturea
	disposeTextures(scale?:number, csf?:number, imageID:string=null):void
	{
		console.warn("disposeTextures: TODO");
		
		// if(Number.isNaN(scale))
		// {
			// for(scaleToDispose in _texturesDictionary)
			// {
				// disposeTextures(Std.parsenumber(scaleToDispose));
			// }
//
			// _texturesDictionary=null;
		// }
		// else
		// {
			// if(Number.isNaN(csf))
			// {
				// for(csfToDispose in _texturesDictionary[scale])
				// {
					// disposeTextures(scale, Std.parsenumber(csfToDispose));
				// }
//
				// _texturesDictionary.remove(scale);
			// }
			// else
			// {
				// if(imageID)
				// {
					// cast(_texturesDictionary[scale][csf][imageID],TempTexture).destroy();
//
					// _texturesDictionary[scale][csf].remove(imageID);
				// }
				// else
				// {
					// if(_texturesDictionary[scale] && _texturesDictionary[scale][csf])
					// {
						// for(atlasIDToDispose in _texturesDictionary[scale][csf])
						// {
							// disposeTextures(scale, csf, atlasIDToDispose);
						// }
						// _texturesDictionary[scale].remove(csf);
					// }
				// }
			// }
		// }
	}

	// --------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	private addTexture(dictionary:Map<string,TextureWrapper>, tagfx:ITAGFX, imageID:string):void
	{
		
		if(DebugUtility.RENDERING_DEBUG)
		{
			// var bitmapData:BitmapData;
			// if(tagfx.sourceType==TAGFXBase.SOURCE_TYPE_BITMAP_DATA)
			// {
				// bitmapData=setGrayScale(tagfx.source.clone());
			// }
//
			// if(bitmapData)
			// {
				// dictionary[imageID]=Texture.fromBitmapData(bitmapData, GAF.useMipMaps, false, tagfx.textureScale, tagfx.textureFormat);
			// }
			// else
			// {
				if(tagfx.texture!=null)
				{
					// dictionary[imageID]=Texture.fromTexture(tagfx.texture);
				}
				else
				{
					throw new Error("GAFGFXData texture for rendering not found!");
				}
			// }
		}
		else if(dictionary[imageID]==null)
		{
			if(!tagfx.ready)
			{
				this._textureLoadersSet[tagfx] = tagfx;
				tagfx.on(TAGFXBase.EVENT_TYPE_TEXTURE_READY, this.onTextureReady);
			}

			dictionary[imageID] = TextureWrapper.fromTexture(tagfx.texture);
			// dictionary[imageID] = cast Texture.fromImage(tagfx.texture.baseTexture.imageUrl);
		}
	}

	// private setGrayScale(image:BitmapData):BitmapData
	// {
		// var matrix:Array<Dynamic>=[
			// 0.26231, 0.51799, 0.0697, 0, 81.775,
			// 0.26231, 0.51799, 0.0697, 0, 81.775,
			// 0.26231, 0.51799, 0.0697, 0, 81.775,
			// 0, 0, 0, 1, 0];
//
		// var filter:ColorMatrixFilter=new ColorMatrixFilter(matrix);
		// image.applyFilter(image, new Rectangle(0, 0, image.width, image.height), new Point(0, 0), filter);
//
		// return image;
	// }

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
	private onTextureReady(event:any):void
	{
		const tagfx:ITAGFX = event.target;
		tagfx.off(TAGFXBase.EVENT_TYPE_TEXTURE_READY, this.onTextureReady);

		this._textureLoadersSet.delete(tagfx);

		if(this.isTexturesReady)
			this.emit(GAFGFXData.EVENT_TYPE_TEXTURES_READY);
	}

	// --------------------------------------------------------------------------
	//
	//  GETTERS AND SETTERS
	//
	// --------------------------------------------------------------------------

 	get isTexturesReady():boolean
	{
		return this._textureLoadersSet.size === 0;
	}
}