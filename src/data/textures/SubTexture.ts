/* eslint-disable valid-jsdoc */
/**
 * TODO: check
 * AS3 Conversion of Starling SubTexture class
 * @author Mathieu Anthoine
 */

import { Rectangle, Matrix, BaseTexture } from "pixi.js";
import { MatrixUtility } from "../../utils/MatrixUtility";
import TextureWrapper from "./TextureWrapper";

/** A SubTexture represents a section of another texture. This is achieved solely by
 *  manipulation of texture coordinates, making the class very efficient. 
 *
 *<p><em>Note that it is OK to create subtextures of subtextures.</em></p>
 */
export default class SubTexture extends TextureWrapper
{
	private _parent:TextureWrapper;
	private _ownsParent:boolean=false;
	private _region:Rectangle;
	private _rotated:boolean=false;
	private _scale:number;	
	private _transformationMatrix:Matrix;
	private _transformationMatrixToRoot:Matrix;


	/** Creates a new SubTexture containing the specified region of a parent texture.
	*
	*  @param parent	The texture you want to create a SubTexture from.
	*  @param region	The region of the parent texture that the SubTexture will show
	*					(in points). If<code>null</code>, the complete area of the parent.
	*  @param ownsParent If<code>true</code>, the parent texture will be disposed
	*					automatically when the SubTexture is disposed.
	*  @param frame	 If the texture was trimmed, the frame rectangle can be used to restore
	*					the trimmed area.
	*  @param rotated	If true, the SubTexture will show the parent region rotated by
	*					90 degrees(CCW).
	*  @param scaleModifier  The scale factor of the SubTexture will be calculated by
	*					multiplying the parent texture's scale factor with this value.
	*/
	constructor(pParent:TextureWrapper, pRegion:Rectangle=null, pOwnsParent:boolean=false, pFrame:Rectangle=null, pRotated:boolean=false, pScaleModifier:number=1)
	{	
		
		super(pParent.baseTexture, pRegion,null,null,pRotated);
		this.setTo(pParent, pRegion, pOwnsParent, pFrame, pRotated, pScaleModifier);
		
	}
	
	override get base ():BaseTexture {
		return this._parent.baseTexture;
	}
	
	override get frameHeight():number 
	{
		return this.frame.height;
	}
	
	override get frameWidth():number 
	{
		return this.frame.width;
	}
	
	override get mipMapping():boolean
	{
		return this._parent.mipMapping;
	}
	
	override get nativeHeight():number 
	{
		return this.height * this._scale;
	}
	
	override get nativeWidth():number 
	{
		return this.width * this._scale;
	}
	
	override get format():string 
	{
		return this._parent.format;
	}
	
	override get premultipliedAlpha():boolean
	{
		return this._parent.premultipliedAlpha;
	}
	
	override get root():TextureWrapper 
	{
		return this._parent.root;
	}
	
	override get scale():number 
	{
		return this._scale;
	}
	
	override get transformationMatrix():Matrix 
	{
		return this._transformationMatrix;
	}
	
	override get transformationMatrixToRoot():Matrix 
	{
		return this._transformationMatrixToRoot;
	}
	
	/** 
	*
	*<p>Textures are supposed to be immutable, and Starling uses this assumption for
	*  optimizations and simplifications all over the place. However, in some situations where
	*  the texture is not accessible to the outside, this can be overruled in order to avoid
	*  allocations.</p>
	*/
	setTo(pParent:TextureWrapper, pRegion:Rectangle=null, pOwnsParent:boolean=false, pFrame:Rectangle=null, pRotated:boolean=false, pScaleModifier:number=1):void
	{
		if(this._region==null) this._region=new Rectangle(0,0,0,0);
		if (pRegion!=null) {
			this._region.x = pRegion.x;
			this._region.y = pRegion.y;
			this._region.width = pRegion.width;
			this._region.height = pRegion.height;
		} else {
			this._region.x = 0;
			this._region.y = 0;
			this._region.width = pParent.width;
			this._region.height = pParent.height;
		}

		// if(pFrame!=null)
		// {
			// if (frame!=null) {
				// frame.x=pFrame.x;
				// frame.y=pFrame.y;
				// frame.width=pFrame.width;
				// frame.height=pFrame.height;
			// }
			// else frame=pFrame.clone();
		// }
		// else frame=null;

		this._parent=pParent;
		this._ownsParent=pOwnsParent;
		this._rotated=pRotated;
		
		if (this.frame!=null) {
			this.frame.width=(pRotated ? this._region.height:this._region.width)/ pScaleModifier;
			this.frame.height=(pRotated ? this._region.width:this._region.height)/ pScaleModifier;
		}
		
		this._scale = (this._parent!=null ? this._parent.scale : 1) * pScaleModifier;

		// if(frame!=null &&(frame.x>0 || frame.y>0 ||
			// frame.x+frame.width<width || frame.y+frame.height<height))
		// {
			// console.warn("[Starling] Warning:frames inside the texture's region are unsupported.");
		// }

		this.updateMatrices();
	}

	private updateMatrices():void
	{
		if (this._transformationMatrix != null) this._transformationMatrix.identity();
		else this._transformationMatrix=new Matrix();

		if(this._transformationMatrixToRoot!=null) this._transformationMatrixToRoot.identity();
		else this._transformationMatrixToRoot=new Matrix();

		if(this._rotated)
		{
			this._transformationMatrix.translate(0, -1);
			this._transformationMatrix.rotate(Math.PI / 2.0);
		}

		this._transformationMatrix.scale(this._region.width  / this._parent.width, this._region.height / this._parent.height);
		this._transformationMatrix.translate(this._region.x  / this._parent.width, this._region.y  / this._parent.height);

		let texture:SubTexture=this;
		while(texture!=null)
		{
			MatrixUtility.concat(this._transformationMatrixToRoot,texture._transformationMatrix);
			
			if (texture.parent instanceof SubTexture) texture=texture.parent;
			else texture = null;
		}
	}
	
	/** Disposes the parent texture if this texture owns it. */
	public override destroy(destroyBase?:boolean):void
	{
		if (this._ownsParent) {
			this._parent.destroy();
		}
		super.destroy(destroyBase);
	}

	/** The texture which the SubTexture is based on. */
	
 	get parent():TextureWrapper { return this._parent;}
	
	/** Indicates if the parent texture is disposed when this object is disposed. */
	
 	get ownsParent():boolean{ return this._ownsParent;}
	
	/** If true, the SubTexture will show the parent region rotated by 90 degrees(CCW). */
	
 	get rotated():boolean{ return this._rotated;}

	/** The region of the parent texture that the SubTexture is showing(in points).
	*
	*<p>CAUTION:not a copy, but the actual object! Do not modify!</p>*/
	
 	get region():Rectangle {
		return this._region;
	}	
	
}