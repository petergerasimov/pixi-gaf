/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CStage
{
	fps:number=0;
	color:number=0;
	width:number=0;
	height:number=0;

	constructor() {}
	
	clone(source:any):CStage
	{
		this.fps=source.fps;
		this.color=source.color;
		this.width=source.width;
		this.height=source.height;
		
		return this;
	}
}