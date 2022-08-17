/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class WarningConstants
{
	public static UNSUPPORTED_FILTERS:string="Unsupported filter in animation";
	public static UNSUPPORTED_FILE:string="You are using an old version of GAF library";
	public static UNSUPPORTED_TAG:string="Unsupported tag found, check for playback library updates";
	public static FILTERS_UNDER_MASK:string="Warning! Animation contains objects with filters under mask! Online preview is not able to display filters applied under masks(flash player technical limitation). All other runtimes will display this correctly.";
	public static REGION_NOT_FOUND:string="In the texture atlas element is missing. This is conversion bug. Please report issue<font color='#0000ff'><u><a href='http://gafmedia.com/contact'>here</a></u></font>and we will fix it(use the Request type - Report Issue).";
}