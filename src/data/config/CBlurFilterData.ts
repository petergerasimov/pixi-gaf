/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CBlurFilterData implements ICFilterData
{
	blurX:number;
	blurY:number;
	color:number=0;
	angle:number=0;
	distance:number=0;
	strength:number=0;
	alpha:number=1;
	inner:boolean=false;
	knockout:boolean=false;
	resolution:number=1;
	
	new () {}
	
	clone():ICFilterData
	{
		
		const copy:CBlurFilterData=new CBlurFilterData();
		
		copy.blurX=this.blurX;
		copy.blurY=this.blurY;
		copy.color=this.color;
		copy.angle=this.angle;
		copy.distance=this.distance;
		copy.strength=this.strength;
		copy.alpha=this.alpha;
		copy.inner=this.inner;
		copy.knockout=this.knockout;
		copy.resolution=this.resolution;
		
		return copy;
	}

}