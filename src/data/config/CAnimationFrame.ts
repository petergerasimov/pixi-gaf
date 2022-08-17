import CAnimationFrameInstance from "./CAnimationFrameInstance";
import CFrameAction from "./CFrameAction";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default class CAnimationFrame
{
	// --------------------------------------------------------------------------
	//
	// PUBLIC VARIABLES
	//
	// --------------------------------------------------------------------------
	// --------------------------------------------------------------------------
	//
	// PRIVATE VARIABLES
	//
	// --------------------------------------------------------------------------
	private _instancesDictionary:Map<String,CAnimationFrameInstance>;
	private _instances:Array<CAnimationFrameInstance>;
	private _actions:Array<CFrameAction>;

	private _frameNumber:number=0;

	// --------------------------------------------------------------------------
	//
	// CONSTRUCTOR
	//
	// --------------------------------------------------------------------------
	constructor(frameNumber:number)
	{
		this._frameNumber=frameNumber;

		this._instancesDictionary=new Map<String,CAnimationFrameInstance>();
		this._instances=[];
	}

	// --------------------------------------------------------------------------
	//
	// PUBLIC METHODS
	//
	// --------------------------------------------------------------------------
	clone(frameNumber:number):CAnimationFrame
	{
		const result:CAnimationFrame=new CAnimationFrame(frameNumber);

		for(const instance of this._instances)
		{
			result.addInstance(instance);
			// .clone());
		}

		return result;
	}

	addInstance(instance:CAnimationFrameInstance):void
	{
		if(this._instancesDictionary[instance.id]!=null)
		{
			if(instance.alpha!=null)
			{
				this._instances[this._instances.indexOf(this._instancesDictionary[instance.id])]=instance;

				this._instancesDictionary[instance.id]=instance;
			}
			else
			{
				// Poping the last element and set it as the removed element
				const index:number=this._instances.indexOf(this._instancesDictionary[instance.id]);
				// If index is last element, just pop
				if(index==(this._instances.length - 1))
				{
					this._instances.pop();
				}
				else
				{
					this._instances[index]=this._instances.pop();
				}

				this._instancesDictionary.delete(instance.id);
			}
		}
		else
		{
			this._instances.push(instance);

			this._instancesDictionary[instance.id]=instance;
		}
	}

	addAction(action:CFrameAction):void
	{
		if (this._actions==null) this._actions = [];
		this._actions.push(action);
	}

	sortInstances():void
	{
		this._instances.sort(this.sortByZIndex);
	}

	getInstanceByID(id:string):CAnimationFrameInstance
	{
		return this._instancesDictionary[id];
	}

	// --------------------------------------------------------------------------
	//
	// PRIVATE METHODS
	//
	// --------------------------------------------------------------------------
	private sortByZIndex(instance1:CAnimationFrameInstance, instance2:CAnimationFrameInstance):number
	{
		if(instance1.zIndex<instance2.zIndex)
		{
			return -1;
		}
		else if(instance1.zIndex>instance2.zIndex)
		{
			return 1;
		}
		else
		{
			return 0;
		}
	}

	// --------------------------------------------------------------------------
	//
	// OVERRIDDEN METHODS
	//
	// --------------------------------------------------------------------------
	// --------------------------------------------------------------------------
	//
	// EVENT HANDLERS
	//
	// --------------------------------------------------------------------------
	// --------------------------------------------------------------------------
	//
	// GETTERS AND SETTERS
	//
	// --------------------------------------------------------------------------
	
 	get instances():Array<CAnimationFrameInstance>
	{
		return this._instances;
	}

	
 	get frameNumber():number
	{
		return this._frameNumber;
	}
	
 	get actions():Array<CFrameAction>
	{
		return this._actions;
	}
}