/**
 * TODO
 * @author Mathieu Anthoine
 */

import { Loader, utils } from "pixi.js";
import CSound from "../data/config/CSound";
import GAFAsset from "../data/GAFAsset";
import GAFAssetConfig from "../data/GAFAssetConfig";
import GAFBundle from "../data/GAFBundle";
import GAFGFXData from "../data/GAFGFXData";
import GAFTimeline from "../data/GAFTimeline";
import GAFTimelineConfig from "../data/GAFTimelineConfig";
import TAGFXBase from "../data/tagfx/TAGFXBase";
import TAGFXsourcePixi from "../data/tagfx/TAGFXsourcePixi";
import { GAFEvent } from "../events/GAFEvent";
import GAFSoundData from "../sound/GAFSoundData";
import GAFBytesInput from "../utils/GAFBytesInput";
import { MathUtility } from "../utils/MathUtility";
import GAFLoader from "./GAFLoader";



export default class ZipToGAFAssetConverter extends utils.EventEmitter
{
	
	//--------------------------------------------------------------------------
	//
	//  PUBLIC VARIABLES
	//
	//--------------------------------------------------------------------------

	/**
	* In process of conversion doesn't create textures (doesn't load in GPU memory).
	* Be sure to set up <code>Starling.handleLostContext = true</code> when using this action, otherwise Error will occur
	*/
	public static ACTION_DONT_LOAD_IN_GPU_MEMORY: string = "actionDontLoadInGPUMemory";

	/**
	* In process of conversion create textures (load in GPU memory).
	*/
	public static ACTION_LOAD_ALL_IN_GPU_MEMORY: string = "actionLoadAllInGPUMemory";

	/**
	* In process of conversion create textures (load in GPU memory) only atlases for default scale and csf
	*/
	public static ACTION_LOAD_IN_GPU_MEMORY_ONLY_DEFAULT: string = "actionLoadInGPUMemoryOnlyDefault";
	
	/**
	* Action that should be applied to atlases in process of conversion. Possible values are action constants.
	* By default loads in GPU memory only atlases for default scale and csf
	*/
	public static actionWithAtlases: string = ZipToGAFAssetConverter.ACTION_LOAD_IN_GPU_MEMORY_ONLY_DEFAULT;
	
	
	//--------------------------------------------------------------------------
	//
	//  PRIVATE VARIABLES
	//
	//--------------------------------------------------------------------------	
	private _id:string;

	//private _zip:FZip;
	//private _zipLoader:FZipLibrary;

	private _currentConfigIndex:number=0;
	private _configConvertTimeout:number;

	private _gafAssetsIDs:Array<string>;
	private _gafAssetConfigs:Map<string,GAFAssetConfig>;
	private _gafAssetConfigSources:Map<string,GAFBytesInput>;

	private _sounds:Array<CSound>;
	//private _taGFXs:Map<string,TAGFXSourcePNGBA>;
	private _taGFXs:Map<string,TAGFXBase>;

	private _gfxData:GAFGFXData;
	private _soundData:GAFSoundData;

	private _gafBundle:GAFBundle;

	private _defaultScale:number;
	private _defaultContentScaleFactor:number;

	private _parseConfigAsync:boolean=false;
	private _ignoreSounds:boolean=false;

	///////////////////////////////////

	private _gafAssetsConfigURLs:Array<any>;
	private _gafAssetsConfigIndex:number=0;

	private _atlasSourceURLs:Array<any>;
	//private _atlasSourceIndex:number;
	
	//////////////////////////////////
	
	private _loader:Loader;
	
	//--------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	//--------------------------------------------------------------------------
		
	/** Creates a new<code>ZipToGAFAssetConverter</code>instance.
	* @param id The id of the converter.
	* If it is not empty<code>ZipToGAFAssetConverter</code>sets the<code>name</code>of produced bundle equal to this id.
	*/
	constructor(id:string=null)
	{
		super();
		this._id=id;
	}

	//--------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	//--------------------------------------------------------------------------
	
	/**
	* Converts GAF file(*.zip)into<code>GAFTimeline</code>or<code>GAFBundle</code>depending on file content.
	* Because conversion process is asynchronous use<code>Event.COMPLETE</code>listener to trigger successful conversion.
	* Use<code>ErrorEvent.ERROR</code>listener to trigger any conversion fail.
	*
	* @param data *.zip file binary or File object represents a path to a *.gaf file or directory with *.gaf config files
	* @param defaultScale Scale value for<code>GAFTimeline</code>that will be set by default
	* @param defaultContentScaleFactor Content scale factor(csf)value for<code>GAFTimeline</code>that will be set by default
	*/
	convert(data:any, defaultScale?:number, defaultContentScaleFactor?:number):void
	{
		/*
		if(ZipToGAFAssetConverter.actionWithAtlases==ZipToGAFAssetConverter.ACTION_DONT_LOAD_IN_GPU_MEMORY)
		{
			throw new any("Impossible parameters combination! Starling.handleLostContext=false and actionWithAtlases=ACTION_DONT_LOAD_ALL_IN_VIDEO_MEMORY One of the parameters must be changed!");
		}
		*/

		this.reset();
	
		if (defaultScale!=null) this._defaultScale=defaultScale;
		if (this._defaultContentScaleFactor!=null) this._defaultContentScaleFactor=defaultContentScaleFactor;

		if(this._id!=null && this._id.length>0)
		{
			this._gafBundle.name=this._id;
		}
		
		//TODO if (Std.is(data, ZipFile)) ; else
		if (typeof data === "string") this.loadUrls([data]);
		else if (data instanceof Array) this.loadUrls(data);
		else if(data instanceof GAFLoader) this.parseLoader(data);
		else
		{
			console.warn("ERROR");
			//zipProcessError(ErrorConstants.UNKNOWN_FORMAT, 6);
		}
		
	}
	
	//--------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	//--------------------------------------------------------------------------

	private reset():void
	{
		//_zip=null;
		//_zipLoader=null;
		this._currentConfigIndex=0;
		this._configConvertTimeout=0;

		this._sounds=new Array<CSound>();
		this._taGFXs=new Map<string,TAGFXBase>();

		this._gfxData=new GAFGFXData();
		//_soundData=new GAFSoundData();
		this._gafBundle=new GAFBundle();
		this._gafBundle.soundData=this._soundData;

		this._gafAssetsIDs=[];
		this._gafAssetConfigs=new Map<string,GAFAssetConfig>();
		this._gafAssetConfigSources=new Map<string,GAFBytesInput>();

		this._gafAssetsConfigURLs=[];
		this._gafAssetsConfigIndex=0;

		this._atlasSourceURLs=[];
		//_atlasSourceIndex=0;
	}	
	
	private findAllAtlasURLs():void
	{
		
		this._atlasSourceURLs=[];

		var url:string;
		var gafTimelineConfigs:Array<GAFTimelineConfig>;

		for(const id of this._gafAssetConfigs.keys())
		{
			gafTimelineConfigs=this._gafAssetConfigs[id].timelines;

			for(const config of gafTimelineConfigs)
			{
				var folderURL:string = ZipToGAFAssetConverter.getFolderURL(id);

				for(const scale of config.allTextureAtlases)
				{
					if(Number.isNaN(this._defaultScale)|| MathUtility.equals(scale.scale, this._defaultScale))
					{
						for(const csf of scale.allContentScaleFactors)
						{
							if(Number.isNaN(this._defaultContentScaleFactor)|| MathUtility.equals(csf.csf, this._defaultContentScaleFactor))
							{
								for(const source of csf.sources)
								{
									url=folderURL + source.source;

									if(source.source !="no_atlas"
											&& this._atlasSourceURLs.indexOf(url)==-1)
									{
										this._atlasSourceURLs.push(url);
									}
								}
							}
						}
					}
				}
			}
		}

		if(this._atlasSourceURLs.length>0)
		{
			this._loader = new Loader();
			this._loader.on(GAFEvent.COMPLETE, this.createGAFTimelines);
			
			var url:string;
			var fileName:string;
			//var taGFX:TAGFXBase;
			
			for (const _atlasSourceIndex in this._atlasSourceURLs) {
				url=this._atlasSourceURLs[_atlasSourceIndex];
				fileName = url.substring(url.lastIndexOf("/") + 1);
				// TODO: verifier s'il ne faut pas plutot le faire à la fin
				//taGFX = new TAGFXsourcePixi(url);
				this._taGFXs[fileName] = new TAGFXsourcePixi(url);//; taGFX;
				this._loader.add(url);
				
			}
			this._loader.load();
		}
		//else
		//{
			//createGAFTimelines();
		//}
	}
	
	private static getFolderURL(url:string):string
	{
		var cutURL:string=url.split("?")[0];

		var lastIndex:number=cutURL.lastIndexOf("/");
		
		return cutURL.substring(0, lastIndex + 1);
	}
	
	private loadUrls(pData:Array<string>):void {
		var lLoader:GAFLoader = new GAFLoader();
		for (const i in pData) lLoader.addGAFFile(pData[i]);
		lLoader.once("complete", this.onLoadUrls);
		lLoader.load();
	}
	
	private onLoadUrls (pLoader:GAFLoader):void {
		this.parseLoader(pLoader);
	}
	
	private parseLoader(pData:GAFLoader):void
	{
		var length:number = pData.contents.length;
		
		let fileName:string;
		//var taGFX:TAGFXBase;

		//_taGFXs=new Map<TAGFXSourcePNGBA>();

		this._gafAssetConfigSources=new Map<string,GAFBytesInput>();
		this._gafAssetsIDs=[];

		for(let i = 0; i < length; i++)
		{
			fileName=pData.names[i];
			this._gafAssetsIDs.push(fileName);
			this._gafAssetConfigSources[fileName]=pData.contents[i];
		}

		this.convertConfig();
	}

	private convertConfig():void
	{
		//clearTimeout(_configConvertTimeout);
		//_configConvertTimeout=null;

		var configID:string = this._gafAssetsIDs[this._currentConfigIndex];		
		var configSource:GAFBytesInput=this._gafAssetConfigSources[configID];
		var gafAssetID:string=this.getAssetId(this._gafAssetsIDs[this._currentConfigIndex]);
		
		if(configSource instanceof GAFBytesInput)
		{
			var converter:BinGAFAssetConfigConverter=new BinGAFAssetConfigConverter(gafAssetID, configSource);
			converter.defaultScale=this._defaultScale;
			converter.defaultCSF=this._defaultContentScaleFactor;
			converter.ignoreSounds = this._ignoreSounds;
			converter.on(GAFEvent.COMPLETE, this.onConverted);
			converter.on(GAFEvent.ERROR, this.onConvertError);
			converter.convert(this._parseConfigAsync);
		}
		else
		{
			throw "Error";
		}
	}
	
	private createGAFTimelines(event:any=null):void
	{
		if (event != null) {
			this._loader.off(GAFEvent.COMPLETE, this.createGAFTimelines);
		}

		var gafTimelineConfigs:Array<GAFTimelineConfig>;
		var gafAssetConfigID:string;
		var gafAssetConfig:GAFAssetConfig=null;
		var gafAsset:GAFAsset=null;
		var i:number=0;

		//for(taGFX in _taGFXs)
		//{
			//taGFX.clearSourceAfterTextureCreated=false;
		//}
		
		for(i in 0..._gafAssetsIDs.length)
		{
			gafAssetConfigID = this._gafAssetsIDs[i];
			
			gafAssetConfig=this._gafAssetConfigs[gafAssetConfigID];
			gafTimelineConfigs=gafAssetConfig.timelines;

			gafAsset=new GAFAsset(gafAssetConfig);
			for(config in gafTimelineConfigs)
			{	
				gafAsset.addGAFTimeline(this.createTimeline(config, gafAsset));
			}
			
			this._gafBundle.addGAFAsset(gafAsset);
		}

		if(gafAsset==null || gafAsset.timelines.length==0)
		{
			//zipProcessError(ErrorConstants.TIMELINES_NOT_FOUND);
			return;
		}

		if(this._gafAssetsIDs.length==1)
		{
			if (this._gafBundle.name==null) this._gafBundle.name =gafAssetConfig.id;
		}

		//if(_soundData.hasSoundsToLoad && !_ignoreSounds)
		//{
			//_soundData.loadSounds(finalizeParsing, onSoundLoadIOError);
		//}
		//else
		//{
			this.finalizeParsing();
		//}
	}
	
	private finalizeParsing():void
	{
		this._taGFXs=null;
		this._sounds=null;

		this.emit(GAFEvent.COMPLETE,{target:this});
		
		return;
		
		//TODO: a supprimer si ca marche
		
		//if(_zip && !ZipToGAFAssetConverter.keepZipInRAM)
		//{
			//var file:FZipFile;
			//var count:number=_zip.getFileCount();
			//for(i in 0...count)
			//{
				//file=_zip.getFileAt(i);
				//if(file.filename.toLowerCase().indexOf(".atf")==-1
						//&& file.filename.toLowerCase().indexOf(".png")==-1)
				//{
					//file.content.clear();
				//}
			//}
			//_zip.close();
			//_zip=null;
		//}

		if(this._gfxData.isTexturesReady)
		{
			//TODO: isTextureready utile ?
			this.emit(GAFEvent.COMPLETE,{target: this});
		}
		else
		{
			this._gfxData.on(GAFGFXData.EVENT_TYPE_TEXTURES_READY, this.onTexturesReady);
		}
	}
	
	private createTimeline(config:GAFTimelineConfig, asset:GAFAsset):GAFTimeline
	{
		for(cScale in config.allTextureAtlases)
		{
			
			if(this._defaultScale==null || MathUtility.equals(this._defaultScale, cScale.scale))
			{
				for(cCSF in cScale.allContentScaleFactors)
				{
					
					if(this._defaultContentScaleFactor==null || MathUtility.equals(this._defaultContentScaleFactor, cCSF.csf))
					{
						for(taSource in cCSF.sources)
						{
							if(taSource.source=="no_atlas")
							{
								continue;
							}
							
							if(this._taGFXs[taSource.source]!=null)
							{
								var taGFX:TAGFXBase=this._taGFXs[taSource.source];
								taGFX.textureScale = cCSF.csf;							
								this._gfxData.addTAGFX(cScale.scale, cCSF.csf, taSource.id, taGFX);
							}
							else
							{
								//zipProcessError(ErrorConstants.ATLAS_NOT_FOUND + taSource.source + "' in zip", 3);
							}
						}
					}
				}
			}
		}

		var timeline:GAFTimeline=new GAFTimeline(config);
		
		timeline.gafgfxData=this._gfxData;
		timeline.gafSoundData=this._soundData;
		timeline.gafAsset=asset;
		
		switch(ZipToGAFAssetConverter.actionWithAtlases)
		{
			case ZipToGAFAssetConverter.ACTION_LOAD_ALL_IN_GPU_MEMORY:
				timeline.loadInVideoMemory(GAFTimeline.CONTENT_ALL);
			case ZipToGAFAssetConverter.ACTION_LOAD_IN_GPU_MEMORY_ONLY_DEFAULT:
				timeline.loadInVideoMemory(GAFTimeline.CONTENT_DEFAULT);
		}

		return timeline;
	}
	
	private getAssetId(configName:string):string
	{
		var startIndex:number=configName.lastIndexOf("/");

		if(startIndex<0)
		{
			startIndex=0;
		}
		else
		{
			startIndex++;
		}

		var endIndex:number=configName.lastIndexOf(".");

		if(endIndex<0)
		{
			endIndex=0x7fffffff;
		}

		return configName.substring(startIndex, endIndex);
	}
	
	//--------------------------------------------------------------------------
	//
	// OVERRIDDEN METHODS
	//
	//--------------------------------------------------------------------------	
	
	//--------------------------------------------------------------------------
	//
	//  EVENT HANDLERS
	//
	//--------------------------------------------------------------------------

	private onConvertError(event:any):void
	{
		throw "ZipToGAFAssetConverter: " + event.type;
		
		if(hasEventListener(GAFEvent.ERROR))
		{
			this.emit(event);
		}
		else
		{
			throw event.text;
		}
	}

	private onConverted(event:any):void
	{

		var configID:string=this._gafAssetsIDs[this._currentConfigIndex];
		var folderURL:string=this.getFolderURL(configID);
		
		var converter:BinGAFAssetConfigConverter=cast(event.target,BinGAFAssetConfigConverter);
		
		converter.off(GAFEvent.COMPLETE, this.onConverted);
		converter.off(GAFEvent.ERROR, this.onConvertError);

		this._gafAssetConfigs[configID]=converter.config;
		
		var sounds:Array<CSound>=converter.config.sounds;
		if(sounds!=null && !this._ignoreSounds)
		{
			for(i in 0...sounds.length)
			{
				sounds[i].source=folderURL + sounds[i].source;
				//_soundData.addSound(sounds[i], converter.config.id, _sounds[Std.parsenumber(sounds[i].source)]);
			}
		}

		this._currentConfigIndex++;
		
		if(this._currentConfigIndex>=this._gafAssetsIDs.length)
		{
			
			this.findAllAtlasURLs();
			
			return;
			
			// TODO ? Version AS3
			//if(_gafAssetsConfigURLs!=null && _gafAssetsConfigURLs.length>0)
			//{
				//findAllAtlasURLs();
			//}
			//else
			//{
				//createGAFTimelines();
			//}
		}
		else
		{
			this.convertConfig();
			// TODO ? Version AS3
			//_configConvertTimeout=setTimeout(convertConfig, 40);
		}
	}
	
	private onTexturesReady(event:any):void
	{
		this._gfxData.off(GAFGFXData.EVENT_TYPE_TEXTURES_READY, this.onTexturesReady);

		//TODO: onTextureReady utilisé ?
		this.emit(GAFEvent.COMPLETE,{target:this});
	}
	
	//--------------------------------------------------------------------------
	//
	//  GETTERS AND SETTERS
	//
	//--------------------------------------------------------------------------	
	
	/**
	* Return converted<code>GAFBundle</code>. If GAF asset file created as single animation - returns null.
	*/
	public var gafBundle(get_gafBundle, null):GAFBundle;
 	
	@:keep
	get gafBundle():GAFBundle
	{
		return this._gafBundle;
	}
	
	static function __init__():void {
        #if js
        untyped Object.defineProperty(ZipToGAFAssetConverter.prototype, "gafBundle", { get: ZipToGAFAssetConverter.prototype.get_gafBundle });
        #end
    }
	
	
}