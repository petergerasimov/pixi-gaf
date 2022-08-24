
import { Container, Matrix, Point } from "pixi.js";
import CFilter from "../data/config/CFilter";
import IGAFDisplayObject from "./IGAFDisplayObject";
import IMaxSize from "./IMaxSize";

/**
 * ...
 * @author Mathieu Anthoine
 */
export default class GAFContainer extends Container implements IGAFDisplayObject, IMaxSize
{

	static HELPER_MATRIX:Matrix = new Matrix();
	
	private _maxSize:Point;

	// private _filterChain:GAFFilterChain;
	protected _filterConfig:CFilter;
	protected _filterScale:number;
	
	constructor() 
	{
		super();
	}
	
	get transformationMatrix():Matrix {
		return this.localTransform;
		
	}
	set transformationMatrix(matrix:Matrix) {
		(this.localTransform as any) = matrix;
	}
	
 	get maxSize():Point
	{
		return this._maxSize;
	}

	set maxSize(value:Point)
	{
		this._maxSize = value;
	}
	
	setFilterConfig(value:CFilter, scale:number=1):void
	{
		// TODO: setFilterConfig
		// trace ("TODO: setFilterConfig");
		
		// if(!Starling.current.contextValid)
		// {
			// return;
		// }
//
		// if(_filterConfig !=value || _filterScale !=scale)
		// {
			// if(value!=null)
			// {
				// _filterConfig=value;
				// _filterScale=scale;
//
				// if(_filterChain)
				// {
					// _filterChain.dispose();
				// }
				// else
				// {
					// _filterChain=new GAFFilterChain();
				// }
//
				// _filterChain.setFilterData(_filterConfig);
//
				// filter=_filterChain;
			// }
			// else
			// {
				// if(filter)
				// {
					// filter.dispose();
					// filter=null;
				// }
//
				// _filterChain=null;
				// _filterConfig=null;
				// _filterScale=NaN;
			// }
		// }
	}
	
	invalidateOrientation():void
	{
		// _orientationChanged=true;
	}
	
 	get pivotMatrix():Matrix
	{
		// HELPER_MATRIX.copyFrom(_pivotMatrix);
		GAFContainer.HELPER_MATRIX.identity();

		// if(_pivotChanged)
		// {
			// HELPER_MATRIX.tx=pivotX;
			// HELPER_MATRIX.ty=pivotY;
		// }

		return GAFContainer.HELPER_MATRIX;
	}
	
}