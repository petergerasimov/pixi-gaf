import { VectorUtility } from "../../utils/VectorUtility";
import CBlurFilterData from "./CBlurFilterData";
import CColorMatrixFilterData from "./CColorMatrixFilterData";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CFilter
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

	private _filterConfigs:Array<ICFilterData>=[];

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------
	
	clone():CFilter
	{
		const result:CFilter=new CFilter();

		for(const filterData of this._filterConfigs)
		{
			result.filterConfigs.push(filterData.clone());
		}

		return result;
	}

	addBlurFilter(blurX:number, blurY:number):string
	{
		const filterData:CBlurFilterData=new CBlurFilterData();
		filterData.blurX=blurX;
		filterData.blurY=blurY;
		filterData.color=-1;

		this._filterConfigs.push(filterData);

		return "";
	}

	addGlowFilter(blurX:number, blurY:number, color:number, alpha:number,
								 strength:number=1, inner:boolean=false, knockout:boolean=false):string
	{
		const filterData:CBlurFilterData=new CBlurFilterData();
		filterData.blurX=blurX;
		filterData.blurY=blurY;
		filterData.color=color;
		filterData.alpha=alpha;
		filterData.strength=strength;
		filterData.inner=inner;
		filterData.knockout=knockout;

		this._filterConfigs.push(filterData);

		return "";
	}

	addDropShadowFilter(blurX:number, blurY:number, color:number, alpha:number, angle:number, distance:number,
										strength:number=1, inner:boolean=false, knockout:boolean=false):string
	{
		const filterData:CBlurFilterData=new CBlurFilterData();
		filterData.blurX=blurX;
		filterData.blurY=blurY;
		filterData.color=color;
		filterData.alpha=alpha;
		filterData.angle=angle;
		filterData.distance=distance;
		filterData.strength=strength;
		filterData.inner=inner;
		filterData.knockout=knockout;

		this._filterConfigs.push(filterData);

		return "";
	}

	addColorTransform(params:Array<number>):void
	{
		if(this.getColorMatrixFilter()!=null)
		{
			return;
		}

		const filterData:CColorMatrixFilterData=new CColorMatrixFilterData();
		VectorUtility.fillMatrix(filterData.matrix,
				params[1], 0, 0, 0, params[2],
				0, params[3], 0, 0, params[4],
				0, 0, params[5], 0, params[6],
							  0, 0, 0, 1, 0);
		this._filterConfigs.push(filterData);
	}

	addColorMatrixFilter(params:Array<number>):string
	{
		for(const [i] of params.entries())
		{
			if(i % 5==4)
			{
				params[i]=params[i] / 255;
			}
		}

//			var colorMatrixFilterConfig:CColorMatrixFilterData=getColorMatrixFilter();
//
//			if(colorMatrixFilterConfig)
//			{
//				return WarningConstants.CANT_COLOR_ADJ_CT;
//			}
//			else
//			{
			const colorMatrixFilterConfig:CColorMatrixFilterData=new CColorMatrixFilterData();
			VectorUtility.copyMatrix(colorMatrixFilterConfig.matrix, params);
			this._filterConfigs.push(colorMatrixFilterConfig);
//			}

		return "";
	}

	getBlurFilter():CBlurFilterData
	{
		for(const filterConfig of this._filterConfigs)
		{
			if(filterConfig instanceof CBlurFilterData)
			{
				return filterConfig;
			}
		}

		return null;
	}

	// --------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	private getColorMatrixFilter():CColorMatrixFilterData
	{
		for(const filterConfig of this._filterConfigs)
		{
			if(filterConfig instanceof CColorMatrixFilterData)
			{
				return filterConfig as CColorMatrixFilterData;
			}
		}

		return null;
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

	
 	get filterConfigs():Array<ICFilterData>
	{
		return this._filterConfigs;
	}

}