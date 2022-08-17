/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class ErrorConstants
{
	public static SCALE_NOT_FOUND:string=" scale was not found in GAF config";
	public static ATLAS_NOT_FOUND:string="There is no texture atlas file '";
	public static FILE_NOT_FOUND:string="File or directory not found:'";
	public static GAF_NOT_FOUND:string="No GAF animation files found";
	public static CSF_NOT_FOUND:string=" CSF was not found in GAF config";
	public static TIMELINES_NOT_FOUND:string="No animations found.";
	public static EMPTY_ZIP:string="zero file count in zip";
	public static ERROR_LOADING:string="Error occured while loading ";
	public static ERROR_PARSING:string="GAF parse error";
	public static UNSUPPORTED_JSON:string="JSON format is no longer supported";
	public static UNKNOWN_FORMAT:string="Unknown data format.";
}