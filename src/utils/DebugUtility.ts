/* eslint-disable valid-jsdoc */
import CAnimationFrameInstance from "../data/config/CAnimationFrameInstance";
import GAF from "../data/GAF";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class DebugUtility
{
	public static RENDERING_DEBUG:boolean=false;

	public static RENDERING_NEUTRAL_COLOR:number=0xCCCCCCCC;
	public static RENDERING_FILTER_COLOR:number=0xFF00FFFF;
	public static RENDERING_MASK_COLOR:number=0xFFFF0000;
	public static RENDERING_ALPHA_COLOR:number=0xFFFFFF00;

	private static cHR:Array<number>=[255, 255, 0, 0, 0, 255, 255];
	private static cHG:Array<number>=[0, 255, 255, 255, 0, 0, 0];
	private static cHB:Array<number>=[0, 0, 0, 255, 255, 255, 0];

	private static aryRGB:Array<Array<number>>=[DebugUtility.cHR, DebugUtility.cHG, DebugUtility.cHB];

	public static getRenderingDifficultyColor(instance:CAnimationFrameInstance,
													  alphaLess1:boolean=false, masked:boolean=false,
													  hasFilter:boolean=false):Array<number>
	{
		const colors:Array<number>=[];
		if(instance.maskID!=null || masked)
		{
			colors.push(DebugUtility.RENDERING_MASK_COLOR);
		}
		if(instance.filter!=null || hasFilter)
		{
			colors.push(DebugUtility.RENDERING_FILTER_COLOR);
		}
		if(instance.alpha<GAF.maxAlpha || alphaLess1)
		{
			colors.push(DebugUtility.RENDERING_ALPHA_COLOR);
		}
		if(colors.length==0)
		{
			colors.push(DebugUtility.RENDERING_NEUTRAL_COLOR);
		}

		return colors;
	}

	/**
	* Returns color that objects would be painted
	* @param difficulty value from 0 to 255
	* @return color in ARGB format(from green to red)
	*/
	private static getColor(difficulty:number):number
	{
		if(difficulty>255)
		{
			difficulty=255;
		}

		const colorArr:Array<number>=this.getRGB(Math.floor(120 - 120 /(255 / difficulty)));

		const color:number=(((difficulty>>1)+ 0x7F)<<24)| colorArr[0]<<16 | colorArr[1]<<8;

		return color;
	}

	// return RGB color from hue circle rotation
	// [0]=R, [1]=G, [2]=B
	private static getRGB(rot:number):Array<number>
	{
		let retVal:Array<number>=[];
		let aryNum:number=0;
		// 0 ~ 360
		while(rot<0 || rot>360)
		{
			rot +=(rot<0)? 360:-360;
		}
		aryNum=Math.floor(rot / 60);
		// get color
		retVal=this.getH(rot, aryNum);
		return retVal;
	}

	// rotation=>hue
	private static getH(rot:number, aryNum:number):Array<number>
	{
		const retVal:Array<number>=[0, 0, 0];
		const nextNum:number=aryNum + 1;
		for(let i = 0; i < 3; i++)
		{
			retVal[i]=this.getHP(DebugUtility.aryRGB[i], rot, aryNum, nextNum);
		}
		return retVal;
	}

	private static getHP(_P:Array<number>, rot:number, aryNum:number, nextNum:number):number
	{
		let retVal:number=0;
		let aryC:number=0;
		let nextC:number=0;
		let rH:number=0;
		aryC=_P[aryNum];
		nextC=_P[nextNum];
		const rotR=(aryC + nextC)/ 60 *(rot - 60 * aryNum);
		rH=Math.floor((_P[nextNum]==0)? aryC - rotR:aryC + rotR);
		retVal=Math.round(Math.min(255, Math.abs(rH)));
		return retVal;
	}

	public static getObjectMemoryHash(obj:any):string
	{
		let memoryHash:string=null;

		try
		{
			// TODO FakeClass
			console.warn("TODO: FakeClass");
			// FakeClass(obj);
		}
		catch(e:any)
		{
			// TODO memoryHash
			console.warn("TODO: memoryHash");
			memoryHash = "TODO: memoryHash";// Std.string(e).replace(/.*([@|\$].*?)to .*$/gi, '$1');
		}

		return memoryHash;
	}
}

/*
class FakeClass
{
}
*/
