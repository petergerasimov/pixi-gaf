import { VectorUtility } from "../../utils/VectorUtility";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CColorMatrixFilterData implements ICFilterData
{
	matrix:Array<number>=[];
	
	clone():ICFilterData
	{
		const copy:CColorMatrixFilterData=new CColorMatrixFilterData();

		VectorUtility.copyMatrix(copy.matrix, this.matrix);

		return copy;
	}
}