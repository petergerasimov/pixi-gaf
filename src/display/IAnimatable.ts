/**
 * @author Mathieu Anthoine
 */
export default interface IAnimatable 
{
  /** Advance the time by a number of seconds. @param time in seconds. */
	advanceTime(time:number):void;
}