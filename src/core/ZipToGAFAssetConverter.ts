package com.github.haxePixiGAF.core;
import com.github.haxePixiGAF.data.GAFAsset;
import com.github.haxePixiGAF.data.GAFAssetConfig;
import com.github.haxePixiGAF.data.GAFBundle;
import com.github.haxePixiGAF.data.GAFGFXData;
import com.github.haxePixiGAF.data.GAFTimeline;
import com.github.haxePixiGAF.data.GAFTimelineConfig;
import com.github.haxePixiGAF.data.config.CSound;
import com.github.haxePixiGAF.data.converters.BinGAFAssetConfigConverter;
import com.github.haxePixiGAF.data.tagfx.TAGFXBase;
import com.github.haxePixiGAF.data.tagfx.TAGFXsourcePixi;
import com.github.haxePixiGAF.events.GAFEvent;
import com.github.haxePixiGAF.sound.GAFSoundData;
import com.github.haxePixiGAF.utils.GAFBytesInput;
import com.github.haxePixiGAF.utils.MathUtility;
import js.Lib;
import pixi.interaction.EventEmitter;
import pixi.loaders.Loader;

using com.github.haxePixiGAF.utils.EventEmitterUtility;

/**
 * TODO
 * @author Mathieu Anthoine
 */

typedef Array_String = Array<String>; 

@:expose("GAF.ZipToGAFAssetConverter")
class ZipToGAFAssetConverter extends EventEmitter
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
	public static ACTION_DONT_LOAD_IN_GPU_MEMORY: String = "actionDontLoadInGPUMemory";

	/**
	* In process of conversion create textures (load in GPU memory).
	*/
	public static ACTION_LOAD_ALL_IN_GPU_MEMORY: String = "actionLoadAllInGPUMemory";

	/**
	* In process of conversion create textures (load in GPU memory) only atlases for default scale and csf
	*/
	public static ACTION_LOAD_IN_GPU_MEMORY_ONLY_DEFAULT: String = "actionLoadInGPUMemoryOnlyDefault";
	
	/**
	* Action that should be applied to atlases in process of conversion. Possible values are action constants.
	* By default loads in GPU memory only atlases for default scale and csf
	*/
	public static actionWithAtlases: String = ACTION_LOAD_IN_GPU_MEMORY_ONLY_DEFAULT;
	
	
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

	private _gafAssetsIDs:Array<String>;
	private _gafAssetConfigs:Map<String,GAFAssetConfig>;
	private _gafAssetConfigSources:Map<String,GAFBytesInput>;

	private _sounds:Array<CSound>;
	//private _taGFXs:Map<String,TAGFXSourcePNGBA>;
	private _taGFXs:Map<String,TAGFXBase>;

	private _gfxData:GAFGFXData;
	private _soundData:GAFSoundData;

	private _gafBundle:GAFBundle;

	private _defaultScale:number;
	private _defaultContentScaleFactor:number;

	private _parseConfigAsync:boolean=false;
	private _ignoreSounds:boolean=false;

	///////////////////////////////////

	private _gafAssetsConfigURLs:Array<Dynamic>;
	private _gafAssetsConfigIndex:number=0;

	private _atlasSourceURLs:Array<Dynamic>;
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
		_id=id;
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
	convert(data:Dynamic, ?defaultScale:number, ?defaultContentScaleFactor:number):void
	{
		/*
		if(ZipToGAFAssetConverter.actionWithAtlases==ZipToGAFAssetConverter.ACTION_DONT_LOAD_IN_GPU_MEMORY)
		{
			throw new Dynamic("Impossible parameters combination! Starling.handleLostContext=false and actionWithAtlases=ACTION_DONT_LOAD_ALL_IN_VIDEO_MEMORY One of the parameters must be changed!");
		}
		*/

		reset();
	
		if (defaultScale!=null) _defaultScale=defaultScale;
		if (_defaultContentScaleFactor!=null) _defaultContentScaleFactor=defaultContentScaleFactor;

		if(_id!=null && _id.length>0)
		{
			_gafBundle.name=_id;
		}
		
		//TODO if (Std.is(data, ZipFile)) ; else
		if (Std.is(data, String)) loadUrls([data]);
		else if (Std.is(data, Array_String)) loadUrls(data);
		else if(Std.is(data, GAFLoader)) parseLoader(data);
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
		_currentConfigIndex=0;
		_configConvertTimeout=0;

		_sounds=new Array<CSound>();
		_taGFXs=new Map<String,TAGFXBase>();

		_gfxData=new GAFGFXData();
		//_soundData=new GAFSoundData();
		_gafBundle=new GAFBundle();
		_gafBundle.soundData=_soundData;

		_gafAssetsIDs=[];
		_gafAssetConfigs=new Map<String,GAFAssetConfig>();
		_gafAssetConfigSources=new Map<String,GAFBytesInput>();

		_gafAssetsConfigURLs=[];
		_gafAssetsConfigIndex=0;

		_atlasSourceURLs=[];
		//_atlasSourceIndex=0;
	}	
	
	private findAllAtlasURLs():void
	{
		
		_atlasSourceURLs=[];

		var url:string;
		var gafTimelineConfigs:Array<GAFTimelineConfig>;

		for(id in _gafAssetConfigs.keys())
		{
			gafTimelineConfigs=_gafAssetConfigs[id].timelines;

			for(config in gafTimelineConfigs)
			{
				var folderURL:string=getFolderURL(id);

				for(scale in config.allTextureAtlases)
				{
					if(Math.Number.isNaN(_defaultScale)|| MathUtility.equals(scale.scale, _defaultScale))
					{
						for(csf in scale.allContentScaleFactors)
						{
							if(Math.Number.isNaN(_defaultContentScaleFactor)|| MathUtility.equals(csf.csf, _defaultContentScaleFactor))
							{
								for(source in csf.sources)
								{
									url=folderURL + source.source;

									if(source.source !="no_atlas"
											&& _atlasSourceURLs.indexOf(url)==-1)
									{
										_atlasSourceURLs.push(url);
									}
								}
							}
						}
					}
				}
			}
		}

		if(_atlasSourceURLs.length>0)
		{
			_loader = new Loader();
			_loader.on(GAFEvent.COMPLETE, createGAFTimelines);
			
			var url:string;
			var fileName:string;
			//var taGFX:TAGFXBase;
			
			for (_atlasSourceIndex in 0..._atlasSourceURLs.length) {
				url=_atlasSourceURLs[_atlasSourceIndex];
				fileName = url.substring(url.lastIndexOf("/") + 1);
				// TODO: verifier s'il ne faut pas plutot le faire à la fin
				//taGFX = new TAGFXsourcePixi(url);
				_taGFXs[fileName] = new TAGFXsourcePixi(url);//; taGFX;
				_loader.add(url);
				
			}
			_loader.load();
		}
		//else
		//{
			//createGAFTimelines();
		//}
	}
	
	private static function getFolderURL(url:string):string
	{
		var cutURL:string=url.split("?")[0];

		var lastIndex:number=cutURL.lastIndexOf("/");
		
		return cutURL.substring(0, lastIndex + 1);
	}
	
	private loadUrls(pData:Array<String>):void {
		var lLoader:GAFLoader = new GAFLoader();
		for (i in 0...pData.length) lLoader.addGAFFile(pData[i]);
		lLoader.once("complete", onLoadUrls);
		lLoader.load();
	}
	
	private onLoadUrls (pLoader:GAFLoader):void {
		parseLoader(pLoader);
	}
	
	private parseLoader(pData:GAFLoader):void
	{
		var length:number = pData.contents.length;
		
		var fileName:string;
		//var taGFX:TAGFXBase;

		//_taGFXs=new Map<TAGFXSourcePNGBA>();

		_gafAssetConfigSources=new Map<String,GAFBytesInput>();
		_gafAssetsIDs=[];

		for(i in 0...length)
		{
			fileName=pData.names[i];
			_gafAssetsIDs.push(fileName);
			_gafAssetConfigSources[fileName]=pData.contents[i];
		}

		convertConfig();
	}

	private convertConfig():void
	{
		//clearTimeout(_configConvertTimeout);
		//_configConvertTimeout=null;

		var configID:string = _gafAssetsIDs[_currentConfigIndex];		
		var configSource:GAFBytesInput=_gafAssetConfigSources[configID];
		var gafAssetID:string=getAssetId(_gafAssetsIDs[_currentConfigIndex]);
		
		if(Std.is(configSource, GAFBytesInput))
		{
			var converter:BinGAFAssetConfigConverter=new BinGAFAssetConfigConverter(gafAssetID, cast(configSource,GAFBytesInput));
			converter.defaultScale=_defaultScale;
			converter.defaultCSF=_defaultContentScaleFactor;
			converter.ignoreSounds = _ignoreSounds;
			converter.on(GAFEvent.COMPLETE, onConverted);
			converter.on(GAFEvent.ERROR, onConvertError);
			converter.convert(_parseConfigAsync);
		}
		else
		{
			throw "Error";
		}
	}
	
	private createGAFTimelines(event:Dynamic=null):void
	{
		if (event != null) {
			_loader.off(GAFEvent.COMPLETE, createGAFTimelines);
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
			gafAssetConfigID = _gafAssetsIDs[i];
			
			gafAssetConfig=_gafAssetConfigs[gafAssetConfigID];
			gafTimelineConfigs=gafAssetConfig.timelines;

			gafAsset=new GAFAsset(gafAssetConfig);
			for(config in gafTimelineConfigs)
			{	
				gafAsset.addGAFTimeline(createTimeline(config, gafAsset));
			}
			
			_gafBundle.addGAFAsset(gafAsset);
		}

		if(gafAsset==null || gafAsset.timelines.length==0)
		{
			//zipProcessError(ErrorConstants.TIMELINES_NOT_FOUND);
			return;
		}

		if(_gafAssetsIDs.length==1)
		{
			if (_gafBundle.name==null) _gafBundle.name =gafAssetConfig.id;
		}

		//if(_soundData.hasSoundsToLoad && !_ignoreSounds)
		//{
			//_soundData.loadSounds(finalizeParsing, onSoundLoadIOError);
		//}
		//else
		//{
			finalizeParsing();
		//}
	}
	
	private finalizeParsing():void
	{
		_taGFXs=null;
		_sounds=null;

		emit(GAFEvent.COMPLETE,{target:this});
		
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

		if(_gfxData.isTexturesReady)
		{
			//TODO: isTextureready utile ?
			emit(GAFEvent.COMPLETE,{target: this});
		}
		else
		{
			_gfxData.on(GAFGFXData.EVENT_TYPE_TEXTURES_READY, onTexturesReady);
		}
	}
	
	private createTimeline(config:GAFTimelineConfig, asset:GAFAsset):GAFTimeline
	{
		for(cScale in config.allTextureAtlases)
		{
			
			if(_defaultScale==null || MathUtility.equals(_defaultScale, cScale.scale))
			{
				for(cCSF in cScale.allContentScaleFactors)
				{
					
					if(_defaultContentScaleFactor==null || MathUtility.equals(_defaultContentScaleFactor, cCSF.csf))
					{
						for(taSource in cCSF.sources)
						{
							if(taSource.source=="no_atlas")
							{
								continue;
							}
							
							if(_taGFXs[taSource.source]!=null)
							{
								var taGFX:TAGFXBase=_taGFXs[taSource.source];
								taGFX.textureScale = cCSF.csf;							
								_gfxData.addTAGFX(cScale.scale, cCSF.csf, taSource.id, taGFX);
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
		
		timeline.gafgfxData=_gfxData;
		timeline.gafSoundData=_soundData;
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

	private onConvertError(event:Dynamic):void
	{
		throw "ZipToGAFAssetConverter: " + event.type;
		
		if(hasEventListener(GAFEvent.ERROR))
		{
			emit(event);
		}
		else
		{
			throw event.text;
		}
	}

	private onConverted(event:Dynamic):void
	{

		var configID:string=_gafAssetsIDs[_currentConfigIndex];
		var folderURL:string=getFolderURL(configID);
		
		var converter:BinGAFAssetConfigConverter=cast(event.target,BinGAFAssetConfigConverter);
		
		converter.off(GAFEvent.COMPLETE, onConverted);
		converter.off(GAFEvent.ERROR, onConvertError);

		_gafAssetConfigs[configID]=converter.config;
		
		var sounds:Array<CSound>=converter.config.sounds;
		if(sounds!=null && !_ignoreSounds)
		{
			for(i in 0...sounds.length)
			{
				sounds[i].source=folderURL + sounds[i].source;
				//_soundData.addSound(sounds[i], converter.config.id, _sounds[Std.parsenumber(sounds[i].source)]);
			}
		}

		_currentConfigIndex++;
		
		if(_currentConfigIndex>=_gafAssetsIDs.length)
		{
			
			findAllAtlasURLs();
			
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
			convertConfig();
			// TODO ? Version AS3
			//_configConvertTimeout=setTimeout(convertConfig, 40);
		}
	}
	
	private onTexturesReady(event:Dynamic):void
	{
		_gfxData.off(GAFGFXData.EVENT_TYPE_TEXTURES_READY, onTexturesReady);

		//TODO: onTextureReady utilisé ?
		emit(GAFEvent.COMPLETE,{target:this});
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
		return _gafBundle;
	}
	
	static function __init__():void {
        #if js
        untyped Object.defineProperty(ZipToGAFAssetConverter.prototype, "gafBundle", { get: ZipToGAFAssetConverter.prototype.get_gafBundle });
        #end
    }
	
	
}