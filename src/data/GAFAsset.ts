// import com.github.haxePixiGAF.data.config.CTextureAtlasCSF;
// import com.github.haxePixiGAF.data.config.CTextureAtlasElement;
// import com.github.haxePixiGAF.data.config.CTextureAtlasScale;
// import com.github.haxePixiGAF.data.textures.TextureWrapper;
// import com.github.haxePixiGAF.display.GAFScale9Texture;
// import com.github.haxePixiGAF.display.GAFTexture;
// import com.github.haxePixiGAF.display.IGAFTexture;
// import com.github.haxePixiGAF.utils.MathUtility;
// import pixi.core.math.Matrix;

import { Matrix } from "pixi.js";
import GAFScale9Texture from "../display/GAFScale9Texture";
import GAFTexture from "../display/GAFTexture";
import IGAFTexture from "../display/IGAFTexture";
import { MathUtility } from "../utils/MathUtility";
import CTextureAtlasCSF from "./config/CTextureAtlasCSF";
import CTextureAtlasElement from "./config/CTextureAtlasElement";
import CTextureAtlasScale from "./config/CTextureAtlasScale";
import GAFAssetConfig from "./GAFAssetConfig";
import GAFTimeline from "./GAFTimeline";
import TextureWrapper from "./textures/TextureWrapper";

/**
 * TODO
 * @author Mathieu Anthoine
 * 
 */
export default class GAFAsset
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

	private _config:GAFAssetConfig;

	private _timelines:Array<GAFTimeline>;
	private _timelinesDictionary:Map<string,GAFTimeline>=new Map<string,GAFTimeline>();
	private _timelinesByLinkage:Map<string,GAFTimeline>=new Map<string,GAFTimeline>();

	private _scale:number;
	private _csf:number;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor(config:GAFAssetConfig)
	{
		this._config=config;

		this._scale=config.defaultScale;
		this._csf=config.defaultContentScaleFactor;

		this._timelines=[];
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	/**
	* Disposes all assets in bundle
	*/
	dispose():void
	{
		if(this._timelines.length>0)
		{
			for(const timeline of this._timelines)
			{
				timeline.dispose();
			}
		}
		this._timelines=null;

		this._config.dispose();
		this._config=null;
	}

	addGAFTimeline(timeline:GAFTimeline):void
	{
		if(this._timelinesDictionary[timeline.id]==null)
		{
			this._timelinesDictionary[timeline.id]=timeline;
			this._timelines.push(timeline);

			if(timeline.config.linkage!=null)
			{
				this._timelinesByLinkage[timeline.linkage]=timeline;
			}
		}
		else
		{
			throw new Error("Bundle error. More then one timeline use id:'" + timeline.id + "'");
		}
	}

	getGAFTimelineByLinkage(linkage:string):GAFTimeline
	{
		const gafTimeline:GAFTimeline=this._timelinesByLinkage[linkage];

		return gafTimeline;
	}

	// --------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	/** 
	* Returns<code>GAFTimeline</code>from gaf asset by ID
	* @param id numberernal timeline id
	* @return<code>GAFTimeline</code>from gaf asset
	*/
	// gaf_private getGAFTimelineByID(id:string):GAFTimeline
	getGAFTimelineByID(id:string):GAFTimeline
	{
		return this._timelinesDictionary[id];
	}

	/** 
	* Returns<code>GAFTimeline</code>from gaf asset bundle by linkage
	* @param linkage linkage in a *.fla file library
	* @return<code>GAFTimeline</code>from gaf asset
	*/
	// /*gaf_private*/ function gaf_private_getGAFTimelineByLinkage(linkage:string):GAFTimeline
	// {
		// return _timelinesByLinkage[linkage];
	// }

	getCustomRegion(linkage:string, scale?:number, csf?:number):IGAFTexture
	{
		if(scale==null)scale=this._scale;
		if(csf==null) csf=this._csf;

		let gafTexture:IGAFTexture=null;
		let atlasScale:CTextureAtlasScale;
		let atlasCSF:CTextureAtlasCSF;
		let element:CTextureAtlasElement;
		
		const tasl:number = this._config.allTextureAtlases.length;
		
		for(let i = 0; i < tasl; i++)
		{
			atlasScale=this._config.allTextureAtlases[i];
			if(atlasScale.scale==scale)
			{
				const tacsfl:number = atlasScale.allContentScaleFactors.length;
				for(let j = 0; j < tacsfl; j++)
				{
					atlasCSF=atlasScale.allContentScaleFactors[j];
					if(atlasCSF.csf==csf)
					{
						element=atlasCSF.elements.getElementByLinkage(linkage);

						if(element!=null)
						{
							const texture:TextureWrapper=atlasCSF.atlas.getTextureByIDAndAtlasID(element.id, element.atlasID);
							const pivotMatrix:Matrix = element.pivotMatrix;
							if(element.scale9Grid !=null)
							{
								gafTexture=new GAFScale9Texture(this.id, texture, pivotMatrix, element.scale9Grid);
							}
							else
							{
								gafTexture=new GAFTexture(this.id, texture, pivotMatrix);
							}
						}

						break;
					}
				}
				break;
			}
		}

		return gafTexture;
	}

	getValidScale(value:number):number
	{
		const index:number=MathUtility.getItemIndex(this._config.scaleValues, value);
		if(index !=-1)
		{
			return this._config.scaleValues[index];
		}
		return Number.NaN;
	}

	hasCSF(value:number):boolean
	{
		return MathUtility.getItemIndex(this._config.csfValues, value)>=0;
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

 	get timelines():Array<GAFTimeline>
	{
		return this._timelines;
	}

 	get id():string
	{
		return this._config.id;
	}

 	get scale():number
	{
		return this._scale;
	}

	set scale(value:number)
	{
		this._scale=value;
	}

 	get csf():number
	{
		return this._csf;
	}

	set csf(value:number)
	{
		this._csf=value;
	}
}