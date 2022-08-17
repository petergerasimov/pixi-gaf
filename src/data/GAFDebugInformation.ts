import { Point, Rectangle } from "pixi.js";
/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class GAFDebugInformation
{
	public static TYPE_POINT:number=0;
	public static TYPE_RECT:number=1;

	type:number=0;
	point:Point;
	rect:Rectangle;
	color:number=0;
	alpha:number;
}