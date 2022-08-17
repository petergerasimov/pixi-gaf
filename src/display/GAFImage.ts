import { Matrix, Sprite, Point, IDestroyOptions } from "pixi.js";
import CFilter from "../data/config/CFilter";
import IGAFDebug from "./IGAFDebug";
import IGAFImage from "./IGAFImage";
import IGAFTexture from "./IGAFTexture";
import IMaxSize from "./IMaxSize";
// import com.github.haxePixiGAF.data.config.CFilter;
// import haxe.extern.EitherType;
// import js.Lib;
// import pixi.core.display.DisplayObject.DestroyOptions;

// using com.github.haxePixiGAF.utils.MatrixUtility;

/**
 * TODO : check doublons (scale, scaleX, pivot, pivotX) et supprimer ce qui est en trop
 * @author Mathieu Anthoine
 */
/**
 * GAFImage represents static GAF display object that is part of the<code>GAFMovieClip</code>.
 */
export default class GAFImage extends Sprite implements IGAFImage, IMaxSize, IGAFDebug
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

	// private static V_DATA_ATTR:string="position";

	// private static HELPER_POINT:Point=new Point();
	// private static HELPER_POINT_3D:Vector3D=new Vector3D();
	private HELPER_MATRIX:Matrix=new Matrix();
	// private static HELPER_MATRIX_3D:Matrix3D=new Matrix3D();

	private _assetTexture:IGAFTexture;

	// private _filterChain:GAFFilterChain;
	// private _filterConfig:CFilter;
	// private _filterScale:number;

	private _maxSize:Point;

	// private _pivotChanged:boolean=false;

	public __debugOriginalAlpha:number=null;

	// private _orientationChanged:boolean=false;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor(assetTexture:IGAFTexture)
	{
		super(assetTexture.texture);
		this._assetTexture = assetTexture.clone();
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	
	// Creates a new instance of GAFImage.
	copy():GAFImage
	{
		return new GAFImage(this._assetTexture);
	}

	invalidateOrientation():void
	{
		// _orientationChanged = true;
	}

 	set debugColors(value:Array<number>)
	{
		/* var alpha0:number;
		var alpha1:number;

		switch(value.length)
		{
			case 1:
				color=value[0];
				alpha=(value[0]>>>24)/ 255;
				break;
			case 2:
				setVertexColor(0, value[0]);
				setVertexColor(1, value[0]);
				setVertexColor(2, value[1]);
				setVertexColor(3, value[1]);

				alpha0=(value[0]>>>24)/ 255;
				alpha1=(value[1]>>>24)/ 255;
				setVertexAlpha(0, alpha0);
				setVertexAlpha(1, alpha0);
				setVertexAlpha(2, alpha1);
				setVertexAlpha(3, alpha1);
				break;
			case 3:
				setVertexColor(0, value[0]);
				setVertexColor(1, value[0]);
				setVertexColor(2, value[1]);
				setVertexColor(3, value[2]);

				alpha0=(value[0]>>>24)/ 255;
				setVertexAlpha(0, alpha0);
				setVertexAlpha(1, alpha0);
				setVertexAlpha(2,(value[1]>>>24)/ 255);
				setVertexAlpha(3,(value[2]>>>24)/ 255);
				break;
			case 4:
				setVertexColor(0, value[0]);
				setVertexColor(1, value[1]);
				setVertexColor(2, value[2]);
				setVertexColor(3, value[3]);

				setVertexAlpha(0,(value[0]>>>24)/ 255);
				setVertexAlpha(1,(value[1]>>>24)/ 255);
				setVertexAlpha(2,(value[2]>>>24)/ 255);
				setVertexAlpha(3,(value[3]>>>24)/ 255);
				break;
		}*/
			
	}

	changeTexture(newTexture:IGAFTexture):void
	{
		this.texture = newTexture.texture;
		// readjustSize();
		this._assetTexture.copyFrom(newTexture);
	}

	setFilterConfig(value:CFilter, scale:number=1):void
	{
		// trace ("setFilterConfig: TODO");
		
		/* if(!Starling.current.contextValid)
		{
			return;
		}

		if(_filterConfig !=value || _filterScale !=scale)
		{
			if(value)
			{
				_filterConfig=value;
				_filterScale=scale;

				if(_filterChain)
				{
					_filterChain.dispose();
				}
				else
				{
					_filterChain=new GAFFilterChain();
				}

				_filterChain.setFilterData(_filterConfig);

				filter=_filterChain;
			}
			else
			{
				if(filter)
				{
					filter.dispose();
					filter=null;
				}

				_filterChain=null;
				_filterConfig=null;
				_filterScale=NaN;
			}
		}*/
	}



	// --------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	__debugHighlight():void
	{
		if(Number.isNaN(this.__debugOriginalAlpha))
		{
			this.__debugOriginalAlpha=this.alpha;
		}
		this.alpha = 1;
	}

	__debugLowlight():void
	{
		if(Number.isNaN(this.__debugOriginalAlpha))
		{
			this.__debugOriginalAlpha=this.alpha;
		}
		this.alpha = .05;
	}

	__debugResetLight():void
	{
		if(!Number.isNaN(this.__debugOriginalAlpha))
		{
			this.alpha=this.__debugOriginalAlpha;
			this.__debugOriginalAlpha=null;
		}
	}

	// [Inline]
	private updateTransformMatrix():void
	{
		// if(_orientationChanged)
		// {
			// transformationMatrix=transformationMatrix;
			// _orientationChanged=false;
		// }
	}

	// --------------------------------------------------------------------------
	//
	// OVERRIDDEN METHODS
	//
	// --------------------------------------------------------------------------

	// Disposes all resources of the display object.
	override destroy(options?: boolean | IDestroyOptions):void
	{
		// if(filter!=null)
		// {
			// filter.dispose();
			// filter=null;
		// }
		this._assetTexture=null;
		// _filterConfig=null;

		super.destroy(options);
	}

	
	// TODO: getGAFGetbounds
	
	// override  getBounds(targetSpace:DisplayObject, resultRect:Rectangle=null):Rectangle
	// {
		// if(!resultRect)resultRect=new Rectangle(0,0,0,0);
//
		// if(targetSpace==this)// optimization
		// {
			// vertexData.getPoint(3,V_DATA_ATTR, HELPER_POINT);
			// resultRect.setTo(0.0, 0.0, HELPER_POINT.x, HELPER_POINT.y);
		// }
		// else if(targetSpace==parent && rotation==0.0 && isEquivalent(skewX, skewY))// optimization
		// {
			// var scaleX:number=scaleX;
			// var scaleY:number=scaleY;
			// vertexData.getPoint(3,V_DATA_ATTR, HELPER_POINT);
			// resultRect.setTo(x - pivotX * scaleX,	 y - pivotY * scaleY,
					// HELPER_POINT.x * scaleX, HELPER_POINT.y * scaleY);
			// if(scaleX<0){ resultRect.width  *=-1;resultRect.x -=resultRect.width;}
			// if(scaleY<0){ resultRect.height *=-1;resultRect.y -=resultRect.height;}
		// }
		// else if(is3D && stage)
		// {
			// stage.getCameraPosition(targetSpace, HELPER_POINT_3D);
			// getTransformationMatrix3D(targetSpace, HELPER_MATRIX_3D);
			// vertexData.getBoundsProjected(V_DATA_ATTR,HELPER_MATRIX_3D, HELPER_POINT_3D, 0, 4, resultRect);
		// }
		// else
		// {
			// getTransformationMatrix(targetSpace, HELPER_MATRIX);
			// vertexData.getBounds(V_DATA_ATTR,HELPER_MATRIX, 0, 4, resultRect);
		// }
//
		// return resultRect;
	// }

	private isEquivalent(a:number, b:number, epsilon:number = 0.0001):boolean
	{
		return(a - epsilon < b)&&(a + epsilon > b);
	}

 	set pivotX(value:number)
	{
		this.pivot.x = value;
	}

 	set pivotY(value:number)
	{
		this.pivot.y=value;
	}

	// override  get x():number
	// {
		// updateTransformMatrix();
		// return super.x;
	// }

	// override  get y():number
	// {
		// updateTransformMatrix();
		// return super.y;
	// }

	// override public var rotation(get_rotation, set_rotation):number;
 	// get rotation():number
	// {
		// updateTransformMatrix();
		// return super.rotation;
	// }

 	get scaleX():number
	{
		return this.scale.x;
	}

 	get scaleY():number
	{
		// updateTransformMatrix();
		return this.scale.y;
	}

 	get skewX():number
	{
		// updateTransformMatrix();
		return this.skew.x;
	}

	get skewY():number
	{
		// updateTransformMatrix();
		return this.skew.y;
	}

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

 	get maxSize():Point
	{
		return this._maxSize;
	}

	set maxSize(value:Point)
	{
		this._maxSize = value;
	}

	get assetTexture():IGAFTexture
	{
		return this._assetTexture;
	}

 	get pivotMatrix():Matrix
	{
		this.HELPER_MATRIX.copyFrom(this._assetTexture.pivotMatrix);
		// if(_pivotChanged)
		// {
			// HELPER_MATRIX.tx=pivotX;
			// HELPER_MATRIX.ty=pivotY;
		// }
		
		return this.HELPER_MATRIX;
	}
	
	get transformationMatrix():Matrix {
		return this.localTransform;
		
	}
	set transformationMatrix(matrix:Matrix) {
		(this as any).localTransform = matrix;
	}
	
	get textureSmoothing():string {
		// return _style.textureSmoothing;
		// TODO get_textureSmoothing
		return "";
	}
	
	set textureSmoothing(value:string) {
		// TODO set_textureSmoothing
		// return _style.textureSmoothing = value;
	}
}