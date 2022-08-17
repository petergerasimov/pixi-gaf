import CSound from "./config/CSound";
import CStage from "./config/CStage";
import CTextureAtlasScale from "./config/CTextureAtlasScale";
import GAFTimelineConfig from "./GAFTimelineConfig";

/**
 * AS3 conversion
 * @author Mathieu Anthoine
 */
export default class GAFAssetConfig
{
	public static MAX_VERSION:number=5;

	private _id:string;
	private _compression:number=0;
	private _versionMajor:number=0;
	private _versionMinor:number=0;
	private _fileLength:number=0;
	private _scaleValues:Array<number>;
	private _csfValues:Array<number>;
	private _defaultScale:number;
	private _defaultContentScaleFactor:number;

	private _stageConfig:CStage;

	private _timelines:Array<GAFTimelineConfig>;
	private _allTextureAtlases:Array<CTextureAtlasScale>;
	private _sounds:Array<CSound>;

	constructor(id:string)
	{
		this._id=id;
		this._scaleValues=[];
		this._csfValues=[];

		this._timelines=[];
		this._allTextureAtlases=[];
	}

	addSound(soundData:CSound):void
	{
		if (this._sounds==null) this._sounds = [];
		this._sounds.push(soundData);
	}

	dispose():void
	{
		this._allTextureAtlases=null;
		this._stageConfig=null;
		this._scaleValues=null;
		this._csfValues=null;
		this._timelines=null;
		this._sounds=null;
	}

 	get compression():number
	{
		return this._compression;
	}

	set compression(value:number)
	{
		this._compression=value;
	}

 	get versionMajor():number
	{
		return this._versionMajor;
	}

	set versionMajor(value:number)
	{
		this._versionMajor=value;
	}

 	get versionMinor():number
	{
		return this._versionMinor;
	}

	set versionMinor(value:number)
	{
		this._versionMinor=value;
	}


 	get fileLength():number
	{
		return this._fileLength;
	}

	set fileLength(value:number)
	{
		this._fileLength=value;
	}

 	get scaleValues():Array<number>
	{
		return this._scaleValues;
	}

 	get csfValues():Array<number>
	{
		return this._csfValues;
	}

 	get defaultScale():number
	{
		return this._defaultScale;
	}

	set defaultScale(value:number)
	{
		this._defaultScale=value;
	}

 	get defaultContentScaleFactor():number
	{
		return this._defaultContentScaleFactor;
	}

	set defaultContentScaleFactor(value:number)
	{
		this._defaultContentScaleFactor=value;
	}

 	get timelines():Array<GAFTimelineConfig>
	{
		return this._timelines;
	}

 	get allTextureAtlases():Array<CTextureAtlasScale>
	{
		return this._allTextureAtlases;
	}

 	get stageConfig():CStage
	{
		return this._stageConfig;
	}

	set stageConfig(value:CStage)
	{
		this._stageConfig=value;
	}

 	get id():string
	{
		return this._id;
	}

 	get sounds():Array<CSound>
	{
		return this._sounds;
	}
}