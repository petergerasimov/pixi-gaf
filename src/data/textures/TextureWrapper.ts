/* eslint-disable valid-jsdoc */
import { Texture, BaseTexture, Rectangle, Matrix } from "pixi.js";

/**
 * PixiJs Wrapper of the Starling Texture Class
 * @author Mathieu Anthoine
 */
export default class TextureWrapper extends Texture
{
	
	constructor(pBaseTexture?:BaseTexture, pFrame?:Rectangle, pCrop?:Rectangle, pTrim?:Rectangle, pRotate?:boolean) 
	{
		super(pBaseTexture,pFrame,pCrop,pTrim,Number(pRotate));		
	}
	
	
	get base ():BaseTexture {
		return null;
		// return baseTexture;
	}
	
	// / The Context3DTextureFormat of the underlying texture data.
	
	get format(): string
	{
		// TODO
		return "bgra";
	}
	
	
	get frameHeight():number 
	{
		return this.frame!=null ? this.frame.height : this.height;
	}
	
	
	get frameWidth():number 
	{
		return this.frame!=null ? this.frame.width : this.width;
	}
	
	
	get mipMapping():boolean
	{
		return false;
		// return base.mipmap;
	}
	
	
	get nativeHeight():number 
	{
		return 0;
	}
	
	
	get nativeWidth():number 
	{
		return 0;
	}
	
	
	get premultipliedAlpha():boolean
	{
		return false;
	}
	
	
	get root():TextureWrapper 
	{
		return null;
	}
	
	
	get scale():number 
	{
		return 1;
	}
	
	
	get transformationMatrix():Matrix 
	{
		return null;
	}
	
	
	get transformationMatrixToRoot():Matrix 
	{
		return null;
	}
	
	// --------------------------------------------------------------------------
	//
	//  STATIC
	//
	// --------------------------------------------------------------------------

	/** Creates a texture that contains a region (in pixels) of another texture. The new
	*  texture will reference the base texture; no data is duplicated.
	*
	*  @param texture  The texture you want to create a SubTexture from.
	*  @param region   The region of the parent texture that the SubTexture will show
	*                  (in points).
	*  @param frame    If the texture was trimmed, the frame rectangle can be used to restore
	*                  the trimmed area.
	*  @param rotated  If true, the SubTexture will show the parent region rotated by
	*                  90 degrees (CCW).
	*  @param scaleModifier  The scale factor of the new texture will be calculated by
	*                  multiplying the parent texture's scale factor with this value.
	*/
	// public static fromTexture(texture:TextureWrapper, region:Rectangle=null,
	// 								  frame:Rectangle=null, rotated:boolean=false,
	// 								  scaleModifier:number=1.0):TextureWrapper
	// {
	// 	return new SubTexture(texture, region, false, frame, rotated, scaleModifier);
	// }
	
	private static get maxSize():number 
	{
		// var target:Starling = Starling.current;
		// var profile:string = target ? target.profile : "baseline";

		// if (profile == "baseline" || profile == "baselineConstrained")
			// return 2048;
		// else
			// return 4096;
		
		return 4096;
	}
	
}