import { Matrix, Rectangle } from "pixi.js";
import TextureWrapper from "../data/textures/TextureWrapper";
import IGAFTexture from "./IGAFTexture";
/**
 * TODO
 * @author Mathieu Anthoine
 * 
 */
export default class GAFScale9Texture implements IGAFTexture
{
	// --------------------------------------------------------------------------
	//
	//  PUBLICIABLES
	//
	// --------------------------------------------------------------------------

	// --------------------------------------------------------------------------
	//
	//  PRIVATEIABLES
	//
	// --------------------------------------------------------------------------

	/**
	* 
	*/
	private static DIMENSIONS_ERROR:string="The width and height of the scale9Grid must be greater than zero.";
	/**
	* 
	*/
	private static HELPER_RECTANGLE:Rectangle = new Rectangle(0, 0, 0, 0);

	private _id:string;
	private _texture:TextureWrapper;
	private _pivotMatrix:Matrix;
	private _scale9Grid:Rectangle;

	// private _topLeft:Texture;
	// private _topCenter:Texture;
	// private _topRight:Texture;
	// private _middleLeft:Texture;
	// private _middleCenter:Texture;
	// private _middleRight:Texture;
	// private _bottomLeft:Texture;
	// private _bottomCenter:Texture;
	// private _bottomRight:Texture;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor(id:string, texture:TextureWrapper, pivotMatrix:Matrix, scale9Grid:Rectangle)
	{
		this._id=id;
		this._pivotMatrix=pivotMatrix;

		// if(scale9Grid.width<=0 || scale9Grid.height<=0)
		// {
			// throw new ArgumentError(DIMENSIONS_ERROR);
		// }
		// _texture=texture;
		this._scale9Grid=scale9Grid;
		this.initialize();
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------
	copyFrom(newTexture:IGAFTexture):void
	{
		if(newTexture instanceof GAFScale9Texture)
		{
			this._id=newTexture.id;
			this._texture=newTexture.texture;
			this._pivotMatrix.copyFrom(newTexture.pivotMatrix);
			// _scale9Grid.copyFrom(cast(newTexture,GAFScale9Texture).scale9Grid);
			// _topLeft=(newTexture as GAFScale9Texture).topLeft;
			// _topCenter=(newTexture as GAFScale9Texture).topCenter;
			// _topRight=(newTexture as GAFScale9Texture).topRight;
			// _middleLeft=(newTexture as GAFScale9Texture).middleLeft;
			// _middleCenter=(newTexture as GAFScale9Texture).middleCenter;
			// _middleRight=(newTexture as GAFScale9Texture).middleRight;
			// _bottomLeft=(newTexture as GAFScale9Texture).bottomLeft;
			// _bottomCenter=(newTexture as GAFScale9Texture).bottomCenter;
			// _bottomRight=(newTexture as GAFScale9Texture).bottomRight;
		}
		else
		{
			throw new Error("Incompatiable types GAFScale9Texture and "+typeof newTexture);
		}
	}
	// --------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	private initialize():void
	{
		// var textureFrame:Rectangle=_texture.frame;
		// if(!textureFrame)
		// {
			// textureFrame=HELPER_RECTANGLE;
			// textureFrame.setTo(0, 0, _texture.width, _texture.height);
		// }
		// var leftWidth:number=_scale9Grid.left;
		// var centerWidth:number=_scale9Grid.width;
		// var rightWidth:number=textureFrame.width - _scale9Grid.width - _scale9Grid.x;
		// var topHeight:number=_scale9Grid.y;
		// var middleHeight:number=_scale9Grid.height;
		// var bottomHeight:number=textureFrame.height - _scale9Grid.height - _scale9Grid.y;
//
		// var regionLeftWidth:number=leftWidth + textureFrame.x;
		// var regionTopHeight:number=topHeight + textureFrame.y;
		// var regionRightWidth:number=rightWidth -(textureFrame.width - _texture.width)- textureFrame.x;
		// var regionBottomHeight:number=bottomHeight -(textureFrame.height - _texture.height)- textureFrame.y;
//
		// var hasLeftFrame:boolean=regionLeftWidth !=leftWidth;
		// var hasTopFrame:boolean=regionTopHeight !=topHeight;
		// var hasRightFrame:boolean=regionRightWidth !=rightWidth;
		// var hasBottomFrame:boolean=regionBottomHeight !=bottomHeight;
//
		// var topLeftRegion:Rectangle=new Rectangle(0, 0, regionLeftWidth, regionTopHeight);
		// var topLeftFrame:Rectangle=(hasLeftFrame || hasTopFrame)? new Rectangle(textureFrame.x, textureFrame.y, leftWidth, topHeight):null;
		// _topLeft=Texture.fromTexture(_texture, topLeftRegion, topLeftFrame);
//
		// var topCenterRegion:Rectangle=new Rectangle(regionLeftWidth, 0, centerWidth, regionTopHeight);
		// var topCenterFrame:Rectangle=hasTopFrame ? new Rectangle(0, textureFrame.y, centerWidth, topHeight):null;
		// _topCenter=Texture.fromTexture(_texture, topCenterRegion, topCenterFrame);
//
		// var topRightRegion:Rectangle=new Rectangle(regionLeftWidth + centerWidth, 0, regionRightWidth, regionTopHeight);
		// var topRightFrame:Rectangle=(hasTopFrame || hasRightFrame)? new Rectangle(0, textureFrame.y, rightWidth, topHeight):null;
		// _topRight=Texture.fromTexture(_texture, topRightRegion, topRightFrame);
//
		// var middleLeftRegion:Rectangle=new Rectangle(0, regionTopHeight, regionLeftWidth, middleHeight);
		// var middleLeftFrame:Rectangle=hasLeftFrame ? new Rectangle(textureFrame.x, 0, leftWidth, middleHeight):null;
		// _middleLeft=Texture.fromTexture(_texture, middleLeftRegion, middleLeftFrame);
//
		// var middleCenterRegion:Rectangle=new Rectangle(regionLeftWidth, regionTopHeight, centerWidth, middleHeight);
		// _middleCenter=Texture.fromTexture(_texture, middleCenterRegion);
//
		// var middleRightRegion:Rectangle=new Rectangle(regionLeftWidth + centerWidth, regionTopHeight, regionRightWidth, middleHeight);
		// var middleRightFrame:Rectangle=hasRightFrame ? new Rectangle(0, 0, rightWidth, middleHeight):null;
		// _middleRight=Texture.fromTexture(_texture, middleRightRegion, middleRightFrame);
//
		// var bottomLeftRegion:Rectangle=new Rectangle(0, regionTopHeight + middleHeight, regionLeftWidth, regionBottomHeight);
		// var bottomLeftFrame:Rectangle=(hasLeftFrame || hasBottomFrame)? new Rectangle(textureFrame.x, 0, leftWidth, bottomHeight):null;
		// _bottomLeft=Texture.fromTexture(_texture, bottomLeftRegion, bottomLeftFrame);
//
		// var bottomCenterRegion:Rectangle=new Rectangle(regionLeftWidth, regionTopHeight + middleHeight, centerWidth, regionBottomHeight);
		// var bottomCenterFrame:Rectangle=hasBottomFrame ? new Rectangle(0, 0, centerWidth, bottomHeight):null;
		// _bottomCenter=Texture.fromTexture(_texture, bottomCenterRegion, bottomCenterFrame);
//
		// var bottomRightRegion:Rectangle=new Rectangle(regionLeftWidth + centerWidth, regionTopHeight + middleHeight, regionRightWidth, regionBottomHeight);
		// var bottomRightFrame:Rectangle=(hasBottomFrame || hasRightFrame)? new Rectangle(0, 0, rightWidth, bottomHeight):null;
		// _bottomRight=Texture.fromTexture(_texture, bottomRightRegion, bottomRightFrame);
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

 	get id():string
	{
		return this._id;
	}

 	get pivotMatrix():Matrix
	{
		return this._pivotMatrix;
	}

 	get texture():TextureWrapper
	{
		return this._texture;
	}

 	get scale9Grid():Rectangle
	{
		return this._scale9Grid;
	}

	// public topLeft(get_topLeft, null):Texture;
 	// get topLeft():Texture
	// {
		// return _topLeft;
	// }
//
	// public topCenter(get_topCenter, null):Texture;
 	// get topCenter():Texture
	// {
		// return _topCenter;
	// }
//
	// public topRight(get_topRight, null):Texture;
 	// get topRight():Texture
	// {
		// return _topRight;
	// }
//
	// public middleLeft(get_middleLeft, null):Texture;
 	// get middleLeft():Texture
	// {
		// return _middleLeft;
	// }
//
	// public middleCenter(get_middleCenter, null):Texture;
 	// get middleCenter():Texture
	// {
		// return _middleCenter;
	// }
//
	// public middleRight(get_middleRight, null):Texture;
 	// get middleRight():Texture
	// {
		// return _middleRight;
	// }
//
	// public bottomLeft(get_bottomLeft, null):Texture;
 	// get bottomLeft():Texture
	// {
		// return _bottomLeft;
	// }
//
	// public bottomCenter(get_bottomCenter, null):Texture;
 	// get bottomCenter():Texture
	// {
		// return _bottomCenter;
	// }
//
	// public bottomRight(get_bottomRight, null):Texture;
 	// get bottomRight():Texture
	// {
		// return _bottomRight;
	// }

	clone():IGAFTexture
	{
		return null;// new GAFScale9Texture(_id, _texture, _pivotMatrix.clone(), _scale9Grid);
	}

	// --------------------------------------------------------------------------
	//
	//  STATIC METHODS
	//
	// --------------------------------------------------------------------------
}