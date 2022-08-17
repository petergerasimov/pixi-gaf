import CAnimationSequence from "./CAnimationSequence";

/**
 * AS3 conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CAnimationSequences
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

	private _sequences:Array<CAnimationSequence>;

	private _sequencesStartDictionary:any;
	private _sequencesEndDictionary:any;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor()
	{
		this._sequences=[];

		this._sequencesStartDictionary={};
		this._sequencesEndDictionary={};
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	addSequence(sequence:CAnimationSequence):void
	{
		this._sequences.push(sequence);

		if(!this._sequencesStartDictionary[sequence.startFrameNo])
		{
			this._sequencesStartDictionary[sequence.startFrameNo]=sequence;
		}

		if(!this._sequencesEndDictionary[sequence.endFrameNo])
		{
			this._sequencesEndDictionary[sequence.endFrameNo]=sequence;
		}
	}

	getSequenceStart(frameNo:number):CAnimationSequence
	{
		return this._sequencesStartDictionary[frameNo];
	}

	getSequenceEnd(frameNo:number):CAnimationSequence
	{
		return this._sequencesEndDictionary[frameNo];
	}

	getStartFrameNo(sequenceID:string):number
	{
		const result:number=0;

		for(const sequence of this._sequences)
		{
			if(sequence.id==sequenceID)
			{
				return sequence.startFrameNo;
			}
		}

		return result;
	}

	getSequenceByID(id:string):CAnimationSequence
	{
		for(const sequence of this._sequences)
		{
			if(sequence.id==id)
			{
				return sequence;
			}
		}

		return null;
	}

	getSequenceByFrame(frameNo:number):CAnimationSequence
	{
		for(const [i] of this._sequences.entries())
		{
			if(this._sequences[i].isSequenceFrame(frameNo))
			{
				return this._sequences[i];
			}
		}

		return null;
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

	
 	get sequences():Array<CAnimationSequence>
	{
		return this._sequences;
	}

}