import { Matrix } from "pixi.js";
import { MatrixUtility } from "../../utils/MatrixUtility";
import CFilter from "./CFilter";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CAnimationFrameInstance
{
	// --------------------------------------------------------------------------
	//
	// PUBLIC VARIABLES
	//
	// --------------------------------------------------------------------------
	// --------------------------------------------------------------------------
	//
	// PRIVATE VARIABLES
	//
	// --------------------------------------------------------------------------
	private _id:string;
	private _zIndex:number=0;
	private _matrix:Matrix;
	private _alpha:number;
	private _maskID:string;
	private _filter:CFilter;

	private static tx:number;
	private static ty:number;

	// --------------------------------------------------------------------------
	//
	// CONSTRUCTOR
	//
	// --------------------------------------------------------------------------
	constructor(id:string)
	{
		this._id=id;
	}

	// --------------------------------------------------------------------------
	//
	// PUBLIC METHODS
	//
	// --------------------------------------------------------------------------
	clone():CAnimationFrameInstance
	{
		const result:CAnimationFrameInstance=new CAnimationFrameInstance(this._id);

		let filterCopy:CFilter=null;

		if(this._filter!=null)
		{
			filterCopy = this._filter.clone();
		}

		result.update(this._zIndex, this._matrix.clone(), this._alpha, this._maskID, filterCopy);

		return result;
	}

	update(zIndex:number, matrix:Matrix, alpha:number, maskID:string, filter:CFilter):void
	{
		this._zIndex=zIndex;
		this._matrix=matrix;
		this._alpha=alpha;
		this._maskID=maskID;
		this._filter=filter;
	}

	getTransformMatrix(pivotMatrix:Matrix, scale:number):Matrix
	{
		const result:Matrix=pivotMatrix.clone();
		CAnimationFrameInstance.tx=this._matrix.tx;
		CAnimationFrameInstance.ty=this._matrix.ty;
		this._matrix.tx *=scale;
		this._matrix.ty *=scale;
		MatrixUtility.concat(result, this._matrix);
		this._matrix.tx=CAnimationFrameInstance.tx;
		this._matrix.ty=CAnimationFrameInstance.ty;

		return result;
	}

	applyTransformMatrix(transformationMatrix:Matrix, pivotMatrix:Matrix, scale:number):void
	{
		transformationMatrix.copyFrom(pivotMatrix);
		CAnimationFrameInstance.tx=this._matrix.tx;
		CAnimationFrameInstance.ty=this._matrix.ty;
		this._matrix.tx *=scale;
		this._matrix.ty *= scale;
		MatrixUtility.concat(transformationMatrix, this._matrix);
		this._matrix.tx=CAnimationFrameInstance.tx;
		this._matrix.ty=CAnimationFrameInstance.ty;
	}

	calculateTransformMatrix(transformationMatrix:Matrix, pivotMatrix:Matrix, scale:number):Matrix
	{
		this.applyTransformMatrix(transformationMatrix, pivotMatrix, scale);
		return transformationMatrix;
	}

	// --------------------------------------------------------------------------
	//
	// PRIVATE METHODS
	//
	// --------------------------------------------------------------------------
	// --------------------------------------------------------------------------
	//
	// OVERRIDDEN METHODS
	//
	// --------------------------------------------------------------------------
	// --------------------------------------------------------------------------
	//
	// EVENT HANDLERS
	//
	// --------------------------------------------------------------------------
	// --------------------------------------------------------------------------
	//
	// GETTERS AND SETTERS
	//
	// --------------------------------------------------------------------------
	
 	get id():string
	{
		return this._id;
	}

	
 	get matrix():Matrix
	{
		return this._matrix;
	}

	
 	get alpha():number
	{
		return this._alpha;
	}

	
 	get maskID():string
	{
		return this._maskID;
	}

	
 	get filter():CFilter
	{
		return this._filter;
	}

	
 	get zIndex():number
	{
		return this._zIndex;
	}
}