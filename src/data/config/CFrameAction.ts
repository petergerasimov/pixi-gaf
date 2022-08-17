/**
 * AS3 conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CFrameAction
{
	type:number=0;
	scope:string;
	params:Array<String>=[];
	
	public static STOP:number=0;
	public static PLAY:number=1;
	public static GOTO_AND_STOP:number=2;
	public static GOTO_AND_PLAY:number=3;
	public static DISPATCH_EVENT:number = 4;
	
	new () {}
}