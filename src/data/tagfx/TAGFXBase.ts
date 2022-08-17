import { Point, utils } from "pixi.js";
import TextureWrapper from "../textures/TextureWrapper";
import ITAGFX from "./ITAGFX";


/**
 * Dispatched when he texture is decoded. It can only be used when the callback has been executed.
 */
// [Event(name="textureReady", type="flash.events.Event")]

/**
 * TODO
 * @author Mathieu Anthoine
 * 
 */
export default class TAGFXBase extends utils.EventEmitter implements ITAGFX
{
	// --------------------------------------------------------------------------
	//
	//  PUBLIC VARIABLES
	//
	// --------------------------------------------------------------------------

	public static EVENT_TYPE_TEXTURE_READY:string="textureReady";

	public static SOURCE_TYPE_BITMAP_DATA:string="sourceTypeBitmapData";
	public static SOURCE_TYPE_BITMAP:string="sourceTypeBitmap";
	public static SOURCE_TYPE_PNG_BA:string="sourceTypePNGBA";
	public static SOURCE_TYPE_ATF_BA:string="sourceTypeATFBA";
	public static SOURCE_TYPE_PNG_URL:string="sourceTypePNGURL";
	public static SOURCE_TYPE_ATF_URL:string="sourceTypeATFURL";

	// --------------------------------------------------------------------------
	//
	//  PRIVATE VARIABLES
	//
	// --------------------------------------------------------------------------

	private _texture:TextureWrapper;
	private _textureSize:Point;
	private _textureScale:number=-1;
	private _textureFormat:string;
	protected _source:any;
	private _clearSourceAfterTextureCreated:boolean=false;
	private _isReady:boolean=false;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor()
	{
		super();
		// if(Capabilities.isDebugger &&
				// getQualifiedClassName(this)=="com.catalystapps.gaf.data::TAGFXBase")
		// {
			// throw new AbstractClassError();
		// }
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

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

	private onTextureReady(texture:TextureWrapper):void
	{
		this._isReady=true;
		// dispatchEvent(new Event(EVENT_TYPE_TEXTURE_READY));
		this.emit(TAGFXBase.EVENT_TYPE_TEXTURE_READY);
	}

	// --------------------------------------------------------------------------
	//
	//  GETTERS AND SETTERS
	//
	// --------------------------------------------------------------------------

	
 	get texture():TextureWrapper
	{
		return this._texture;
	}

	
 	get textureSize():Point
	{
		return this._textureSize;
	}

	set textureSize(value:Point)
	{
		this._textureSize=value;
	}

	
 	get textureScale():number
	{
		return this._textureScale;
	}

	set textureScale(value:number)
	{
		this._textureScale=value;
	}

	
 	get textureFormat():string
	{
		return this._textureFormat;
	}

	set textureFormat(value:string)
	{
		this._textureFormat=value;
	}

	
 	get sourceType():string
	{
		// TODO
		// throw new AbstractMethodError();
		return "";
	}

	
 	get source()
	{
		return this._source;
	}

	//
 	// get clearSourceAfterTextureCreated():boolean
	// {
		// return _clearSourceAfterTextureCreated;
	// }
//
	// set clearSourceAfterTextureCreated(value:boolean):boolean
	// {
		// return _clearSourceAfterTextureCreated=value;
	// }

	
 	get ready():boolean
	{
		return this._isReady;
	}

	// --------------------------------------------------------------------------
	//
	//  STATIC METHODS
	//
	// --------------------------------------------------------------------------
}