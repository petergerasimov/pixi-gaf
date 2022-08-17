import { IDestroyOptions, Matrix } from "pixi.js";
import CFilter from "../data/config/CFilter";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default interface IGAFDisplayObject
{
	setFilterConfig: (value:CFilter, scale:number) => void;
	invalidateOrientation: () => void;

	destroy: (options?: boolean |IDestroyOptions ) => void;

	alpha:number;

	transformationMatrix: Matrix;

	pivotMatrix:Matrix;

	name:string;

}
