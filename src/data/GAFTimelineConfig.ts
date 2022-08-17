// import com.github.haxePixiGAF.data.config.CAnimationFrames;
// import com.github.haxePixiGAF.data.config.CAnimationObjects;
// import com.github.haxePixiGAF.data.config.CAnimationSequences;
// import com.github.haxePixiGAF.data.config.CStage;
// import com.github.haxePixiGAF.data.config.CTextFieldObjects;
// import com.github.haxePixiGAF.data.config.CTextureAtlasScale;
// import com.github.haxePixiGAF.utils.MathUtility;
// import pixi.core.math.Point;
// import pixi.core.math.shapes.Rectangle;

import { Point, Rectangle } from "pixi.js";
import { MathUtility } from "../utils/MathUtility";
import CAnimationFrames from "./config/CAnimationFrames";
import CAnimationObjects from "./config/CAnimationObjects";
import CAnimationSequences from "./config/CAnimationSequences";
import CStage from "./config/CStage";
import CTextFieldObjects from "./config/CTextFieldObjects";
import CTextureAtlasScale from "./config/CTextureAtlasScale";
import GAFDebugInformation from "./GAFDebugInformation";

/**
 * TODO
 * @author Mathieu Anthoine
 */
export default class GAFTimelineConfig
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
	private _version:string;
	private _stageConfig:CStage;

	private _id:string;
	private _assetID:string;

	private _allTextureAtlases:Array<CTextureAtlasScale>;
	private _textureAtlas:CTextureAtlasScale;

	private _animationConfigFrames:CAnimationFrames;
	private _animationObjects:CAnimationObjects;
	private _animationSequences:CAnimationSequences;
	private _textFields:CTextFieldObjects;

	private _namedParts:Map<String,String>;
	private _linkage:string;

	private _debugRegions:Array<GAFDebugInformation>;

	private _warnings:Array<String>;
	private _framesCount:number=0;
	private _bounds:Rectangle;
	private _pivot:Point;
	// private _sounds:Dictionary;
	private _disposed:boolean=false;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor(version:string)
	{
		this._version=version;

		this._animationConfigFrames=new CAnimationFrames();
		this._animationObjects=new CAnimationObjects();
		this._animationSequences=new CAnimationSequences();
		this._textFields=new CTextFieldObjects();
		// _sounds=new Dictionary();
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	dispose():void
	{
		for(const cTextureAtlasScale of this._allTextureAtlases)
		{
			cTextureAtlasScale.dispose();
		}
		this._allTextureAtlases=null;

		this._animationConfigFrames=null;
		this._animationSequences=null;
		this._animationObjects=null;
		this._textureAtlas=null;
		this._textFields=null;
		this._namedParts=null;
		this._warnings=null;
		this._bounds=null;
		// _sounds=null;
		this._pivot=null;
		
		this._disposed=true;
	}

	getTextureAtlasForScale(scale:number):CTextureAtlasScale
	{
		for(const cTextureAtlas of this._allTextureAtlases)
		{
			if(MathUtility.equals(cTextureAtlas.scale, scale))
			{
				return cTextureAtlas;
			}
		}

		return null;
	}

	// addSound(data:Dynamic, frame:number):void
	// {
		// _sounds[frame]=new CFrameSound(data);
	// }
//
	// getSound(frame:number):CFrameSound
	// {
		// return _sounds[frame];
	// }

	addWarning(text:string):void
	{
		if(text==null)
		{
			return;
		}

		if(this._warnings==null)
		{
			this._warnings=[];
		}

		if(this._warnings.indexOf(text)==-1)
		{
			console.warn(text);
			this._warnings.push(text);
		}
	}

	getNamedPartID(name:string):string
	{
		for(const id in this._namedParts)
		{
			if(this._namedParts[id]==name)
			{
				return id;
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

 	get textureAtlas():CTextureAtlasScale
	{
		return this._textureAtlas;
	}

	set textureAtlas(textureAtlas:CTextureAtlasScale)
	{
		this._textureAtlas=textureAtlas;
	}

	
 	get animationObjects():CAnimationObjects
	{
		return this._animationObjects;
	}

	set animationObjects(animationObjects:CAnimationObjects)
	{
		this._animationObjects=animationObjects;
	}

	
 	get animationConfigFrames():CAnimationFrames
	{
		return this._animationConfigFrames;
	}

	set animationConfigFrames(animationConfigFrames:CAnimationFrames)
	{
		this._animationConfigFrames=animationConfigFrames;
	}

	
 	get animationSequences():CAnimationSequences
	{
		return this._animationSequences;
	}

	set animationSequences(animationSequences:CAnimationSequences)
	{
		this._animationSequences=animationSequences;
	}

	
 	get textFields():CTextFieldObjects
	{
		return this._textFields;
	}

	set textFields(textFields:CTextFieldObjects)
	{
		this._textFields=textFields;
	}

	
 	get allTextureAtlases():Array<CTextureAtlasScale>
	{
		return this._allTextureAtlases;
	}

	set allTextureAtlases(allTextureAtlases:Array<CTextureAtlasScale>)
	{
		this._allTextureAtlases=allTextureAtlases;
	}

	
 	get version():string
	{
		return this._version;
	}

	
 	get debugRegions():Array<GAFDebugInformation>
	{
		return this._debugRegions;
	}

	set debugRegions(debugRegions:Array<GAFDebugInformation>)
	{
		this._debugRegions=debugRegions;
	}

	
 	get warnings():Array<String>
	{
		return this._warnings;
	}

	
 	get id():string
	{
		return this._id;
	}

	set id(value:string)
	{
		this._id=value;
	}

	
 	get assetID():string
	{
		return this._assetID;
	}

	set assetID(value:string)
	{
		this._assetID=value;
	}

	
 	get namedParts():Map<String,String>
	{
		return this._namedParts;
	}

	set namedParts(value:Map<String,String>)
	{
		this._namedParts=value;
	}

	
 	get linkage():string
	{
		return this._linkage;
	}

	set linkage(value:string)
	{
		this._linkage=value;
	}

	
 	get stageConfig():CStage
	{
		return this._stageConfig;
	}

	set stageConfig(stageConfig:CStage)
	{
		this._stageConfig=stageConfig;
	}

	
 	get framesCount():number
	{
		return this._framesCount;
	}

	set framesCount(value:number)
	{
		this._framesCount=value;
	}

	
 	get bounds():Rectangle
	{
		return this._bounds;
	}

	set bounds(value:Rectangle)
	{
		this._bounds=value;
	}

	
 	get pivot():Point
	{
		return this._pivot;
	}

	set pivot(value:Point)
	{
		this._pivot=value;
	}

	
 	get disposed():boolean{
		return this._disposed;
	}
}