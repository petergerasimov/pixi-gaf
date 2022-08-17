import { Matrix } from "pixi.js";

/**
 * Class that adds equivalents to AS3 methods
 * @author Mathieu Anthoine
 */
export class MatrixUtility
{
	
	public static concat (pA:Matrix,pB:Matrix):void {
		const lMatrix:Matrix = new Matrix();
		
		lMatrix.a = pB.a * pA.a + pB.c * pA.b;
		lMatrix.b = (pB.b*pA.a+pB.d*pA.b);
		lMatrix.c = (pB.a*pA.c+pB.c*pA.d);
		lMatrix.d = pB.b * pA.c + pB.d * pA.d;
		lMatrix.tx = pB.a*pA.tx+pB.c*pA.ty+pB.tx;
		lMatrix.ty = pB.b*pA.tx+pB.d*pA.ty+pB.ty;
		
		lMatrix.copyTo(pA);
	}
	
	public static copyFrom(pA:Matrix, pB:Matrix):void {
		pB.copyTo(pA);
	}
	
}