/* eslint-disable valid-jsdoc */
/**
 *<p>GAFTimeline represents converted GAF file. It is like a library symbol in Flash IDE that contains all information about GAF animation.
 * It is used to create<code>GAFMovieClip</code>that is ready animation object to be used in starling display list</p>
 */
/**
 * TODO
 * @author Mathieu Anthoine
 */

import IGAFTexture from "../display/IGAFTexture";
import GAFSoundData from "../sound/GAFSoundData";
import CAnimationObject from "./config/CAnimationObject";
import CTextureAtlas from "./config/CTextureAtlas";
import CTextureAtlasCSF from "./config/CTextureAtlasCSF";
import CTextureAtlasScale from "./config/CTextureAtlasScale";
import ErrorConstants from "./converters/ErrorConstants";
import GAFAsset from "./GAFAsset";
import GAFGFXData from "./GAFGFXData";
import GAFTimelineConfig from "./GAFTimelineConfig";
import TextureWrapper from "./textures/TextureWrapper";


export default class GAFTimeline
{
	// --------------------------------------------------------------------------
	//
	//  PUBLIC VARIABLES
	//
	// --------------------------------------------------------------------------

	public static CONTENT_ALL:string="contentAll";
	public static CONTENT_DEFAULT:string="contentDefault";
	public static CONTENT_SPECIFY:string="contentSpecify";

	// --------------------------------------------------------------------------
	//
	//  PRIVATE VARIABLES
	//
	// --------------------------------------------------------------------------

	private _config:GAFTimelineConfig;

	private _gafSoundData:GAFSoundData;
	
	private _gafgfxData:GAFGFXData;
	private _gafAsset:GAFAsset;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	/**
	* Creates an GAFTimeline object
	* @param timelineConfig GAF timeline config
	*/
	constructor(timelineConfig:GAFTimelineConfig)
	{
		this._config=timelineConfig;
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	/**
	* Returns GAF Texture by name of an instance inside a timeline.
	* @param animationObjectName name of an instance inside a timeline
	* @return GAF Texture
	*/
	getTextureByName(animationObjectName:string):IGAFTexture
	{
		const instanceID:string=this._config.getNamedPartID(animationObjectName);
		if(instanceID!=null)
		{
			const part:CAnimationObject=this._config.animationObjects.getAnimationObject(instanceID);
			if(part!=null)
			{
				return this.textureAtlas.getTexture(part.regionID);
			}
		}
		return null;
	}

	/**
	* Disposes the underlying GAF timeline config
	*/
	dispose():void
	{
		this._config.dispose();
		this._config=null;
		this._gafAsset=null;
		this._gafgfxData=null;
		this._gafSoundData=null;
	}

	/**
	* Load all graphical data connected with this asset in device GPU memory. Used in case of manual control of GPU memory usage.
	* Works only in case when all graphical data stored in RAM.
	*
	* @param content content type that should be loaded. Available types:<code>CONTENT_ALL, CONTENT_DEFAULT, CONTENT_SPECIFY</code>
	* @param scale in case when specified content is<code>CONTENT_SPECIFY</code>scale and csf should be set in required values
	* @param csf in case when specified content is<code>CONTENT_SPECIFY</code>scale and csf should be set in required values
	*/
	loadInVideoMemory(content:string="contentDefault", pScale?:number, csf?:number):void
	{

		if(this._config.textureAtlas==null || this._config.textureAtlas.contentScaleFactor.elements==null)
		{
			return;
		}

		let textures:Map<string,TextureWrapper>;
		let csfConfig:CTextureAtlasCSF;

		switch(content)
		{
			case GAFTimeline.CONTENT_ALL:
				for(const scaleConfig of this._config.allTextureAtlases)
				{
					for(const csfConfig of scaleConfig.allContentScaleFactors)
					{
						this._gafgfxData.createTextures(scaleConfig.scale, csfConfig.csf);

						textures=this._gafgfxData.getTextures(scaleConfig.scale, csfConfig.csf);
						if(csfConfig.atlas==null && textures!=null)
						{
							csfConfig.atlas=CTextureAtlas.createFromTextures(textures, csfConfig);
						}
					}
				}
				return;

			case GAFTimeline.CONTENT_DEFAULT:
				csfConfig=this._config.textureAtlas.contentScaleFactor;

				if(csfConfig==null)
				{
					return;
				}
			
				if(csfConfig.atlas==null && this._gafgfxData.createTextures(this.scale, this.contentScaleFactor))
				{
					csfConfig.atlas = CTextureAtlas.createFromTextures(this._gafgfxData.getTextures(this.scale, this.contentScaleFactor), csfConfig);
				}

				return;

			case GAFTimeline.CONTENT_SPECIFY:
				csfConfig=this.getCSFConfig(pScale, csf);

				if(csfConfig==null)
				{
					return;
				}

				if(csfConfig.atlas==null && this._gafgfxData.createTextures(pScale, csf))
				{
					csfConfig.atlas=CTextureAtlas.createFromTextures(this._gafgfxData.getTextures(pScale, csf), csfConfig);
				}
				return;
		}
	}

	/**
	* Unload all all graphical data connected with this asset from device GPU memory. Used in case of manual control of video memory usage
	*
	* @param content content type that should be loaded(CONTENT_ALL, CONTENT_DEFAULT, CONTENT_SPECIFY)
	* @param scale in case when specified content is CONTENT_SPECIFY scale and csf should be set in required values
	* @param csf in case when specified content is CONTENT_SPECIFY scale and csf should be set in required values
	*/
	unloadFromVideoMemory(content:string="contentDefault", pScale?:number, csf?:number):void
	{
		if(this._config.textureAtlas==null || this._config.textureAtlas.contentScaleFactor.elements==null)
		{
			return;
		}

		let csfConfig:CTextureAtlasCSF;

		switch(content)
		{
			case GAFTimeline.CONTENT_ALL:
				this._gafgfxData.disposeTextures();
				this._config.dispose();
				return;
			case GAFTimeline.CONTENT_DEFAULT:
				this._gafgfxData.disposeTextures(pScale, this.contentScaleFactor);
				this._config.textureAtlas.contentScaleFactor.dispose();
				return;
			case GAFTimeline.CONTENT_SPECIFY:
				csfConfig=this.getCSFConfig(pScale, csf);
				if(csfConfig!=null)
				{
					this._gafgfxData.disposeTextures(pScale, csf);
					csfConfig.dispose();
				}
				return;
		}
	}

	startSound(frame:number):void
	{
		// var frameSoundConfig:CFrameSound=_config.getSound(frame);
		// if(frameSoundConfig)
		// {
			// if(frameSoundConfig.action==CFrameSound.ACTION_STOP)
			// {
				// GAFSoundManager.getInstance().stop(frameSoundConfig.soundID, _config.assetID);
			// }
			// else
			// {
				// var sound:Sound;
				// if(frameSoundConfig.linkage)
				// {
					// sound=gafSoundData.getSoundByLinkage(frameSoundConfig.linkage);
				// }
				// else
				// {
					// sound=gafSoundData.getSound(frameSoundConfig.soundID, _config.assetID);
				// }
				// var soundOptions:Dynamic={};
				// soundOptions["continue"]=frameSoundConfig.action==CFrameSound.ACTION_CONTINUE;
				// soundOptions["repeatCount"]=frameSoundConfig.repeatCount;
				// GAFSoundManager.getInstance().play(sound, frameSoundConfig.soundID, soundOptions, _config.assetID);
			// }
		// }
	}

	// --------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	private getCSFConfig(scale:number, csf:number):CTextureAtlasCSF
	{
		const scaleConfig:CTextureAtlasScale=this._config.getTextureAtlasForScale(scale);

		if(scaleConfig!=null)
		{
			const csfConfig:CTextureAtlasCSF=scaleConfig.getTextureAtlasForCSF(csf);
			
			if(csfConfig!=null)
			{
				return csfConfig;
			}
			else
			{
				return null;
			}
		}
		else
		{
			return null;
		}
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

	/**
	* Timeline identifier(name given at animation's upload or assigned by developer)
	*/
	
	
 	
	get id():string
	{
		return this.config.id;
	}

	/**
	* Timeline linkage in a *.fla file library
	*/
	
	
	
 	get linkage():string
	{
		return this.config.linkage;
	}

	/**
	* Asset identifier(name given at animation's upload or assigned by developer)
	*/
	
 	get assetID():string
	{
		return this.config.assetID;
	}

	
 	get textureAtlas():CTextureAtlas
	{
		
		if(this._config.textureAtlas==null)
		{
			return null;
		}

		if(this._config.textureAtlas.contentScaleFactor.atlas==null)
		{
			this.loadInVideoMemory(GAFTimeline.CONTENT_DEFAULT);
		}
		
		return this._config.textureAtlas.contentScaleFactor.atlas;
	}

	
 	get config():GAFTimelineConfig
	{
		return this._config;
	}

	// //////////////////////////////////////////////////////////////////////////

	/**
	* Texture atlas scale that will be used for<code>GAFMovieClip</code>creation. To create<code>GAFMovieClip's</code>
	* with different scale assign appropriate scale to<code>GAFTimeline</code>and only after that instantiate<code>GAFMovieClip</code>.
	* Possible values are values from converted animation config. They are depends from project settings on site converter
	*/
	
	set scale(value:number)
	{
		const scale:number=this._gafAsset.getValidScale(value);
		if(Number.isNaN(scale))
		{
			throw ErrorConstants.SCALE_NOT_FOUND;
		}
		else
		{
			this._gafAsset.scale=scale;
		}

		if(this._config.textureAtlas==null)
		{
			// return;
			return;
		}

		const csf:number=this.contentScaleFactor;
		const taScale:CTextureAtlasScale=this._config.getTextureAtlasForScale(scale);
		if(taScale!=null)
		{
			this._config.textureAtlas=taScale;

			const taCSF:CTextureAtlasCSF=this._config.textureAtlas.getTextureAtlasForCSF(csf);

			if(taCSF!=null)
			{
				this._config.textureAtlas.contentScaleFactor=taCSF;
			}
			else
			{
				throw new Error("There is no csf " + csf + "in timeline config for scalse " + scale);
			}
		}
		else
		{
			throw new Error("There is no scale " + scale + "in timeline config");
		}
	}

	
	
	
 	get scale():number
	{
		return this._gafAsset.scale;
	}

	/**
	* Texture atlas content scale factor(csf)that will be used for<code>GAFMovieClip</code>creation. To create<code>GAFMovieClip's</code>
	* with different csf assign appropriate csf to<code>GAFTimeline</code>and only after that instantiate<code>GAFMovieClip</code>.
	* Possible values are values from converted animation config. They are depends from project settings on site converter
	*/
	
	set contentScaleFactor(csf:number)
	{
		if(this._gafAsset.hasCSF(csf))
		{
			this._gafAsset.csf=csf;
		}

		if(this._config.textureAtlas==null)
		{
			return;
		}

		const taCSF:CTextureAtlasCSF=this._config.textureAtlas.getTextureAtlasForCSF(csf);

		if(taCSF!=null)
		{
			this._config.textureAtlas.contentScaleFactor=taCSF;
		}
		else
		{
			throw new Error("There is no csf " + csf + "in timeline config");
		}

	}

	
	
	
 	get contentScaleFactor():number
	{
		return this._gafAsset.csf;
	}

	/**
	* Graphical data storage that used by<code>GAFTimeline</code>.
	*/
	
	set gafgfxData(gafgfxData:GAFGFXData)
	{
		this._gafgfxData=gafgfxData;
	}

	

 	
	get gafgfxData():GAFGFXData
	{
		return this._gafgfxData;
	}

	
 	get gafAsset():GAFAsset
	{
		return this._gafAsset;
	}

	set gafAsset(asset:GAFAsset)
	{
		this._gafAsset=asset;
	}

	
 	get gafSoundData():GAFSoundData
	{
		return this._gafSoundData;
	}

	set gafSoundData(gafSoundData:GAFSoundData)
	{
		this._gafSoundData=gafSoundData;
	}

	// --------------------------------------------------------------------------
	//
	//  STATIC METHODS
	//
	// --------------------------------------------------------------------------

}