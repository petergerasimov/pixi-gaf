
import { Rectangle } from "pixi.js";

/**
 * Class that adds equivalents to AS3 methods
 * @author Mathieu Anthoine
 */
export class RectangleUtility
{
	public static copyFrom(pA:Rectangle, pB:Rectangle):void {
		pA.x = pB.x;
		pA.y = pB.y;
		pA.width = pB.width;
		pA.height = pB.height;
	}
	
	public static union(pA:Rectangle, pB:Rectangle):Rectangle {
		const lX:number = Math.min(pA.x, pB.x);
		const lY:number = Math.min(pA.y, pB.y);
		const lRight:number = Math.max(pA.x + pA.width, pB.x + pB.width);
		const lBottom:number = Math.max(pA.y + pA.height, pB.y + pB.height);

		return new Rectangle(lX, lY, lRight - lX, lBottom - lY);

	}
}