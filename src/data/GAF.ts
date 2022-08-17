/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * The GAF class defines global GAF library settings
 */
export default class GAF
{
	/**
	* Optimize draw calls when animation contain mixed objects with alpha &lt;1 and with alpha=1.
	* This is done by setting alpha=0.99 for all objects that has alpha=1.
	* In this case all objects will be rendered by one draw call.
	* When use99alpha=false the number of draw call may be much more
	*(the number of draw calls depends on objects order in display list)
	*/
	public static use99alpha:boolean=false;

	/**
	* Play sounds, triggered by the event "gafPlaySound" in a frame of the GAFMovieClip.
	*/
	public static autoPlaySounds:boolean=true;

	/**
	* Indicates if mipMaps will be created for PNG textures(or enabled for ATF textures).
	*/
	public static useMipMaps:boolean=false;

	public static useDeviceFonts:boolean=false;

 	static get maxAlpha():number
	{
		return GAF.use99alpha ? 0.99:1;
	}
}