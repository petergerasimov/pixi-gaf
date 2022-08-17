/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * Data object that describe sequence
 */
export default class CAnimationSequence
{
	// --------------------------------------------------------------------------
	//
	//  PUBLIC VARIABLES
	//
	// --------------------------------------------------------------------------

	// --------------------------------------------------------------------------
	//
	//  PRIVATE VARIABLES
	//
	// --------------------------------------------------------------------------

	private _id:string;
	private _startFrameNo:number=0;
	private _endFrameNo:number=0;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor(id:string, startFrameNo:number, endFrameNo:number)
	{
		this._id=id;
		this._startFrameNo=startFrameNo;
		this._endFrameNo=endFrameNo;
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	isSequenceFrame(frameNo:number):boolean
	{
		// first frame is "1" !!!

		if(frameNo>=this._startFrameNo && frameNo<=this._endFrameNo)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	// --------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	// --------------------------------------------------------------------------
	//
	// OVERRIDDEN METHODS
	//
	// --------------------------------------------------------------------------

	// --------------------------------------------------------------------------
	//
	//  EVENT HANDLERS
	//
	// --------------------------------------------------------------------------

	// --------------------------------------------------------------------------
	//
	//  GETTERS AND SETTERS
	//
	// --------------------------------------------------------------------------

	/**
	* Sequence ID
	* @return Sequence ID
	*/
	
 	get id():string
	{
		return this._id;
	}

	/**
	* Sequence start frame number
	* @return Sequence start frame number
	*/
	
 	get startFrameNo():number
	{
		return this._startFrameNo;
	}

	/**
	* Sequence end frame number
	* @return Sequence end frame number
	*/
	
 	get endFrameNo():number
	{
		return this._endFrameNo;
	}

}