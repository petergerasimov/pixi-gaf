/* eslint-disable no-unused-vars */
import { utils, Matrix, Point, TextStyle, TextStyleAlign } from "pixi.js";
import { Rectangle } from "@pixi/math";
// eslint-disable-next-line no-unused-vars
import mathExtras from "@pixi/math-extras";
import { GAFEvent } from "../../events/GAFEvent";
import TextFormatAlign from "../../text/TextFormatAlign";
import GAFBytesInput from "../../utils/GAFBytesInput";
import { MathUtility } from "../../utils/MathUtility";
import CAnimationFrame from "../config/CAnimationFrame";
import CAnimationFrameInstance from "../config/CAnimationFrameInstance";
import CAnimationObject from "../config/CAnimationObject";
import CAnimationSequence from "../config/CAnimationSequence";
import CBlurFilterData from "../config/CBlurFilterData";
import CFilter from "../config/CFilter";
import CFrameAction from "../config/CFrameAction";
import CSound from "../config/CSound";
import CStage from "../config/CStage";
import CTextFieldObject from "../config/CTextFieldObject";
import CTextureAtlasCSF from "../config/CTextureAtlasCSF";
import CTextureAtlasElement from "../config/CTextureAtlasElement";
import CTextureAtlasElements from "../config/CTextureAtlasElements";
import CTextureAtlasScale from "../config/CTextureAtlasScale";
import CTextureAtlasSource from "../config/CTextureAtlasSource";
import GAF from "../GAF";
import GAFAssetConfig from "../GAFAssetConfig";
import GAFTimelineConfig from "../GAFTimelineConfig";
import ErrorConstants from "./ErrorConstants";
import WarningConstants from "./WarningConstants";
import { EventEmitterUtility } from "../../utils/EventEmitterUtility";

const enum TAGS {
	END,
	DEFINE_ATLAS,
	DEFINE_ANIMATION_MASKS,
	DEFINE_ANIMATION_OBJECTS,
	DEFINE_ANIMATION_FRAMES,
	DEFINE_NAMED_PARTS,
	DEFINE_SEQUENCES,
	DEFINE_TEXT_FIELDS,
	DEFINE_ATLAS2,
	DEFINE_STAGE,
	DEFINE_ANIMATION_OBJECTS2,
	DEFINE_ANIMATION_MASKS2,
	DEFINE_ANIMATION_FRAMES2,
	DEFINE_TIMELINE,
	DEFINE_SOUNDS,
	DEFINE_ATLAS3
};
/**
 * TODO
 * @author Mathieu Anthoine
 */
export default class BinGAFAssetConfigConverter extends utils.EventEmitter
{

	private static SIGNATURE_GAC:number=0x00474143;	
	
	// tags

	// filters
	private static FILTER_DROP_SHADOW:number=0;
	private static FILTER_BLUR:number=1;
	private static FILTER_GLOW:number=2;
	private static FILTER_COLOR_MATRIX:number=6;	
	
	private static sHelperRectangle:Rectangle=new Rectangle(0,0,0,0);
	private static sHelperMatrix:Matrix=new Matrix();	
	
	private _assetID:string;
	private _bytes:GAFBytesInput;
	private _defaultScale:number;
	private _defaultContentScaleFactor:number;
	private _config:GAFAssetConfig;
	private _textureElementSizes:Array<Rectangle>;// Point by texture element id


	private _isTimeline:boolean=false;
	private _currentTimeline:GAFTimelineConfig;
	private _async:boolean=false;
	private _ignoreSounds:boolean=false;
	
	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------
	constructor(assetID:string, bytes:GAFBytesInput)
	{
		super();
		
		this._bytes=bytes;
		this._assetID=assetID;
		this._textureElementSizes=[];
	}
	
	convert(async:boolean=false):void
	{
		if(async)
		{
			console.warn("TODO asynchrone conversion");
		}
		else
		{
			this.parseStart();
		}
	}

	// --------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	private parseStart():void
	{
		
		this._bytes.bigEndian = false;
		
		this._config = new GAFAssetConfig(this._assetID);
		this._config.compression = this._bytes.readnumber();
		this._config.versionMajor = this._bytes.readSByte();
		this._config.versionMinor = this._bytes.readSByte();
		this._config.fileLength = this._bytes.readUnsignednumber();	
		
		if(this._config.versionMajor>GAFAssetConfig.MAX_VERSION)
		{
			// TODO: verifier le systeme de diffusion de message (qui les écoute, les centralise)
			this.emit(GAFEvent.ERROR,WarningConstants.UNSUPPORTED_FILE + "Library version:" + GAFAssetConfig.MAX_VERSION + ", file version:" + this._config.versionMajor);
			// dispatchEvent(new anyEvent(ErrorEvent.ERROR, false, false, WarningConstants.UNSUPPORTED_FILE + "Library version:" + GAFAssetConfig.MAX_VERSION + ", file version:" + _config.versionMajor));
			return;
		}

		switch(this._config.compression)
		{
			// TODO
			case BinGAFAssetConfigConverter.SIGNATURE_GAC: 
				throw new Error("HaxePixiGAF: GAF compressed format not supported yet");
				// decompressConfig();
		}

		if(this._config.versionMajor<4)
		{
			this._currentTimeline=new GAFTimelineConfig(this._config.versionMajor + "." + this._config.versionMinor);
			this._currentTimeline.id="0";
			this._currentTimeline.assetID=this._assetID;
			this._currentTimeline.framesCount=this._bytes.readShort();
			this._currentTimeline.bounds=new Rectangle(this._bytes.readnumber(), this._bytes.readnumber(), this._bytes.readnumber(), this._bytes.readnumber());
			this._currentTimeline.pivot=new Point(this._bytes.readnumber(), this._bytes.readnumber());
			this._config.timelines.push(this._currentTimeline);
		}
		else
		{
		
			let i:number=0;
			let l:number = this._bytes.readUnsignednumber();
			for(i = 0; i < l; i++)
			{
				this._config.scaleValues.push(this._bytes.readnumber());					
			}
			
			l = this._bytes.readUnsignednumber();

			for(i = 0; i < l; i++)
			{
				this._config.csfValues.push(this._bytes.readnumber());
			}
		}

		this.readNextTag();
	}
	
	private checkForMissedRegions(timelineConfig:GAFTimelineConfig):void
	{
		if(timelineConfig.textureAtlas!=null && timelineConfig.textureAtlas.contentScaleFactor.elements!=null)
		{
			for(const ao of timelineConfig.animationObjects.animationObjectsDictionary.values())
			{
				if(ao.type==CAnimationObject.TYPE_TEXTURE && timelineConfig.textureAtlas.contentScaleFactor.elements.getElement(ao.regionID)==null)
				{
					timelineConfig.addWarning(WarningConstants.REGION_NOT_FOUND);
					break;
				}
			}
		}
	}
	
	private readNextTag():void
	{
		
		const tagID:number=this._bytes.readShort();
		const tagLength:number=this._bytes.readUnsignednumber();
		
		switch(tagID)
		{
			case TAGS.DEFINE_STAGE:
				BinGAFAssetConfigConverter.readStageConfig(this._bytes, this._config);
				break;
			case TAGS.DEFINE_ATLAS:
				this.readTextureAtlasConfig(tagID);
				break;
			case TAGS.DEFINE_ATLAS2:
				this.readTextureAtlasConfig(tagID);
				break;
			case TAGS.DEFINE_ATLAS3:
				this.readTextureAtlasConfig(tagID);
				break;
			case TAGS.DEFINE_ANIMATION_MASKS:
				BinGAFAssetConfigConverter.readAnimationMasks(tagID, this._bytes, this._currentTimeline);
				break;
			case TAGS.DEFINE_ANIMATION_MASKS2:
				BinGAFAssetConfigConverter.readAnimationMasks(tagID, this._bytes, this._currentTimeline);
				break;
			case TAGS.DEFINE_ANIMATION_OBJECTS:
				BinGAFAssetConfigConverter.readAnimationObjects(tagID, this._bytes, this._currentTimeline);
				break;
			case TAGS.DEFINE_ANIMATION_OBJECTS2:
				BinGAFAssetConfigConverter.readAnimationObjects(tagID, this._bytes, this._currentTimeline);
				break;
			case TAGS.DEFINE_ANIMATION_FRAMES:
				this.readAnimationFrames(tagID);
				return;
			case TAGS.DEFINE_ANIMATION_FRAMES2:
				this.readAnimationFrames(tagID);
				return;
			case TAGS.DEFINE_NAMED_PARTS:
				BinGAFAssetConfigConverter.readNamedParts(this._bytes, this._currentTimeline);
				break;
			case TAGS.DEFINE_SEQUENCES:
				BinGAFAssetConfigConverter.readAnimationSequences(this._bytes, this._currentTimeline);
				break;
			case TAGS.DEFINE_TEXT_FIELDS:
				BinGAFAssetConfigConverter.readTextFields(this._bytes, this._currentTimeline);
				break;
			case TAGS.DEFINE_SOUNDS:
				// TODO TAG_DEFINE_SOUNDS
				console.warn("TODO TAG_DEFINE_SOUNDS");
				if(!this._ignoreSounds)
				{
					// readSounds(_bytes, _config);
				}
				else
				{
					this._bytes.position +=tagLength;
				}
				break;
			case TAGS.DEFINE_TIMELINE:
				this._currentTimeline=this.readTimeline();
				break;
			case TAGS.END:
				if(this._isTimeline)
				{
					this._isTimeline=false;
				}
				else
				{
					this._bytes.position=this._bytes.length;
					this.endParsing();
					return;
				}
				break;
			default:
				console.warn(WarningConstants.UNSUPPORTED_TAG);
				this._bytes.position +=tagLength;
				break;
		}

		this.delayedReadNextTag();
	}

	private delayedReadNextTag():void
	{
		if(this._async)
		{
			console.warn("TODO asynchrone delayedReadNextTag");
		}
		else
		{
			this.readNextTag();
		}
	}
	
	private readTimeline():GAFTimelineConfig
	{
		const timelineConfig:GAFTimelineConfig=new GAFTimelineConfig(this._config.versionMajor + "." + this._config.versionMinor);
		timelineConfig.id = String(this._bytes.readUnsignednumber());
		timelineConfig.assetID=this._config.id;
		timelineConfig.framesCount=this._bytes.readUnsignednumber();
		timelineConfig.bounds=new Rectangle(this._bytes.readnumber(), this._bytes.readnumber(), this._bytes.readnumber(), this._bytes.readnumber());
		timelineConfig.pivot=new Point(this._bytes.readnumber(), this._bytes.readnumber());
		
		const hasLinkage:boolean= this._bytes.readboolean();
		
		if(hasLinkage)
		{
			timelineConfig.linkage = this._bytes.readUTF();			
		}

		this._config.timelines.push(timelineConfig);

		this._isTimeline=true;

		return timelineConfig;
	}
	
	private readTextureAtlasConfig(tagID:number):void
	{
		// const i:number=0;
		// const j:number=0;

		const scale:number = this._bytes.readnumber();
		
		if(this._config.scaleValues.indexOf(scale)==-1)
		{
			this._config.scaleValues.push(scale);
		}

		const textureAtlas:CTextureAtlasScale=this.getTextureAtlasScale(scale);

		// ///////////////////

		let contentScaleFactor:CTextureAtlasCSF=null;
		const atlasLength:number = this._bytes.readSByte();
		
		let atlasID:number=0;
		let sourceLength:number=0;
		let csf:number;
		let source:string;

		let elements:CTextureAtlasElements=null;
		if(textureAtlas.allContentScaleFactors.length>0)
		{
			elements=textureAtlas.allContentScaleFactors[0].elements;
		}

		if(elements==null)
		{
			elements=new CTextureAtlasElements();
		}

		for(let i = 0; i < atlasLength; i++)
		{
			atlasID = this._bytes.readUnsignednumber();
			
			sourceLength = this._bytes.readSByte();
			
			for(let j = 0; j < sourceLength; j++)
			{
				source = this._bytes.readUTF();

				csf = this._bytes.readnumber();

				if(this._config.csfValues.indexOf(csf)==-1)
				{
					this._config.csfValues.push(csf);
				}

				contentScaleFactor = this.getTextureAtlasCSF(scale, csf);

				this.updateTextureAtlasSources(contentScaleFactor, String(atlasID), source);
				if(contentScaleFactor.elements==null)
				{
					contentScaleFactor.elements=elements;
				}
			}
		}
	
		// ///////////////////
		
		const elementsLength:number = this._bytes.readUnsignednumber();
		
		let element:CTextureAtlasElement;
		let hasScale9Grid:boolean=false;
		let scale9Grid:Rectangle=null;
		let pivot:Point;
		let topLeft:Point;
		let elementScaleX:number=0;
		let elementScaleY:number=0;
		let elementWidth:number;
		let elementHeight:number;
		let elementAtlasID:number=0;
		let rotation:boolean=false;
		let linkageName:string="";

		for(let i = 0; i < elementsLength; i++)
		{
			
			pivot = new Point(this._bytes.readnumber(), this._bytes.readnumber());	
			topLeft = new Point(this._bytes.readnumber(), this._bytes.readnumber());
			
			if(tagID==TAGS.DEFINE_ATLAS || tagID==TAGS.DEFINE_ATLAS2)
			{			
				elementScaleX = elementScaleY = this._bytes.readnumber();
			}

			elementWidth = this._bytes.readnumber();			
			elementHeight = this._bytes.readnumber();
			atlasID = this._bytes.readUnsignednumber();
			elementAtlasID = this._bytes.readUnsignednumber();

			if(tagID==TAGS.DEFINE_ATLAS2
			|| tagID==TAGS.DEFINE_ATLAS3)
			{
				hasScale9Grid=this._bytes.readboolean();
				if(hasScale9Grid)
				{
					scale9Grid=new Rectangle(
							this._bytes.readnumber(), this._bytes.readnumber(),
							this._bytes.readnumber(), this._bytes.readnumber()
					);
				}
				else
				{
					scale9Grid=null;
				}
			}

			if(tagID==TAGS.DEFINE_ATLAS3)
			{
				elementScaleX=this._bytes.readnumber();
				elementScaleY=this._bytes.readnumber();
				rotation=this._bytes.readboolean();
				linkageName=this._bytes.readUTF();
			}
			
			if(elements.getElement(String(elementAtlasID))==null)
			{
				element=new CTextureAtlasElement(String(elementAtlasID), String(atlasID));
				element.region=new Rectangle(Number(topLeft.x) | 0, Number(topLeft.y) | 0, elementWidth, elementHeight);
				element.pivotMatrix = new Matrix(1 / elementScaleX, 0, 0, 1 / elementScaleY, -pivot.x / elementScaleX, -pivot.y / elementScaleY);
				element.scale9Grid=scale9Grid;
				element.linkage=linkageName;
				element.rotated=rotation;
				elements.addElement(element);

				if(element.rotated)
				{
					BinGAFAssetConfigConverter.sHelperRectangle.x = 0;
					BinGAFAssetConfigConverter.sHelperRectangle.y = 0;
					BinGAFAssetConfigConverter.sHelperRectangle.width = elementHeight;
					BinGAFAssetConfigConverter.sHelperRectangle.height = elementWidth;
				}
				else
				{
					BinGAFAssetConfigConverter.sHelperRectangle.x = 0;
					BinGAFAssetConfigConverter.sHelperRectangle.y = 0;
					BinGAFAssetConfigConverter.sHelperRectangle.width = elementWidth;
					BinGAFAssetConfigConverter.sHelperRectangle.height = elementHeight;
				}
				BinGAFAssetConfigConverter.sHelperMatrix.copyFrom(element.pivotMatrix);
				const invertScale:number=1 / scale;
				BinGAFAssetConfigConverter.sHelperMatrix.scale(invertScale, invertScale);
				// TODO RectangleUtil.getBounds
				// RectangleUtil.getBounds(sHelperRectangle, sHelperMatrix, sHelperRectangle);

				if(this._textureElementSizes[elementAtlasID]==null)
				{
					this._textureElementSizes[elementAtlasID]=BinGAFAssetConfigConverter.sHelperRectangle.clone();
				}
				else
				{
					this._textureElementSizes[elementAtlasID]=this._textureElementSizes[elementAtlasID].union(BinGAFAssetConfigConverter.sHelperRectangle);
				}
			}
		}
	}
	
	private getTextureAtlasScale(scale:number):CTextureAtlasScale
	{
		let textureAtlasScale:CTextureAtlasScale=null;
		const textureAtlasScales:Array<CTextureAtlasScale>=this._config.allTextureAtlases;

		// const l:number = textureAtlasScales.length;
		
		for(const i in textureAtlasScales)
		{
			if(MathUtility.equals(textureAtlasScales[i].scale, scale))
			{
				textureAtlasScale=textureAtlasScales[i];
				break;
			}
		}

		if(textureAtlasScale==null)
		{
			textureAtlasScale=new CTextureAtlasScale();
			textureAtlasScale.scale=scale;
			textureAtlasScales.push(textureAtlasScale);
		}

		return textureAtlasScale;
	}
	
	private getTextureAtlasCSF(scale:number, csf:number):CTextureAtlasCSF
	{
		const textureAtlasScale:CTextureAtlasScale=this.getTextureAtlasScale(scale);
		let textureAtlasCSF:CTextureAtlasCSF=textureAtlasScale.getTextureAtlasForCSF(csf);
		if(textureAtlasCSF==null)
		{
			textureAtlasCSF=new CTextureAtlasCSF(csf, scale);
			textureAtlasScale.allContentScaleFactors.push(textureAtlasCSF);
		}

		return textureAtlasCSF;
	}

	private updateTextureAtlasSources(textureAtlasCSF:CTextureAtlasCSF, atlasID:string, source:string):void
	{
		let textureAtlasSource:CTextureAtlasSource=null;
		const textureAtlasSources:Array<CTextureAtlasSource>=textureAtlasCSF.sources;
		
		// const l:number = textureAtlasSources.length;
		
		for(const i in textureAtlasSources)
		{
			if(textureAtlasSources[i].id==atlasID)
			{
				textureAtlasSource=textureAtlasSources[i];
				break;
			}
		}

		if(textureAtlasSource==null)
		{
			textureAtlasSource=new CTextureAtlasSource(atlasID, source);
			textureAtlasSources.push(textureAtlasSource);
		}
	}
	
	private static readAnimationMasks(tagID:number, tagContent:GAFBytesInput, timelineConfig:GAFTimelineConfig):void
	{
		const length:number=tagContent.readUnsignednumber();
		let objectID:number=0;
		let regionID:number=0;
		let type:string;

		for(let i = 0; i < length; i++)
		{
			objectID=tagContent.readUnsignednumber();
			regionID=tagContent.readUnsignednumber();
			if(tagID==TAGS.DEFINE_ANIMATION_MASKS)
			{
				type=CAnimationObject.TYPE_TEXTURE;
			}
			else // BinGAFAssetConfigConverter.TAG_DEFINE_ANIMATION_MASKS2
			{
				type=this.getAnimationObjectTypeString(tagContent.readUnsignedShort());
			}
			timelineConfig.animationObjects.addAnimationObject(new CAnimationObject(objectID + "", regionID + "", type, true));
		}
	}
	
	private static getAnimationObjectTypeString(type:number):string
	{
		let typeString:string=CAnimationObject.TYPE_TEXTURE;
		switch(type)
		{
			case 0:
				typeString=CAnimationObject.TYPE_TEXTURE;
			case 1:
				typeString=CAnimationObject.TYPE_TEXTFIELD;
			case 2:
				typeString=CAnimationObject.TYPE_TIMELINE;
		}

		return typeString;
	}

	private static readAnimationObjects(tagID:number, tagContent:GAFBytesInput, timelineConfig:GAFTimelineConfig):void
	{
		const length:number=tagContent.readUnsignednumber();
		let objectID:number=0;
		let regionID:number=0;
		let type:string;

		for(let i = 0;i < length;i++)
		{
			objectID=tagContent.readUnsignednumber();
			regionID=tagContent.readUnsignednumber();
			if(tagID==TAGS.DEFINE_ANIMATION_OBJECTS)
			{
				type=CAnimationObject.TYPE_TEXTURE;
			}
			else
			{
				type=this.getAnimationObjectTypeString(tagContent.readUnsignedShort());
			}
			timelineConfig.animationObjects.addAnimationObject(new CAnimationObject(objectID + "", regionID + "", type, false));
		}
	}
	
	private static readAnimationSequences(tagContent:GAFBytesInput, timelineConfig:GAFTimelineConfig):void
	{
		const length:number=tagContent.readUnsignednumber();
		let sequenceID:string;
		let startFrameNo:number;
		let endFrameNo:number;

		for(let i = 0;i < length;i++)
		{
			sequenceID=tagContent.readUTF();
			startFrameNo=tagContent.readShort();
			endFrameNo=tagContent.readShort();
			timelineConfig.animationSequences.addSequence(new CAnimationSequence(sequenceID, startFrameNo, endFrameNo));
		}
	}
	
	private static readNamedParts(tagContent:GAFBytesInput, timelineConfig:GAFTimelineConfig):void
	{
		timelineConfig.namedParts=new Map<string,string>();

		const length:number=tagContent.readUnsignednumber();
		let partID:number=0;
		for(let i = 0;i < length;i++)
		{
			partID=tagContent.readUnsignednumber();
			timelineConfig.namedParts[String(partID)]=tagContent.readUTF();
		}
	}
	
	private static readTextFields(tagContent:GAFBytesInput, timelineConfig:GAFTimelineConfig):void
	{
		const length:number=tagContent.readUnsignednumber();
		let pivotX:number;
		let pivotY:number;
		let textFieldID:number=0;
		let width:number;
		let height:number;
		let text:string;
		let embedFonts:boolean;
		let multiline:boolean;
		let wordWrap:boolean;
		let restrict:string=null;
		let editable:boolean;
		let selectable:boolean;
		let displayAsPassword:boolean;
		let maxChars:number=0;

		let textFormat:TextStyle;

		for(let i = 0;i < length;i++)
		{
			textFieldID=tagContent.readUnsignednumber();
			pivotX=tagContent.readnumber();
			pivotY=tagContent.readnumber();
			width=tagContent.readnumber();
			height=tagContent.readnumber();

			text=tagContent.readUTF();

			embedFonts=tagContent.readboolean();
			multiline=tagContent.readboolean();
			wordWrap=tagContent.readboolean();

			const hasRestrict:boolean=tagContent.readboolean();
			if(hasRestrict)
			{
				restrict=tagContent.readUTF();
			}

			editable=tagContent.readboolean();
			selectable=tagContent.readboolean();
			displayAsPassword=tagContent.readboolean();
			maxChars=tagContent.readUnsignednumber();

			// read textFormat
			const alignFlag:number=tagContent.readUnsignednumber();
			let align:string=null;
			switch(alignFlag)
			{
				case 0:
					align=TextFormatAlign.LEFT;
				case 1:
					align=TextFormatAlign.RIGHT;
				case 2:
					align=TextFormatAlign.CENTER;
				case 3:
					align=TextFormatAlign.JUSTIFY;
				case 4:
					align=TextFormatAlign.START;
				case 5:
					align=TextFormatAlign.END;
			}

			// const blockIndent:number=tagContent.readUnsignednumber();
			const bold:boolean=tagContent.readboolean();
			// const bullet:boolean=tagContent.readboolean();
			const color:number=tagContent.readUnsignednumber();

			const font:string=tagContent.readUTF();
			// const indent:number=tagContent.readUnsignednumber();
			const italic:boolean=tagContent.readboolean();
			// const kerning:boolean=tagContent.readboolean();
			// const leading:number=tagContent.readUnsignednumber();
			// const leftMargin:number=tagContent.readUnsignednumber();
			const letterSpacing:number=tagContent.readnumber();
			// const rightMargin:number=tagContent.readUnsignednumber();
			const size:number=tagContent.readUnsignednumber();

			const l:number=tagContent.readUnsignednumber();
			const tabStops:Array<any>=[];
			for(let j = 0;j < l;j++)
			{
				tabStops.push(tagContent.readUnsignednumber());
			}

			// const target:string=tagContent.readUTF();
			// const underline:boolean=tagContent.readboolean();
			// const url:string=tagContent.readUTF();

			/* let display:string=tagContent.readUTF();*/

			textFormat = new TextStyle();
			textFormat.fontFamily = font;
			textFormat.fontSize = size;
			textFormat.fill = color;
			textFormat.fontWeight = bold ? "bold" : "normal";
			textFormat.fontStyle = italic ? "italic" : "normal";
			// textFormat. = underline;
			// textFormat. = url;
			// textFormat. = target;
			textFormat.align = align as TextStyleAlign;
			// textFormat. = leftMargin;
			// textFormat. = rightMargin;
			// textFormat. = blockIndent;
			// textFormat. = leading;

			// textFormat.=bullet;
			// textFormat.=kerning;
			// textFormat.=display;
			textFormat.letterSpacing=letterSpacing;
			// textFormat.=tabStops;
			// textFormat.=indent;

			const textFieldObject:CTextFieldObject=new CTextFieldObject(String(textFieldID), text, textFormat,width, height);
			textFieldObject.pivotPoint.x=-pivotX;
			textFieldObject.pivotPoint.y=-pivotY;
			textFieldObject.embedFonts=embedFonts;
			textFieldObject.multiline=multiline;
			textFieldObject.wordWrap=wordWrap;
			textFieldObject.restrict=restrict;
			textFieldObject.editable=editable;
			textFieldObject.selectable=selectable;
			textFieldObject.displayAsPassword=displayAsPassword;
			textFieldObject.maxChars=maxChars;
			timelineConfig.textFields.addTextFieldObject(textFieldObject);
		}
	}
	
	private readAnimationFrames(tagID:number, startIndex:number=0, framesCount:number=-1, prevFrame:CAnimationFrame=null):void
	{
		if(framesCount==-1)
		{
			framesCount=this._bytes.readUnsignednumber();
		}
		let missedFrameNumber:number=0;
		let filterLength:number=0;
		let frameNumber:number=0;
		let statesCount:number=0;
		let filterType:number=0;
		let stateID:number=0;
		let zIndex:number=0;
		let alpha:number;
		let matrix:Matrix;
		let maskID:string;
		let hasMask:boolean=false;
		let hasEffect:boolean=false;
		let hasActions:boolean=false;
		let hasColorTransform:boolean=false;
		let hasChangesInDisplayList:boolean=false;

		const timelineConfig:GAFTimelineConfig=this._config.timelines[this._config.timelines.length - 1];
		let instance:CAnimationFrameInstance;
		let currentFrame:CAnimationFrame;
		let blurFilter:CBlurFilterData;
		const blurFilters:Map<string,CBlurFilterData>= new Map<string,CBlurFilterData>();
		let filter:CFilter;

		if(framesCount!=-1)
		{
			for(let i = startIndex; i < framesCount; i++)
			{
				if(this._async /* &&(getTimer()- cycleTime>=20)*/)
				{
					console.warn("TODO asynchrone readAnimationFrames");
					return;
				}

				frameNumber=this._bytes.readUnsignednumber();

				if(tagID==TAGS.DEFINE_ANIMATION_FRAMES)
				{
					hasChangesInDisplayList=true;
					hasActions=false;
				}
				else
				{
					hasChangesInDisplayList=this._bytes.readboolean();
					hasActions=this._bytes.readboolean();
				}

				if(prevFrame!=null)
				{
					currentFrame=prevFrame.clone(frameNumber);

					missedFrameNumber = prevFrame.frameNumber + 1;
					while (missedFrameNumber < currentFrame.frameNumber) {
						timelineConfig.animationConfigFrames.addFrame(prevFrame.clone(missedFrameNumber));
						missedFrameNumber++;
					}
				}
				else
				{
					currentFrame=new CAnimationFrame(frameNumber);

					if(currentFrame.frameNumber>1)
					{
						missedFrameNumber = 1;
						while (missedFrameNumber < currentFrame.frameNumber) {
							timelineConfig.animationConfigFrames.addFrame(new CAnimationFrame(missedFrameNumber));
							missedFrameNumber++;
						}
		
					}
				}

				if(hasChangesInDisplayList)
				{
					statesCount=this._bytes.readUnsignednumber();

					for(let j = 0; i < statesCount; j++)
					{
						hasColorTransform=this._bytes.readboolean();
						hasMask=this._bytes.readboolean();
						hasEffect=this._bytes.readboolean();

						stateID=this._bytes.readUnsignednumber();
						zIndex=this._bytes.readnumber();
						alpha=this._bytes.readnumber();
						if(alpha==1)
						{
							alpha = GAF.maxAlpha;
						}
						matrix = new Matrix(this._bytes.readnumber(), this._bytes.readnumber(), this._bytes.readnumber(),this._bytes.readnumber(), this._bytes.readnumber(), this._bytes.readnumber());

						filter=null;

						if(hasColorTransform)
						{
							const params:Array<number>=[
								this._bytes.readnumber(), this._bytes.readnumber(), this._bytes.readnumber(),
								this._bytes.readnumber(), this._bytes.readnumber(), this._bytes.readnumber(),
								this._bytes.readnumber()];
							if (filter==null) filter=new CFilter();
							filter.addColorTransform(params);
						}

						if(hasEffect)
						{
							if (filter==null) filter=new CFilter();

							filterLength=this._bytes.readSByte();
							for(let k = 0; k < filterLength; k++)
							{
								filterType=this._bytes.readUnsignednumber();
								let warning:string=null;

								switch(filterType)
								{
									case BinGAFAssetConfigConverter.FILTER_DROP_SHADOW:
										warning=BinGAFAssetConfigConverter.readDropShadowFilter(this._bytes, filter);
									case BinGAFAssetConfigConverter.FILTER_BLUR:
										warning=BinGAFAssetConfigConverter.readBlurFilter(this._bytes, filter);
										blurFilter=filter.filterConfigs[filter.filterConfigs.length - 1] as CBlurFilterData;
										if(blurFilter.blurX>=2 && blurFilter.blurY>=2)
										{
											if (!blurFilters.has(String(stateID)))
											{
												blurFilters[String(stateID)]=blurFilter;
											}
										}
										else
										{
											blurFilters[String(stateID)]=null;
										}
									case BinGAFAssetConfigConverter.FILTER_GLOW:
										warning=BinGAFAssetConfigConverter.readGlowFilter(this._bytes, filter);
									case BinGAFAssetConfigConverter.FILTER_COLOR_MATRIX:
										warning=BinGAFAssetConfigConverter.readColorMatrixFilter(this._bytes, filter);
									default:
										console.warn(WarningConstants.UNSUPPORTED_FILTERS);
								}

								timelineConfig.addWarning(warning);
							}
						}

						if(hasMask)
						{
							maskID=this._bytes.readUnsignednumber()+ "";
						}
						else
						{
							maskID="";
						}

						instance=new CAnimationFrameInstance(stateID + "");
						instance.update(zIndex, matrix, alpha, maskID, filter);

						if(maskID!=null && filter!=null)
						{
							timelineConfig.addWarning(WarningConstants.FILTERS_UNDER_MASK);
						}

						currentFrame.addInstance(instance);
					}

					currentFrame.sortInstances();
				}

				if(hasActions)
				{
					// let data:any;
					let action:CFrameAction;
					const count:number=this._bytes.readUnsignednumber();
					for(let a = 0; a < count; a++)
					{
						action=new CFrameAction();
						action.type=this._bytes.readUnsignednumber();
						action.scope=this._bytes.readUTF();

						const paramsLength:number=this._bytes.readUnsignednumber();
						if(paramsLength>0)
						{
							const lBytes = this._bytes.readBytes(paramsLength, 0);
							let paramsBA:GAFBytesInput = new GAFBytesInput(lBytes);
							paramsBA.bigEndian = false;
							while(paramsBA.position<paramsBA.length)
							{
								action.params.push(paramsBA.readUTF());
							}
							// paramsBA.delete();
							paramsBA = null;
						}

						if(action.type==CFrameAction.DISPATCH_EVENT &&  action.params[0]==CSound.GAF_PLAY_SOUND &&  action.params.length>3)
						{
							if(this._ignoreSounds)
							{
								continue;// do not add sound events if they're ignored
							}
							
							// data = JSON.parse(action.params[3]);
							// timelineConfig.addSound(data, frameNumber);
						}

						currentFrame.addAction(action);
					}
				}

				timelineConfig.animationConfigFrames.addFrame(currentFrame);

				prevFrame=currentFrame;
			} // end loop

			missedFrameNumber = prevFrame.frameNumber + 1;
			while (missedFrameNumber<=timelineConfig.framesCount) {
				timelineConfig.animationConfigFrames.addFrame(prevFrame.clone(missedFrameNumber));
				missedFrameNumber++;
			}

			for(const currentFrame of timelineConfig.animationConfigFrames.frames)
			{
				for(const instance of currentFrame.instances)
				{
					if(blurFilters[instance.id]!=null && instance.filter!=null)
					{
						blurFilter=instance.filter.getBlurFilter();
						if(blurFilter!=null && blurFilter.resolution==1)
						{
							blurFilter.blurX *=0.5;
							blurFilter.blurY *=0.5;
							blurFilter.resolution=0.75;
						}
					}
				}
			}
		} // end condition

		this.delayedReadNextTag();
	}
	
	private readMaskMaxSizes():void
	{
		for(const timeline of this._config.timelines)
		{
			for(const frame of timeline.animationConfigFrames.frames)
			{
				for(const frameInstance of frame.instances)
				{
					const animationObject:CAnimationObject=timeline.animationObjects.getAnimationObject(frameInstance.id);
					if(animationObject.mask)
					{
						if(animationObject.maxSize==null)
						{
							animationObject.maxSize=new Point();
						}

						const maxSize:Point=animationObject.maxSize;

						if(animationObject.type==CAnimationObject.TYPE_TEXTURE)
						{
							BinGAFAssetConfigConverter.sHelperRectangle.copyFrom(this._textureElementSizes[parseInt(animationObject.regionID)]);
						}
						else if(animationObject.type==CAnimationObject.TYPE_TIMELINE)
						{
							const maskTimeline:GAFTimelineConfig=null;
							for(const maskTimeline of this._config.timelines)
							{
								if(maskTimeline.id==animationObject.regionID)
								{
									break;
								}
							}
							BinGAFAssetConfigConverter.sHelperRectangle.copyFrom(maskTimeline.bounds);
						}
						else if(animationObject.type==CAnimationObject.TYPE_TEXTFIELD)
						{
							const textField:CTextFieldObject=timeline.textFields.textFieldObjectsDictionary[animationObject.regionID];
							BinGAFAssetConfigConverter.sHelperRectangle.x =-textField.pivotPoint.x;
							BinGAFAssetConfigConverter.sHelperRectangle.y =-textField.pivotPoint.y;
							BinGAFAssetConfigConverter.sHelperRectangle.width = textField.width;
							BinGAFAssetConfigConverter.sHelperRectangle.height = textField.height;
						}
						// TODO
						// RectangleUtil.getBounds(sHelperRectangle, frameInstance.matrix, sHelperRectangle);
						maxSize.set(
								Math.max(maxSize.x, Math.abs(BinGAFAssetConfigConverter.sHelperRectangle.width)),
								Math.max(maxSize.y, Math.abs(BinGAFAssetConfigConverter.sHelperRectangle.height)));
					}
				}
			}
		}
	}
	
	private endParsing():void
	{
		// this._bytes.delete();
		this._bytes=null;

		this.readMaskMaxSizes();

		let itemIndex:number=0;
		
		if(Number.isNaN(this._config.defaultScale))
		{
			
			if(!Number.isNaN(this._defaultScale))
			{
				itemIndex=MathUtility.getItemIndex(this._config.scaleValues, this._defaultScale);
				if(itemIndex<0)
				{
					this.parseError(this._defaultScale + ErrorConstants.SCALE_NOT_FOUND);
					return;
				}
			}
			this._config.defaultScale=this._config.scaleValues[itemIndex];
		}

		if(Number.isNaN(this._config.defaultContentScaleFactor))
		{
			itemIndex=0;
			if(!Number.isNaN(this._defaultContentScaleFactor))
			{
				itemIndex=MathUtility.getItemIndex(this._config.csfValues, this._defaultContentScaleFactor);
				if(itemIndex<0)
				{
					this.parseError(this._defaultContentScaleFactor + ErrorConstants.CSF_NOT_FOUND);
					return;
				}
			}
			this._config.defaultContentScaleFactor=this._config.csfValues[itemIndex];
		}

		for(const textureAtlasScale of this._config.allTextureAtlases)
		{
			for(const textureAtlasCSF of textureAtlasScale.allContentScaleFactors)
			{
				if(MathUtility.equals(this._config.defaultContentScaleFactor, textureAtlasCSF.csf))
				{
					textureAtlasScale.contentScaleFactor=textureAtlasCSF;
					break;
				}
			}
		}

		for(const timelineConfig of this._config.timelines)
		{
			timelineConfig.allTextureAtlases=this._config.allTextureAtlases;

			for(const textureAtlasScale of this._config.allTextureAtlases)
			{
				if(MathUtility.equals(this._config.defaultScale, textureAtlasScale.scale))
				{
					timelineConfig.textureAtlas=textureAtlasScale;
				}
			}

			timelineConfig.stageConfig=this._config.stageConfig;

			this.checkForMissedRegions(timelineConfig);
		}

		this.emit(GAFEvent.COMPLETE, {target:this});
	}
	
	private parseError(message:string):void
	{
		if(EventEmitterUtility.hasEventListener(this, GAFEvent.ERROR))
		{
			this.emit(GAFEvent.ERROR, {bubbles:false, cancelable:false, text:message});
		}
		else
		{
			throw message;
		}
	}
	
	// --------------------------------------------------------------------------
	//
	//  GETTERS AND SETTERS
	//
	// --------------------------------------------------------------------------

	
 	get config():GAFAssetConfig
	{
		return this._config;
	}

	
 	get assetID():string
	{
		return this._assetID;
	}

	
 	set ignoreSounds(ignoreSounds:boolean)
	{
		this._ignoreSounds=ignoreSounds;
	}
	
	// --------------------------------------------------------------------------
	//
	//  STATIC METHODS
	//
	// --------------------------------------------------------------------------

	private static readStageConfig(tagContent:GAFBytesInput, config:GAFAssetConfig):void
	{
		const stageConfig:CStage=new CStage();

		stageConfig.fps = tagContent.readSByte();
		// stageConfig.color=tagContent.readnumber();
		stageConfig.color=tagContent.readnumber();
		stageConfig.width=tagContent.readUnsignedShort();
		stageConfig.height=tagContent.readUnsignedShort();
		
		config.stageConfig=stageConfig;
	}
	
	private static readDropShadowFilter(source:GAFBytesInput, filter:CFilter):string
	{
		const color:Array<any>=this.readColorValue(source);
		const blurX:number=source.readnumber();
		const blurY:number=source.readnumber();
		const angle:number=source.readnumber();
		const distance:number=source.readnumber();
		const strength:number=source.readnumber();
		const inner:boolean=source.readboolean();
		const knockout:boolean=source.readboolean();

		return filter.addDropShadowFilter(blurX, blurY, color[1], color[0], angle, distance, strength, inner, knockout);
	}

	private static readBlurFilter(source:GAFBytesInput, filter:CFilter):string
	{
		return filter.addBlurFilter(source.readnumber(), source.readnumber());
	}

	private static readGlowFilter(source:GAFBytesInput, filter:CFilter):string
	{
		const color:Array<any>=this.readColorValue(source);
		const blurX:number=source.readnumber();
		const blurY:number=source.readnumber();
		const strength:number=source.readnumber();
		const inner:boolean=source.readboolean();
		const knockout:boolean=source.readboolean();

		return filter.addGlowFilter(blurX, blurY, color[1], color[0], strength, inner, knockout);
	}

	private static readColorMatrixFilter(source:GAFBytesInput, filter:CFilter):string
	{
		const matrix:Array<number>=[];
		
		for(const i of [...Array(20)].keys())
		{
			matrix[i]=source.readnumber();
		}

		return filter.addColorMatrixFilter(matrix);
	}

	private static readColorValue(source:GAFBytesInput):Array<number>
	{
		const argbValue:number=source.readUnsignednumber();
		const alpha:number=(Number(((argbValue>>24)& 0xFF)* 100 / 255) | 0) / 100;
		const color:number=argbValue & 0xFFFFFF;

		return [alpha, color];
	}
	
	// -------------
	
	
 	set defaultScale(defaultScale:number)
	{
		this._defaultScale=defaultScale;
	}

	
 	set defaultCSF(csf:number)
	{
		this._defaultContentScaleFactor=csf;
	}
	
}