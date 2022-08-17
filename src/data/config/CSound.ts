/**
 * TODO
 * @author Mathieu Anthoine
 * 
 */
export default class CSound
{
	public static GAF_PLAY_SOUND:string="gafPlaySound";
	public static WAV:number=0;
	public static MP3:number=1;

	soundID:number=0;
	linkageName:string;
	source:string;
	format:number=0;
	rate:number=0;
	sampleSize:number=0;
	sampleCount:number=0;
	stereo:boolean=false;
	// public var sound:Sound;
}