// import com.github.haxePixiGAF.data.GAFAsset;
// import com.github.haxePixiGAF.data.GAFTimeline;
// import com.github.haxePixiGAF.data.GAFTimelineConfig;
// import com.github.haxePixiGAF.data.config.CAnimationFrame;
// import com.github.haxePixiGAF.data.config.CAnimationFrameInstance;
// import com.github.haxePixiGAF.data.config.CAnimationObject;
// import com.github.haxePixiGAF.data.config.CAnimationSequence;
// import com.github.haxePixiGAF.data.config.CFilter;
// import com.github.haxePixiGAF.data.config.CFrameAction;
// import com.github.haxePixiGAF.data.config.CTextFieldObject;
// import com.github.haxePixiGAF.data.config.CTextureAtlas;
// import com.github.haxePixiGAF.events.GAFEvent;
// import com.github.haxePixiGAF.utils.DebugUtility;
// import haxe.extern.EitherType;
// import js.Browser;
// import pixi.core.display.Container;
// import pixi.core.display.DisplayObject;
// import pixi.core.math.Matrix;
// import pixi.core.math.Point;
// import pixi.core.math.shapes.Rectangle;
// import pixi.interaction.numbereractionEvent;

import { Container, DisplayObject, IDestroyOptions, Matrix, Point, Rectangle } from "pixi.js";
import { MatrixUtility } from "../utils/MatrixUtility";
import { EventEmitterUtility } from "../utils/EventEmitterUtility";
import GAFContainer from "./GAFContainer";
import IGAFDisplayObject from "./IGAFDisplayObject";
import IGAFImage from "./IGAFImage";
import IAnimatable from "./IAnimatable";
import CAnimationFrame from "../data/config/CAnimationFrame";
import CAnimationFrameInstance from "../data/config/CAnimationFrameInstance";
import CAnimationObject from "../data/config/CAnimationObject";
import CAnimationSequence from "../data/config/CAnimationSequence";
import CFrameAction from "../data/config/CFrameAction";
import CTextFieldObject from "../data/config/CTextFieldObject";
import CTextureAtlas from "../data/config/CTextureAtlas";
import GAFAsset from "../data/GAFAsset";
import GAFTimeline from "../data/GAFTimeline";
import GAFTimelineConfig from "../data/GAFTimelineConfig";
import { GAFEvent } from "../events/GAFEvent";
import GAFImage from "./GAFImage";
import GAFScale9Texture from "./GAFScale9Texture";
import GAFTextField from "./GAFTextField";
import IGAFTexture from "./IGAFTexture";

// using com.github.haxePixiGAF.utils.MatrixUtility;
// using com.github.haxePixiGAF.utils.EventEmitterUtility;

/**
 * GAFMovieClip represents animation display object that is ready to be used in Starling display list. It has
 * all controls for animation familiar from standard MovieClip(<code>play</code>,<code>stop</code>,<code>gotoAndPlay,</code>etc.)
 * and some more like<code>loop</code>,<code>nPlay</code>,<code>setSequence</code>that helps manage playback
 */
/**
 * TODO
 * @author Mathieu Anthoine
 */
export default class GAFMovieClip extends GAFContainer implements IAnimatable
{
	/** Dispatched when playhead reached first frame of sequence */
	public static EVENT_TYPE_SEQUENCE_START:string = "typeSequenceStart";
	
	/** Dispatched when playhead reached end frame of sequence */
	public static EVENT_TYPE_SEQUENCE_END:string = "typeSequenceEnd";
	
	/** Dispatched whenever the movie has displayed its last frame. */
	// GAFEvent.COMPLETE

	//--------------------------------------------------------------------------
	//
	//  PUBLIC VARIABLES
	//
	//--------------------------------------------------------------------------

	//--------------------------------------------------------------------------
	//
	//  PRIVATE VARIABLES
	//
	//--------------------------------------------------------------------------

	//TODO TextureSmoothing.BILINEAR
	private _smoothing:string = "";// TextureSmoothing.BILINEAR;

	private _displayObjectsDictionary:Map<string,IGAFDisplayObject>;
	private _stencilMasksDictionary:Map<string,DisplayObject>;
	private _displayObjectsVector:Array<IGAFDisplayObject>;
	private _imagesVector:Array<IGAFImage>;
	private _mcVector:Array<GAFMovieClip>;

	private _playingSequence:CAnimationSequence;
	private _timelineBounds:Rectangle;
	//TODO _boundsAndPivot
	//private _boundsAndPivot:MeshBatch;
	private _config:GAFTimelineConfig;
	private _gafTimeline:GAFTimeline;

	private _loop:boolean=true;
	private _skipFrames:boolean=true;
	private _reset:boolean=false;
	private _masked:boolean=false;
	private _inPlay:boolean=false;
	private _hidden:boolean=false;
	private _reverse:boolean=false;
	private _started:boolean=false;
	private _disposed:boolean=false;
	private _hasFilter:boolean=false;
	private _useClipping:boolean=false;
	private _alphaLessMax:boolean=false;
	private _addToJuggler:boolean=false;

	private _scale:number;
	private _contentScaleFactor:number;
	private _currentTime:number=0;
	// Hold the current time spent animating
	private _lastFrameTime:number=0;
	private _frameDuration:number;
	
	private _previousTime:number=-1;

	private _nextFrame:number=0;
	private _startFrame:number=0;
	private _finalFrame:number=0;
	private _currentFrame:number=0;
	private _totalFrames:number=0;

	private __debugOriginalAlpha:number=null;


	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	//--------------------------------------------------------------------------

	/**
	* Creates a new GAFMovieClip instance.
	*
	* @param gafTimeline<code>GAFTimeline</code>from what<code>GAFMovieClip</code>will be created
	* @param fps defines the frame rate of the movie clip. If not set - the stage config frame rate will be used instead.
	* @param addToJuggler if<code>true - GAFMovieClip</code>will listen<code>requestAnimationFrame</code>
	* and removed automatically on<code>dispose</code>
	*/
	constructor(gafTimeline:GAFTimeline, pFps:number=-1, addToJuggler:boolean=true)
	{
		super();
		
		this._gafTimeline=gafTimeline;
		this._config=gafTimeline.config;
		this._scale=gafTimeline.scale;
		this._contentScaleFactor=gafTimeline.contentScaleFactor;
		this._addToJuggler=addToJuggler;

		this.initialize(gafTimeline.textureAtlas, gafTimeline.gafAsset);

		if(this._config.bounds!=null)
		{
			this._timelineBounds=this._config.bounds.clone();
		}
		if(pFps>0)
		{
			this.fps=pFps;
		}

		this.draw();
	}

	//--------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	//--------------------------------------------------------------------------

	/** 
	* Returns the child display object that exists with the specified ID. Use to obtain animation's parts
	*
	* @param id Child ID
	* @return The child display object with the specified ID
	*/
	getChildByID(id:string):IGAFDisplayObject
	{
		return this._displayObjectsDictionary[id];
	}

	/** 
	* Returns the mask display object that exists with the specified ID. Use to obtain animation's masks
	*
	* @param id Mask ID
	* @return The mask display object with the specified ID
	*/
	getMaskByID(id:string):DisplayObject
	{
		return this._stencilMasksDictionary[id];
	}

	/**
	* Shows mask display object that exists with the specified ID. Used for debug purposes only!
	*
	* @param id Mask ID
	*/
	showMaskByID(id:string):void
	{
		let maskObject:IGAFDisplayObject=this._displayObjectsDictionary[id];
		let maskAsDisplayObject:DisplayObject=cast(maskObject, DisplayObject);
		let stencilMaskObject:DisplayObject=this._stencilMasksDictionary[id];
		if(maskObject!=null && stencilMaskObject!=null)
		{
			maskAsDisplayObject.mask=stencilMaskObject;
			this.addChild(stencilMaskObject);
			this.addChild(maskAsDisplayObject);
		}
		else
		{
			console.warn("WARNING:mask object is missing. It might be disposed.");
		}
	}

	/**
	* Hides mask display object that previously has been shown using<code>showMaskByID</code>method.
	* Used for debug purposes only!
	*
	* @param id Mask ID
	*/
	hideMaskByID(id:string):void
	{
		let maskObject:IGAFDisplayObject=this._displayObjectsDictionary[id];
		let maskAsDisplayObject:DisplayObject=cast(maskObject, DisplayObject);
		let stencilMaskObject:DisplayObject=this._stencilMasksDictionary[id];
		if(stencilMaskObject!=null)
		{
			if(stencilMaskObject.parent==this)
			{
				stencilMaskObject.parent.mask=null;
				this.removeChild(stencilMaskObject);
				this.removeChild(maskAsDisplayObject);
			}
		}
		else
		{
			console.warn("WARNING:mask object is missing. It might be disposed.");
		}
	}

	/**
	* Clear playing sequence. If animation already in play just continue playing without sequence limitation
	*/
	clearSequence():void
	{
		this._playingSequence=null;
	}

	/**
	* Returns id of the sequence where animation is right now. If there is no sequences - returns<code>null</code>.
	*
	* @return id of the sequence
	*/
 	get currentSequence():string
	{
		const sequence:CAnimationSequence=this._config.animationSequences.getSequenceByFrame(this.currentFrame);
		if(sequence!=null)
		{
			return sequence.id;
		}
		return null;
	}

	/**
	* Set sequence to play
	*
	* @param id Sequence ID
	* @param play Play or not immediately.<code>true</code>- starts playing from sequence start frame.<code>false</code>- go to sequence start frame and stop
	* @return sequence to play
	*/
	setSequence(id:string, play:boolean=true):CAnimationSequence
	{
		this._playingSequence=this._config.animationSequences.getSequenceByID(id);

		if(this._playingSequence!=null)
		{
			let startFrame:number=this._reverse ? this._playingSequence.endFrameNo - 1:this._playingSequence.startFrameNo;
			if(play)
			{
				this.gotoAndPlay(startFrame);
			}
			else
			{
				this.gotoAndStop(startFrame);
			}
		}

		return this._playingSequence;
	}

	/**
	* Moves the playhead in the timeline of the movie clip<code>play()</code>or<code>play(false)</code>.
	* Or moves the playhead in the timeline of the movie clip and all child movie clips<code>play(true)</code>.
	* Use<code>play(true)</code>in case when animation contain nested timelines for correct playback right after
	* initialization(like you see in the original swf file).
	* @param applyToAllChildren Specifies whether playhead should be moved in the timeline of the movie clip
	*(<code>false</code>)or also in the timelines of all child movie clips(<code>true</code>).
	*/
	play(applyToAllChildren:boolean=false):void
	{
		
		this._started=true;

		if(applyToAllChildren)
		{
			let i:number=this._mcVector.length;
			while(i-->0)
			{
				this._mcVector[i]._started=true;
			}
		}

		this._play(applyToAllChildren, true);
	}

	/**
	* Stops the playhead in the movie clip<code>stop()</code>or<code>stop(false)</code>.
	* Or stops the playhead in the movie clip and in all child movie clips<code>stop(true)</code>.
	* Use<code>stop(true)</code>in case when animation contain nested timelines for full stop the
	* playhead in the movie clip and in all child movie clips.
	* @param applyToAllChildren Specifies whether playhead should be stopped in the timeline of the
	* movie clip(<code>false</code>)or also in the timelines of all child movie clips(<code>true</code>)
	*/
	stop(applyToAllChildren:boolean=false):void
	{
		
		this._started=false;

		if(applyToAllChildren)
		{
			let i:number=this._mcVector.length;
			while(i-->0)
			{
				this._mcVector[i]._started=false;
			}
		}

		this._stop(applyToAllChildren, true);
	}

	/**
	* Brings the playhead to the specified frame of the movie clip and stops it there. First frame is "1"
	*
	* @param frame A number representing the frame number, or a string representing the label of the frame, to which the playhead is sent.
	*/
	gotoAndStop<Dynamic>(frame:Dynamic):void
	{
		this.checkAndSetCurrentFrame(frame);

		stop();
	}

	/**
	* Starts playing animation at the specified frame. First frame is "1"
	*
	* @param frame A number representing the frame number, or a string representing the label of the frame, to which the playhead is sent.
	*/
	gotoAndPlay<Dynamic>(frame:Dynamic):void
	{
		this.checkAndSetCurrentFrame(frame);

		this.play();
	}

	/**
	* Set the<code>loop</code>value to the GAFMovieClip instance and for the all children.
	*/
	loopAll(loop:boolean):void
	{
		//TODO: loop
		//loop=loop;

		let i:number=this._mcVector.length;
		while(i-- > 0)
		{
			this._mcVector[i].loop=loop;
		}
	}

	/** 
	* Advances all objects by a certain time(in seconds).
	* @see starling.animation.IAnimatable
	*/
	advanceTime(passedTime:number):void
	{
		if (this._previousTime==-1) this._previousTime = passedTime;
		let lTime:number = (passedTime - this._previousTime) / 1000;
		this._previousTime = passedTime;

		if(this._disposed)
		{
			return;
		}
		else if(this._config.disposed)
		{
			this.destroy();
			return;
		}

		if(this._inPlay && this._frameDuration !=Number.POSITIVE_INFINITY)
		{
			this._currentTime +=lTime;

			let framesToPlay:number=((this._currentTime - this._lastFrameTime)/ this._frameDuration) | 0;
			if(this._skipFrames)
			{
				//here we skip the drawing of all frames to be played right now, but the last one
				for(let i = 0;i < framesToPlay;i++)
				{
					if(this._inPlay)
					{
						this.changeCurrentFrame((i + 1)!=framesToPlay);
					}
					else //if a playback was numbererrupted by some action or an event
					{
						if(!this._disposed)
						{
							this.draw();
						}
						break;
					}
				}
			}
			else if(framesToPlay>0)
			{
				this.changeCurrentFrame(false);
			}
		}
		if(this._mcVector!=null)
		{
			for(const i in this._mcVector)
			{
				this._mcVector[i].advanceTime(passedTime);
			}
		}
		
		if (this._addToJuggler) requestAnimationFrame(this.advanceTime);
	}

	/** Shows bounds of a whole animation with a pivot point.
	* Used for debug purposes.
	*/
	showBounds(value:boolean):void
	{
		if(this._config.bounds!=null)
		{
			//TODO showBounds
			console.warn("TODO showBounds");
			
			//if(!_boundsAndPivot)
			//{
				//_boundsAndPivot=new MeshBatch();
				//updateBounds(_config.bounds);
			//}
//
			//if(value)
			//{
				//addChild(_boundsAndPivot);
			//}
			//else
			//{
				//removeChild(_boundsAndPivot);
			//}
		}
	}

	/**
	* Creates a new instance of GAFMovieClip.
	*/
	copy():GAFMovieClip
	{
		return new GAFMovieClip(this._gafTimeline, this.fps | 0 , this._addToJuggler);
	}
	
	/**
	* give access to fields created dynamically
	* @param	
	*/

	
	getField (pName:string) {
		if (!Reflect.hasField(this, pName)) throw "Field "+pName+" does not exist.";
		return Reflect.field(this,pName);
	}
	
	//--------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	private _gotoAndStop<Dynamic>(frame:Dynamic):void
	{
		this.checkAndSetCurrentFrame(frame);

		this._stop();
	}

	private _play(applyToAllChildren:boolean=false, calledByUser:boolean=false):void
	{
		if(this._inPlay && !applyToAllChildren)
		{
			return;
		}

		let i:number=0, l:number=0;

		if(this._totalFrames>1)
		{
			this._inPlay=true;
		}

		if(applyToAllChildren && this._config.animationConfigFrames.frames.length>0)
		{
			let frameConfig:CAnimationFrame=this._config.animationConfigFrames.frames[this._currentFrame];
			if(frameConfig.actions!=null)
			{
				let action:CFrameAction;
				let l:number = frameConfig.actions.length;
				for(let i = 0; i < l; i++)
				{
					action=frameConfig.actions[i];
					if(action.type==CFrameAction.STOP
							||(action.type==CFrameAction.GOTO_AND_STOP
							&& Number(action.params[0])==this.currentFrame))
					{
						this._inPlay=false;
						return;
					}
				}
			}

			let child:Container;
			let childMC:GAFMovieClip;
			l = this.children.length;
			for(let i = 0; i < l; i++)
			{
				child=this.getChildAt(i) as Container;
				if(child instanceof GAFMovieClip)
				{
					childMC = child;
					if(calledByUser)
					{
						childMC.play(true);
					}
					else
					{
						childMC._play(true);
					}
				}
			}
		}

		this.runActions();

		this._reset=false;
	}

	private _stop(applyToAllChildren:boolean=false, calledByUser:boolean=false):void
	{
		this._inPlay=false;

		if(applyToAllChildren
		&& this._config.animationConfigFrames.frames.length>0)
		{
			for(const child of this.children)
			{
				if(child instanceof GAFMovieClip)
				{
					if(calledByUser)
					{
						child.stop(true);
					}
					else
					{
						child._stop(true);
					}
				}
			}
		}
	}

	private checkPlaybackEvents():void
	{
		let sequence:CAnimationSequence;
		if(EventEmitterUtility.hasEventListener(GAFMovieClip.EVENT_TYPE_SEQUENCE_START))
		{
			sequence=this._config.animationSequences.getSequenceStart(this._currentFrame + 1);
			if(sequence!=null)
			{
				this.emit(GAFMovieClip.EVENT_TYPE_SEQUENCE_START,{target:this,bubbles:false,data:sequence});
			}
		}
		if(EventEmitterUtility.hasEventListener(GAFMovieClip.EVENT_TYPE_SEQUENCE_END))
		{
			sequence=this._config.animationSequences.getSequenceEnd(this._currentFrame + 1);
			if(sequence!=null)
			{
				this.emit(GAFMovieClip.EVENT_TYPE_SEQUENCE_END,{target:this,bubbles:false,data:sequence});
			}
		}
		if(EventEmitterUtility.hasEventListener(GAFEvent.COMPLETE))
		{
			if(this._currentFrame==this._finalFrame)
			{
				this.emit(GAFEvent.COMPLETE);
			}
		}
		
	}

	private runActions():void
	{
		if(this._config.animationConfigFrames.frames.length==0)
		{
			return;
		}

		const actions:Array<CFrameAction> = this._config.animationConfigFrames.frames[this._currentFrame].actions;
		if(actions!=null)
		{
			for(const action of actions)
			{
				switch(action.type)
				{
					case CFrameAction.STOP:
						stop();
					case CFrameAction.PLAY:
						this.play();
					case CFrameAction.GOTO_AND_STOP:
						this.gotoAndStop(action.params[0]);
					case CFrameAction.GOTO_AND_PLAY:
						this.gotoAndPlay(action.params[0]);
					case CFrameAction.DISPATCH_EVENT:
						let actionType:string=action.params[0];
						if(EventEmitterUtility.hasEventListener(actionType))
						{
							let bubbles:boolean= false;
							let data:any=null;
							
							switch(action.params.length)
							{
								case 4:
									data=action.params[3];
								case 3:
									// cancelable param is not used
									bubbles=cast(action.params[1],Bool);
								case 2:
									bubbles=cast(action.params[1],Bool);
							}
							this.emit(actionType, {target:this,bubbles:bubbles, data:data});
						}
						//if(actionType==CSound.GAF_PLAY_SOUND && GAF.autoPlaySounds)
						//{
							//_gafTimeline.startSound(currentFrame);
						//}
				}
			}
		}
	}

	private checkAndSetCurrentFrame(frame:Dynamic):void
	{
		if (Std.is(frame,number) && cast(frame,number) > 0)
		{
			if(frame>this._totalFrames)
			{
				frame=this._totalFrames;
			}
		}
		else if(Std.is(frame, string))
		{
			let label:string=frame;
			frame=this._config.animationSequences.getStartFrameNo(label);

			if(frame==0)
			{
				throw "Frame label " + label + " not found";
			}
		}
		else
		{
			frame=1;
		}

		if(this._playingSequence!=null && !this._playingSequence.isSequenceFrame(frame))
		{
			this._playingSequence=null;
		}

		if(this._currentFrame !=frame - 1)
		{
			this._currentFrame=cast(frame,number) - 1;
			this.runActions();
			//actions may numbererrupt playback and lead to content disposition
			if(!this._disposed)
			{
				this.draw();
			}
		}
	}

	private clearDisplayList():void
	{
		this.removeChildren();
	}

	private draw():void
	{
		
		let i:number=0;
		let l:number=0;

		if(this._config.debugRegions!=null)
		{
			// Non optimized way when there are debug regions
			this.clearDisplayList();
		}
		else
		{
			// Just hide the children to avoid dispatching a lot of events and alloc temporary arrays
			let l:number = this._displayObjectsVector.length;
			for(i in 0...l)
			{
				this._displayObjectsVector[i].alpha=0;
			}

			l = this._mcVector.length;
			
			for(i in 0...l)
			{
				this._mcVector[i]._hidden=true;
			}
		}

		let frames:Array<CAnimationFrame>=this._config.animationConfigFrames.frames;
		if(frames.length>this._currentFrame)
		{
			let mc:GAFMovieClip;
			let objectPivotMatrix:Matrix;
			let displayObject:IGAFDisplayObject;
			let instance:CAnimationFrameInstance;
			let stencilMaskObject:DisplayObject;

			let animationObjectsDictionary:Map<string,CAnimationObject>=this._config.animationObjects.animationObjectsDictionary;
			let frameConfig:CAnimationFrame=frames[this._currentFrame];
			let instances:Array<CAnimationFrameInstance>=frameConfig.instances;
			l=instances.length;
			i=0;
			while(i<l)
			{
				instance=instances[i++];

				displayObject = this._displayObjectsDictionary[instance.id];
				
				if(displayObject!=null)
				{
					objectPivotMatrix=this.getTransformMatrix(displayObject, GAFContainer.HELPER_MATRIX);
					if (Std.is(displayObject, GAFMovieClip)) mc = cast(displayObject, GAFMovieClip);
					else mc = null;
					
					if(mc!=null)
					{
						if(instance.alpha<0)
						{
							mc.reset();
						}
						else if(mc._reset && mc._started)
						{
							mc._play(true);
						}
						mc._hidden=false;
					}

					if(instance.alpha<=0)
					{
						continue;
					}

					displayObject.alpha=instance.alpha;

					//if display object is not a mask
					if(!animationObjectsDictionary[instance.id].mask)
					{
						
						
						//if display object is under mask
						if(instance.maskID!="")
						{
							
							this.renderDebug(mc, instance, true);
							
							stencilMaskObject=this._stencilMasksDictionary[instance.maskID];
							
							if(stencilMaskObject!=null)
							{
								instance.applyTransformMatrix(displayObject.transformationMatrix, objectPivotMatrix, this._scale);
								displayObject.invalidateOrientation();
								
								cast(displayObject, DisplayObject).mask = stencilMaskObject;
								
								this.addChild(stencilMaskObject);
								this.addChild(cast(displayObject, DisplayObject));
								
							}
						}
						else //if display object is not masked
						{
							this.renderDebug(mc, instance, this._masked);
							instance.applyTransformMatrix(displayObject.transformationMatrix, objectPivotMatrix, this._scale);
							displayObject.invalidateOrientation();														
							displayObject.setFilterConfig(instance.filter, this._scale);
							this.addChild(cast(displayObject,DisplayObject));						
							
						}

						if(mc!=null && mc._started)
						{
							mc._play(true);
						}

						if(DebugUtility.RENDERING_DEBUG && Std.is(displayObject,IGAFDebug))
						{
							let colors:Array<number>=DebugUtility.getRenderingDifficultyColor(instance, this._alphaLessMax, this._masked, this._hasFilter);
							cast(displayObject,IGAFDebug).debugColors=colors;
						}
					}
					else
					{
					
						let maskObject:IGAFDisplayObject=this._displayObjectsDictionary[instance.id];
						if(maskObject!=null)
						{
							let maskInstance:CAnimationFrameInstance=frameConfig.getInstanceByID(instance.id);
							if(maskInstance!=null)
							{
								this.getTransformMatrix(maskObject, GAFContainer.HELPER_MATRIX);
								maskInstance.applyTransformMatrix(maskObject.transformationMatrix, GAFContainer.HELPER_MATRIX, this._scale);
								maskObject.invalidateOrientation();
							}
							else
							{
								throw "Unable to find mask with ID " + instance.id;
							}

							if (Std.is(maskObject, GAFMovieClip)) mc = cast(maskObject, GAFMovieClip);
							else mc = null;
							
							
							if(mc!=null && mc._started)
							{
								mc._play(true);
							}
						}
					}
				}
			}
		}

		if(this._config.debugRegions!=null)
		{
			this.addDebugRegions();
		}

		this.checkPlaybackEvents();
	}

	private renderDebug(mc:GAFMovieClip, instance:CAnimationFrameInstance, masked:boolean):void
	{

		if(DebugUtility.RENDERING_DEBUG && mc!=null)
		{
			//TODO renderDebug
			trace ("TODO renderDebug");
			//let hasFilter:boolean=(instance.filter !=null)|| _hasFilter;
			////let alphaLessMax:boolean=instance.alpha<GAF.maxAlpha || _alphaLessMax;
			//let alphaLessMax:boolean=instance.alpha<GAF.maxAlpha || _alphaLessMax;
			//
			//let changed:boolean=false;
			//if(mc._alphaLessMax !=alphaLessMax)
			//{
				//mc._alphaLessMax=alphaLessMax;
				//changed=true;
			//}
			//if(mc._masked !=masked)
			//{
				//mc._masked=masked;
				//changed=true;
			//}
			//if(mc._hasFilter !=hasFilter)
			//{
				//mc._hasFilter=hasFilter;
				//changed=true;
			//}
			//if(changed)
			//{
				//mc.draw();
			//}
		}
	}

	private addDebugRegions():void
	{
		//TODO addDebugRegions
		trace ("TODO addDebugRegions");
		
		//let debugView:Quad;
		//for (debugRegion in _config.debugRegions)
		//{
			//switch(debugRegion.type)
			//{
				//case GAFDebugInformation.TYPE_POINT:
					//debugView=new Quad(4, 4, debugRegion.color);
					//debugView.x=debugRegion.point.x - 2;
					//debugView.y=debugRegion.point.y - 2;
					//debugView.alpha=debugRegion.alpha;
					//break;
				//case GAFDebugInformation.TYPE_RECT:
					//debugView=new Quad(debugRegion.rect.width, debugRegion.rect.height, debugRegion.color);
					//debugView.x=debugRegion.rect.x;
					//debugView.y=debugRegion.rect.y;
					//debugView.alpha=debugRegion.alpha;
					//break;
			//}
//
			//addChild(debugView);
		//}
	}

	private reset():void
	{
		this._gotoAndStop((this._reverse ? this._finalFrame:this._startFrame)+ 1);
		this._reset=true;
		this._currentTime=0;
		this._lastFrameTime=0;

		let i:number=this._mcVector.length;
		while(i-->0)
		{
			this._mcVector[i].reset();
		}
	}
	
	private initialize(textureAtlas:CTextureAtlas, gafAsset:GAFAsset):void
	{
		this._displayObjectsDictionary=new Map<string,IGAFDisplayObject>();
		this._stencilMasksDictionary=new Map<string,DisplayObject>();
		this._displayObjectsVector=[];
		this._imagesVector=[];
		this._mcVector=[];

		this._currentFrame=0;
		this._totalFrames = this._config.framesCount;
		this.fps=this._config.stageConfig!=null ? this._config.stageConfig.fps: 60;

		let animationObjectsDictionary:Map<string,CAnimationObject>=this._config.animationObjects.animationObjectsDictionary;

		let displayObject:DisplayObject=null;
		
		for (animationObjectConfig in animationObjectsDictionary)
		{
			
			switch(animationObjectConfig.type)
			{
				case CAnimationObject.TYPE_TEXTURE:
					
					let texture:IGAFTexture = textureAtlas.getTexture(animationObjectConfig.regionID);
					
					if(Std.is(texture, GAFScale9Texture) && !animationObjectConfig.mask)// GAFScale9Image doesn't work as mask
					{
						//TODO initialize GAFScale9Texture
						trace ("TODO initialize GAFScale9Texture");
						//displayObject=new GAFScale9Image(cast(texture,GAFScale9Texture));
					}
					else
					{
						displayObject = new GAFImage(texture);
						cast(displayObject,GAFImage).textureSmoothing=this._smoothing;
					}
				case CAnimationObject.TYPE_TEXTFIELD:
					let tfObj:CTextFieldObject=this._config.textFields.textFieldObjectsDictionary[animationObjectConfig.regionID];
					displayObject = new GAFTextField(tfObj, this._scale, this._contentScaleFactor);
				case CAnimationObject.TYPE_TIMELINE:
					let timeline:GAFTimeline=gafAsset.getGAFTimelineByID(animationObjectConfig.regionID);
					displayObject=new GAFMovieClip(timeline, Std.int(this.fps), false);
			}

			if(animationObjectConfig.maxSize!=null && Std.is(displayObject,IMaxSize))
			{
				let maxSize:Point=new Point(
						animationObjectConfig.maxSize.x * this._scale,
						animationObjectConfig.maxSize.y * this._scale);
				cast(displayObject,IMaxSize).maxSize=maxSize;
			}

			this.addDisplayObject(animationObjectConfig.instanceID, displayObject);
			if(animationObjectConfig.mask)
			{
				this.addDisplayObject(animationObjectConfig.instanceID, displayObject, true);
			}

			if(this._config.namedParts !=null)
			{
				let instanceName:string=this._config.namedParts[animationObjectConfig.instanceID];
				if (instanceName != null)
				{
					if(!Reflect.hasField(this, instanceName))
					{
						Reflect.setField(this, this._config.namedParts[animationObjectConfig.instanceID], displayObject);
					}
					displayObject.name=instanceName;
				}
			}
		}

		if(this._addToJuggler)
		{
			requestAnimationFrame(this.advanceTime);
		}
	}

	private addDisplayObject(id:string, displayObject:DisplayObject, asMask:boolean=false):void
	{
		if(asMask)
		{
			this._stencilMasksDictionary[id] = displayObject;
		}
		else
		{
			this._displayObjectsDictionary[id]=cast(displayObject,IGAFDisplayObject);
			this._displayObjectsVector[this._displayObjectsVector.length]=cast(displayObject, IGAFDisplayObject);
			if(Std.is(displayObject, IGAFImage))
			{
				this._imagesVector[this._imagesVector.length]=cast(displayObject, IGAFImage);
			}
			else if(Std.is(displayObject, GAFMovieClip))
			{
				this._mcVector[this._mcVector.length]=cast(displayObject, GAFMovieClip);
			}
		}
	}

	private updateBounds(bounds:Rectangle):void
	{
		//TODO updateBounds
		console.warn("TODO updateBounds");
		
		//_boundsAndPivot.clear();
		////bounds
		//if(bounds.width>0 &&  bounds.height>0)
		//{
			//let quad:Quad=new Quad(bounds.width * _scale, 2, 0xff0000);
			//quad.x=bounds.x * _scale;
			//quad.y=bounds.y * _scale;
			//_boundsAndPivot.addMesh(quad);
			//quad=new Quad(bounds.width * _scale, 2, 0xff0000);
			//quad.x=bounds.x * _scale;
			//quad.y=bounds.bottom * _scale - 2;
			//_boundsAndPivot.addMesh(quad);
			//quad=new Quad(2, bounds.height * _scale, 0xff0000);
			//quad.x=bounds.x * _scale;
			//quad.y=bounds.y * _scale;
			//_boundsAndPivot.addMesh(quad);
			//quad=new Quad(2, bounds.height * _scale, 0xff0000);
			//quad.x=bounds.right * _scale - 2;
			//quad.y=bounds.y * _scale;
			//_boundsAndPivot.addMesh(quad);
		//}
		////pivot point
		//quad=new Quad(5, 5, 0xff0000);
		//_boundsAndPivot.addMesh(quad);
	}


	__debugHighlight():void
	{

		if(Number.isNaN(this.__debugOriginalAlpha))
		{
			this.__debugOriginalAlpha=alpha;
		}
		this.alpha = 1;
	}

	__debugLowlight():void
	{

		if(Number.isNaN(this.__debugOriginalAlpha))
		{
			this.__debugOriginalAlpha=alpha;
		}
		this.alpha = .05;
	}

	__debugResetLight():void
	{

		if(!Number.isNaN(this.__debugOriginalAlpha))
		{
			this.alpha = this.__debugOriginalAlpha;
			this.__debugOriginalAlpha=null;
		}
	}

	//--------------------------------------------------------------------------
	//
	// OVERRIDDEN METHODS
	//
	//--------------------------------------------------------------------------

	/** Removes a child at a certain index. The index positions of any display objects above
	*  the child are decreased by 1. If requested, the child will be disposed right away. */
	override removeChildAt(index:number/*, dispose:boolean=false*/):DisplayObject
	{
		//TODO: removeChildAt
		console.warn("TODO: removeChildAt");
		
		//if(dispose)
		//{
			//let key:string;
			//let instanceName:string;
			//let child:DisplayObject=getChildAt(index);
			//if(Std.is(child, IGAFDisplayObject))
			//{
				//let id:number=_mcVector.indexOf(cast(child,GAFMovieClip));
				//if(id>=0)
				//{
					//_mcVector.splice(id, 1);
				//}
				//id=_imagesVector.indexOf(cast(child,IGAFImage));
				//if(id>=0)
				//{
					//_imagesVector.splice(id, 1);
				//}
				//id=_displayObjectsVector.indexOf(cast(child,IGAFDisplayObject));
				//if(id>=0)
				//{
					//_displayObjectsVector.splice(id, 1);
//
					//for(key in _displayObjectsDictionary.keys())
					//{
						//if(_displayObjectsDictionary[key]==child)
						//{
							//if(_config.namedParts !=null)
							//{
								//instanceName=_config.namedParts[key];
								//if(instanceName!=null && Reflect.hasField(this,instanceName))
								//{
									////delete this[instanceName];
									//Reflect.deleteField(this, instanceName);
								//}
							//}
//
							////delete _displayObjectsDictionary[key];
							//_displayObjectsDictionary[key] = null;
							//break;
						//}
					//}
				//}
//
				//for(key in _stencilMasksDictionary.keys())
				//{
					//if(_stencilMasksDictionary[key]==child)
					//{
						//if(_config.namedParts !=null)
						//{
							//instanceName=_config.namedParts[key];
							//if(instanceName!=null && Reflect.hasField(this,instanceName))
							//{
								////delete this[instanceName];
								//Reflect.deleteField(this, instanceName);
							//}
						//}
//
						////delete _stencilMasksDictionary[key];
						//_stencilMasksDictionary[key]=null;
						//break;
					//}
				//}
			//}
		//}

		//return super.removeChildAt(index, dispose);
		this.getChildAt(index).destroy();
		return super.removeChildAt(index);
	}

	/** Returns a child object with a certain name(non-recursively). */
	override getChildByName(name:string):DisplayObject
	{
		let numChildren:number=this._displayObjectsVector.length;
		for(i in 0...numChildren)
			if(this._displayObjectsVector[i].name==name)
				return cast(this._displayObjectsVector[i],DisplayObject);
		return super.getChildByName(name);
	}

	/**
	* Disposes all resources of the display object instance. Note:this method won't delete used texture atlases from GPU memory.
	* To delete texture atlases from GPU memory use<code>unloadFromVideoMemory()</code>method for<code>GAFTimeline</code>instance
	* from what<code>GAFMovieClip</code>was instantiated.
	* Call this method every time before delete no longer required instance! Otherwise GPU memory leak may occur!
	*/	
	override  destroy(options?: boolean | IDestroyOptions):void
	{
		//TODO destroy
		
		if(this._disposed)
		{
			return;
		}
		stop();

		let l:number=this._displayObjectsVector.length;
		for(i in 0...l)
		{
			this._displayObjectsVector[i].destroy();
		}

		for(lMask in this._stencilMasksDictionary)
		{
			lMask.destroy();
		}
//
		//if(_boundsAndPivot)
		//{
			//_boundsAndPivot.dispose();
			//_boundsAndPivot=null;
		//}

		this._displayObjectsDictionary=null;
		this._stencilMasksDictionary=null;
		this._displayObjectsVector=null;
		this._imagesVector=null;
		this._gafTimeline=null;
		this._mcVector=null;
		this._config=null;

		if(parent!=null)
		{
			parent.removeChild(this);
		}
		super.destroy(options);

		this._disposed=true;
	}

	//--------------------------------------------------------------------------
	//
	//  EVENT HANDLERS
	//
	//--------------------------------------------------------------------------

	private changeCurrentFrame(isSkipping:boolean):void
	{
		this._nextFrame=this._currentFrame +(this._reverse ? -1:1);
		this._startFrame=(this._playingSequence!=null ? this._playingSequence.startFrameNo:1)- 1;
		this._finalFrame=(this._playingSequence!=null ? this._playingSequence.endFrameNo:this._totalFrames)- 1;

		if(this._nextFrame>=this._startFrame && this._nextFrame<=this._finalFrame)
		{
			this._currentFrame=this._nextFrame;
			this._lastFrameTime +=this._frameDuration;
		}
		else
		{
			if(!this._loop)
			{
				stop();
			}
			else
			{
				this._currentFrame=this._reverse ? this._finalFrame:this._startFrame;
				this._lastFrameTime +=this._frameDuration;
				let resetInvisibleChildren:boolean=true;
			}
		}

		this.runActions();

		//actions may numbererrupt playback and lead to content disposition
		if(this._disposed)
		{
			return;
		}
		else if(this._config.disposed)
		{
			this.destroy();
			return;
		}

		if(!isSkipping)
		{
			// Draw will trigger events if any
			this.draw();
		}
		else
		{
			this.checkPlaybackEvents();
		}

		//if(resetInvisibleChildren)
		//{
			////reset timelines that aren't visible
			//let i:number=_mcVector.length;
			//while(i-->0)
			//{
				//if(_mcVector[i]._hidden)
				//{
					//_mcVector[i].reset();
				//}
			//}
		//}
	}

	//--------------------------------------------------------------------------
	//
	//  GETTERS AND SETTERS
	//
	//--------------------------------------------------------------------------

	/**
	* Specifies the number of the frame in which the playhead is located in the timeline of the GAFMovieClip instance. First frame is "1"
	*/
	get currentFrame():number
	{
		return this._currentFrame + 1;// Like in standart AS3 API for MovieClip first frame is "1" instead of "0"(but numberernally used "0")
	}

	/**
	* The total number of frames in the GAFMovieClip instance.
	*/
	get totalFrames():number
	{
		return this._totalFrames;
	}

	/**
	* Indicates whether GAFMovieClip instance already in play
	*/
	get inPlay():boolean
	{
		return this._inPlay;
	}

	/**
	* Indicates whether GAFMovieClip instance continue playing from start frame after playback reached animation end
	*/
	get loop():boolean
	{
		return this._loop;
	}

	//@:keep
	set loop(loop:boolean):boolean
	{
		this._loop=loop;
	}

	/**
	* The smoothing filter that is used for the texture. Possible values are<code>TextureSmoothing.BILINEAR, TextureSmoothing.NONE, TextureSmoothing.TRILINEAR</code>
	*/
	//@:keep
	set smoothing(value:string):string
	{
		//if(TextureSmoothing.isValid(value))
		//{
			//_smoothing=value;
//
			//let i:number=_imagesVector.length;
			//while(i-->0)
			//{
				//_imagesVector[i].textureSmoothing=_smoothing;
			//}
		//}
	}

	get smoothing():string
	{
		return null;// _smoothing;
	}

	get useClipping():boolean
	{
		return this._useClipping;
	}



	/**
	* if set<code>true</code>-<code>GAFMivieclip</code>will be clipped with flash stage dimensions
	*/
	//@:keep
	set useClipping(value:boolean):boolean
	{
		this._useClipping=value;

		if(this._useClipping && this._config.stageConfig!=null)
		{
			//mask=new Quad(_config.stageConfig.width * _scale, _config.stageConfig.height * _scale);
		}
		else
		{
			this.mask=null;
		}
	}

 	get fps():number
	{
		if(this._frameDuration==Number.POSITIVE_INFINITY)
		{
			return 0;
		}
		return 1 / this._frameDuration;
	}

	/**
	* Sets an individual frame rate for<code>GAFMovieClip</code>. If this value is lower than stage fps -  the<code>GAFMovieClip</code>will skip frames.
	*/
	//@:keep
	set fps(value:number):number
	{
		if(value<=0)
		{
			this._frameDuration=Number.POSITIVE_INFINITY;
		}
		else
		{
			this._frameDuration=1 / value;
		}

		let i:number=this._mcVector.length;
		while(i-->0)
		{
			this._mcVector[i].fps=value;
		}
		
	}

 	get reverse():boolean
	{
		return this._reverse;
	}

	/**
	* If<code>true</code>animation will be playing in reverse mode
	*/
	//@:keep
	set reverse(value:boolean):boolean
	{
		this._reverse=value;

		let i:number=this._mcVector.length;
		while(i-->0)
		{
			this._mcVector[i]._reverse=value;
		}
	}

 	get skipFrames():boolean
	{
		return this._skipFrames;
	}

	/**
	* Indicates whether GAFMovieClip instance should skip frames when application fps drops down or play every frame not depending on application fps.
	* Value false will force GAFMovieClip to play each frame not depending on application fps(the same behavior as in regular Flash Movie Clip).
	* Value true will force GAFMovieClip to play animation "in time". And when application fps drops down it will start skipping frames(default behavior).
	*/
	//@:keep
	set skipFrames(value:boolean):boolean
	{
		this._skipFrames=value;

		let i:number=this._mcVector.length;
		while(i-->0)
		{
			this._mcVector[i]._skipFrames=value;
		}
	}


	
	//--------------------------------------------------------------------------
	//
	//  STATIC METHODS
	//
	//--------------------------------------------------------------------------

	//[Inline]
	private static getTransformMatrix(displayObject:IGAFDisplayObject, matrix:Matrix):Matrix
	{
		matrix.copyFrom(displayObject.pivotMatrix);
		return matrix;
	}
}