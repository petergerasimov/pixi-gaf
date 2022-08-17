/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export class MathUtility
{
	public static epsilon:number = 0.00001;

	public static PI_Q:number = Math.PI / 4.0;

	public static equals(a:number, b:number):boolean
	{
		if(Number.isNaN(a) || Number.isNaN(b))
		{
			return false;
		}
		return Math.abs(a - b) < MathUtility.epsilon;
	}

	public static getItemIndex(source:Array<number>, target:number):number
	{
		for(let i = 0; i < source.length; i++)
		{
			if(MathUtility.equals(source[i], target))
			{
				return i;
			}
		}
		return -1;
	}
}