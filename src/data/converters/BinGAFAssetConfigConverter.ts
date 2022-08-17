import { utils, Rectangle, Matrix, Point, TextStyle } from "pixi.js";
import { GAFEvent } from "../../events/GAFEvent";
import TextFormatAlign from "../../text/TextFormatAlign";
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

/**
 * TODO
 * @author Mathieu Anthoine
 */
class BinGAFAssetConfigConverter extends utils.EventEmitter
{

	private static SIGNATURE_GAC:number=0x00474143;	
	
	//tags
	private static TAG_END:number=0;
	private static TAG_DEFINE_ATLAS:number=1;
	private static TAG_DEFINE_ANIMATION_MASKS:number=2;
	private static TAG_DEFINE_ANIMATION_OBJECTS:number=3;
	private static TAG_DEFINE_ANIMATION_FRAMES:number=4;
	private static TAG_DEFINE_NAMED_PARTS:number=5;
	private static TAG_DEFINE_SEQUENCES:number=6;
	private static TAG_DEFINE_TEXT_FIELDS:number=7;// v4.0
	private static TAG_DEFINE_ATLAS2:number=8;// v4.0
	private static TAG_DEFINE_STAGE:number=9;
	private static TAG_DEFINE_ANIMATION_OBJECTS2:number=10;// v4.0
	private static TAG_DEFINE_ANIMATION_MASKS2:number=11;// v4.0
	private static TAG_DEFINE_ANIMATION_FRAMES2:number=12;// v4.0
	private static TAG_DEFINE_TIMELINE:number=13;// v4.0
	private static TAG_DEFINE_SOUNDS:number=14;// v5.0
	private static TAG_DEFINE_ATLAS3:number=15;// v5.0

	//filters
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
	//--------------------------------------------------------------------------
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

	//--------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	//--------------------------------------------------------------------------

	private parseStart():void
	{
		
		this._bytes.bigEndian = false;
		
		this._config=new GAFAssetConfig(this._assetID);
		this._config.compression=this._bytes.readnumber();
		this._config.versionMajor=this._bytes.readSByte();
		this._config.versionMinor = this._bytes.readSByte();
		this._config.fileLength = this._bytes.readUnsignednumber();	
		
		if(this._config.versionMajor>GAFAssetConfig.MAX_VERSION)
		{
			//TODO: verifier le systeme de diffusion de message (qui les écoute, les centralise)
			this.emit(GAFEvent.ERROR,WarningConstants.UNSUPPORTED_FILE + "Library version:" + GAFAssetConfig.MAX_VERSION + ", file version:" + this._config.versionMajor);
			//dispatchEvent(new anyEvent(ErrorEvent.ERROR, false, false, WarningConstants.UNSUPPORTED_FILE + "Library version:" + GAFAssetConfig.MAX_VERSION + ", file version:" + _config.versionMajor));
			return;
		}

		switch(this._config.compression)
		{
			// TODO
			case BinGAFAssetConfigConverter.SIGNATURE_GAC: 
				throw "HaxePixiGAF: GAF compressed format not supported yet";
				//decompressConfig();
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
		
			var i:number=0;
			var l:number = this._bytes.readUnsignednumber();
			for(i in 0...l)
			{
				this._config.scaleValues.push(this._bytes.readnumber());					
			}
			
			l = this._bytes.readUnsignednumber();

			for(i in 0...l)
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
			for(ao in timelineConfig.animationObjects.animationObjectsDictionary)
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
		
		var tagID:number=this._bytes.readShort();
		var tagLength:number=this._bytes.readUnsignednumber();
		
		switch(tagID)
		{
			case BinGAFAssetConfigConverter.TAG_DEFINE_STAGE:
				this.readStageConfig(this._bytes, this._config);
			case BinGAFAssetConfigConverter.TAG_DEFINE_ATLAS:
				this.readTextureAtlasConfig(tagID);
			case BinGAFAssetConfigConverter.TAG_DEFINE_ATLAS2:
				this.readTextureAtlasConfig(tagID);
			case BinGAFAssetConfigConverter.TAG_DEFINE_ATLAS3:
				this.readTextureAtlasConfig(tagID);
			case BinGAFAssetConfigConverter.TAG_DEFINE_ANIMATION_MASKS:
				this.readAnimationMasks(tagID, this._bytes, this._currentTimeline);
			case BinGAFAssetConfigConverter.TAG_DEFINE_ANIMATION_MASKS2:
				this.readAnimationMasks(tagID, this._bytes, this._currentTimeline);
			case BinGAFAssetConfigConverter.TAG_DEFINE_ANIMATION_OBJECTS:
				this.readAnimationObjects(tagID, this._bytes, this._currentTimeline);
			case BinGAFAssetConfigConverter.TAG_DEFINE_ANIMATION_OBJECTS2:
				this.readAnimationObjects(tagID, this._bytes, this._currentTimeline);
			case BinGAFAssetConfigConverter.TAG_DEFINE_ANIMATION_FRAMES:
				this.readAnimationFrames(tagID);
				return;
			case BinGAFAssetConfigConverter.TAG_DEFINE_ANIMATION_FRAMES2:
				this.readAnimationFrames(tagID);
				return;
			case BinGAFAssetConfigConverter.TAG_DEFINE_NAMED_PARTS:
				this.readNamedParts(this._bytes, this._currentTimeline);
			case BinGAFAssetConfigConverter.TAG_DEFINE_SEQUENCES:
				this.readAnimationSequences(this._bytes, this._currentTimeline);
			case BinGAFAssetConfigConverter.TAG_DEFINE_TEXT_FIELDS:
				this.readTextFields(this._bytes, this._currentTimeline);
			case BinGAFAssetConfigConverter.TAG_DEFINE_SOUNDS:
				//TODO TAG_DEFINE_SOUNDS
				console.warn("TODO TAG_DEFINE_SOUNDS");
				if(!this._ignoreSounds)
				{
					//readSounds(_bytes, _config);
				}
				else
				{
					this._bytes.position +=tagLength;
				}
			case BinGAFAssetConfigConverter.TAG_DEFINE_TIMELINE:
				this._currentTimeline=this.readTimeline();
			case BinGAFAssetConfigConverter.TAG_END:
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
			default:
				console.warn(WarningConstants.UNSUPPORTED_TAG);
				this._bytes.position +=tagLength;
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
		var timelineConfig:GAFTimelineConfig=new GAFTimelineConfig(this._config.versionMajor + "." + this._config.versionMinor);
		timelineConfig.id = Std.string(this._bytes.readUnsignednumber());
		timelineConfig.assetID=this._config.id;
		timelineConfig.framesCount=this._bytes.readUnsignednumber();
		timelineConfig.bounds=new Rectangle(this._bytes.readnumber(), this._bytes.readnumber(), this._bytes.readnumber(), this._bytes.readnumber());
		timelineConfig.pivot=new Point(this._bytes.readnumber(), this._bytes.readnumber());
		
		var hasLinkage:boolean= this._bytes.readboolean();
		
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
		var i:number=0;
		var j:number=0;

		var scale:number = this._bytes.readnumber();
		
		if(this._config.scaleValues.indexOf(scale)==-1)
		{
			this._config.scaleValues.push(scale);
		}

		var textureAtlas:CTextureAtlasScale=this.getTextureAtlasScale(scale);

		/////////////////////

		var contentScaleFactor:CTextureAtlasCSF=null;
		var atlasLength:number = this._bytes.readSByte();
		
		var atlasID:number=0;
		var sourceLength:number=0;
		var csf:number;
		var source:string;

		var elements:CTextureAtlasElements=null;
		if(textureAtlas.allContentScaleFactors.length>0)
		{
			elements=textureAtlas.allContentScaleFactors[0].elements;
		}

		if(elements==null)
		{
			elements=new CTextureAtlasElements();
		}

		for(i in 0...atlasLength)
		{
			atlasID = this._bytes.readUnsignednumber();
			
			sourceLength = this._bytes.readSByte();
			
			for(j in 0...sourceLength)
			{
				source = this._bytes.readUTF();

				csf = this._bytes.readnumber();

				if(this._config.csfValues.indexOf(csf)==-1)
				{
					this._config.csfValues.push(csf);
				}

				contentScaleFactor = this.getTextureAtlasCSF(scale, csf);

				this.updateTextureAtlasSources(contentScaleFactor, Std.string(atlasID), source);
				if(contentScaleFactor.elements==null)
				{
					contentScaleFactor.elements=elements;
				}
			}
		}
	
		/////////////////////
		
		var elementsLength:number = this._bytes.readUnsignednumber();
		
		var element:CTextureAtlasElement;
		var hasScale9Grid:boolean=false;
		var scale9Grid:Rectangle=null;
		var pivot:Point;
		var topLeft:Point;
		var elementScaleX:number=0;
		var elementScaleY:number=0;
		var elementWidth:number;
		var elementHeight:number;
		var elementAtlasID:number=0;
		var rotation:boolean=false;
		var linkageName:string="";

		for(i in 0...elementsLength)
		{
			
			pivot = new Point(this._bytes.readnumber(), this._bytes.readnumber());	
			topLeft = new Point(this._bytes.readnumber(), this._bytes.readnumber());
			
			if(tagID==BinGAFAssetConfigConverter.TAG_DEFINE_ATLAS || tagID==BinGAFAssetConfigConverter.TAG_DEFINE_ATLAS2)
			{			
				elementScaleX = elementScaleY = this._bytes.readnumber();
			}

			elementWidth = this._bytes.readnumber();			
			elementHeight = this._bytes.readnumber();
			atlasID = this._bytes.readUnsignednumber();
			elementAtlasID = this._bytes.readUnsignednumber();

			if(tagID==BinGAFAssetConfigConverter.TAG_DEFINE_ATLAS2
			|| tagID==BinGAFAssetConfigConverter.TAG_DEFINE_ATLAS3)
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

			if(tagID==BinGAFAssetConfigConverter.TAG_DEFINE_ATLAS3)
			{
				elementScaleX=this._bytes.readnumber();
				elementScaleY=this._bytes.readnumber();
				rotation=this._bytes.readboolean();
				linkageName=this._bytes.readUTF();
			}
			
			if(elements.getElement(Std.string(elementAtlasID))==null)
			{
				element=new CTextureAtlasElement(Std.string(elementAtlasID), Std.string(atlasID));
				element.region=new Rectangle(Std.int(topLeft.x), Std.int(topLeft.y), elementWidth, elementHeight);
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
				var invertScale:number=1 / scale;
				BinGAFAssetConfigConverter.sHelperMatrix.scale(invertScale, invertScale);
				// TODO RectangleUtil.getBounds
				//RectangleUtil.getBounds(sHelperRectangle, sHelperMatrix, sHelperRectangle);

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
		var textureAtlasScale:CTextureAtlasScale=null;
		var textureAtlasScales:Array<CTextureAtlasScale>=this._config.allTextureAtlases;

		var l:number = textureAtlasScales.length;
		
		for(i in 0...l)
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
		var textureAtlasScale:CTextureAtlasScale=this.getTextureAtlasScale(scale);
		var textureAtlasCSF:CTextureAtlasCSF=textureAtlasScale.getTextureAtlasForCSF(csf);
		if(textureAtlasCSF==null)
		{
			textureAtlasCSF=new CTextureAtlasCSF(csf, scale);
			textureAtlasScale.allContentScaleFactors.push(textureAtlasCSF);
		}

		return textureAtlasCSF;
	}

	private updateTextureAtlasSources(textureAtlasCSF:CTextureAtlasCSF, atlasID:string, source:string):void
	{
		var textureAtlasSource:CTextureAtlasSource=null;
		var textureAtlasSources:Array<CTextureAtlasSource>=textureAtlasCSF.sources;
		
		var l:number = textureAtlasSources.length;
		
		for(i in 0...l)
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
		var length:number=tagContent.readUnsignednumber();
		var objectID:number=0;
		var regionID:number=0;
		var type:string;

		for(i in 0...length)
		{
			objectID=tagContent.readUnsignednumber();
			regionID=tagContent.readUnsignednumber();
			if(tagID==BinGAFAssetConfigConverter.TAG_DEFINE_ANIMATION_MASKS)
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
		var typeString:string=CAnimationObject.TYPE_TEXTURE;
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
		var length:number=tagContent.readUnsignednumber();
		var objectID:number=0;
		var regionID:number=0;
		var type:string;

		for(i in 0...length)
		{
			objectID=tagContent.readUnsignednumber();
			regionID=tagContent.readUnsignednumber();
			if(tagID==BinGAFAssetConfigConverter.TAG_DEFINE_ANIMATION_OBJECTS)
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
		var length:number=tagContent.readUnsignednumber();
		var sequenceID:string;
		var startFrameNo:number;
		var endFrameNo:number;

		for(i in 0...length)
		{
			sequenceID=tagContent.readUTF();
			startFrameNo=tagContent.readShort();
			endFrameNo=tagContent.readShort();
			timelineConfig.animationSequences.addSequence(new CAnimationSequence(sequenceID, startFrameNo, endFrameNo));
		}
	}
	
	private static readNamedParts(tagContent:GAFBytesInput, timelineConfig:GAFTimelineConfig):void
	{
		timelineConfig.namedParts=new Map<String,String>();

		var length:number=tagContent.readUnsignednumber();
		var partID:number=0;
		for(i in 0...length)
		{
			partID=tagContent.readUnsignednumber();
			timelineConfig.namedParts[Std.string(partID)]=tagContent.readUTF();
		}
	}
	
	private static readTextFields(tagContent:GAFBytesInput, timelineConfig:GAFTimelineConfig):void
	{
		var length:number=tagContent.readUnsignednumber();
		var pivotX:number;
		var pivotY:number;
		var textFieldID:number=0;
		var width:number;
		var height:number;
		var text:string;
		var embedFonts:boolean;
		var multiline:boolean;
		var wordWrap:boolean;
		var restrict:string=null;
		var editable:boolean;
		var selectable:boolean;
		var displayAsPassword:boolean;
		var maxChars:number=0;

		var textFormat:TextStyle;

		for(i in 0...length)
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

			var hasRestrict:boolean=tagContent.readboolean();
			if(hasRestrict)
			{
				restrict=tagContent.readUTF();
			}

			editable=tagContent.readboolean();
			selectable=tagContent.readboolean();
			displayAsPassword=tagContent.readboolean();
			maxChars=tagContent.readUnsignednumber();

			// read textFormat
			var alignFlag:number=tagContent.readUnsignednumber();
			var align:string=null;
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

			var blockIndent:number=tagContent.readUnsignednumber();
			var bold:boolean=tagContent.readboolean();
			var bullet:boolean=tagContent.readboolean();
			var color:number=tagContent.readUnsignednumber();

			var font:string=tagContent.readUTF();
			var indent:number=tagContent.readUnsignednumber();
			var italic:boolean=tagContent.readboolean();
			var kerning:boolean=tagContent.readboolean();
			var leading:number=tagContent.readUnsignednumber();
			var leftMargin:number=tagContent.readUnsignednumber();
			var letterSpacing:number=tagContent.readnumber();
			var rightMargin:number=tagContent.readUnsignednumber();
			var size:number=tagContent.readUnsignednumber();

			var l:number=tagContent.readUnsignednumber();
			var tabStops:Array<any>=[];
			for(j in 0...l)
			{
				tabStops.push(tagContent.readUnsignednumber());
			}

			var target:string=tagContent.readUTF();
			var underline:boolean=tagContent.readboolean();
			var url:string=tagContent.readUTF();

			/* var display:string=tagContent.readUTF();*/

			textFormat = new TextStyle();
			textFormat.fontFamily = font;
			textFormat.fontSize = size;
			textFormat.fill = color;
			textFormat.fontWeight = bold ? "bold" : "normal";
			textFormat.fontStyle = italic ? "italic" : "normal";
			//textFormat. = underline;
			//textFormat. = url;
			//textFormat. = target;
			textFormat.align = align;
			//textFormat. = leftMargin;
			//textFormat. = rightMargin;
			//textFormat. = blockIndent;
			//textFormat. = leading;

			//textFormat.=bullet;
			//textFormat.=kerning;
			//textFormat.=display;
			textFormat.letterSpacing=letterSpacing;
			//textFormat.=tabStops;
			//textFormat.=indent;

			var textFieldObject:CTextFieldObject=new CTextFieldObject(Std.string(textFieldID), text, textFormat,width, height);
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
	
	private readAnimationFrames(tagID:number, startIndex:number=0, ?framesCount:number=-1, ?prevFrame:CAnimationFrame=null):void
	{
		if(framesCount==-1)
		{
			framesCount=this._bytes.readUnsignednumber();
		}
		var missedFrameNumber:number=0;
		var filterLength:number=0;
		var frameNumber:number=0;
		var statesCount:number=0;
		var filterType:number=0;
		var stateID:number=0;
		var zIndex:number=0;
		var alpha:number;
		var matrix:Matrix;
		var maskID:string;
		var hasMask:boolean=false;
		var hasEffect:boolean=false;
		var hasActions:boolean=false;
		var hasColorTransform:boolean=false;
		var hasChangesInDisplayList:boolean=false;

		var timelineConfig:GAFTimelineConfig=this._config.timelines[this._config.timelines.length - 1];
		var instance:CAnimationFrameInstance;
		var currentFrame:CAnimationFrame;
		var blurFilter:CBlurFilterData;
		var blurFilters:Map<String,CBlurFilterData>= new Map<String,CBlurFilterData>();
		var filter:CFilter;

		if(framesCount!=-1)
		{
			for(i in startIndex...framesCount)
			{
				if(this._async /*&&(getTimer()- cycleTime>=20)*/)
				{
					console.warn("TODO asynchrone readAnimationFrames");
					return;
				}

				frameNumber=this._bytes.readUnsignednumber();

				if(tagID==BinGAFAssetConfigConverter.TAG_DEFINE_ANIMATION_FRAMES)
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

					for(j in 0...statesCount)
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
							var params:Array<number>=[
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
							for(k in 0...filterLength)
							{
								filterType=this._bytes.readUnsignednumber();
								var warning:string=null;

								switch(filterType)
								{
									case BinGAFAssetConfigConverter.FILTER_DROP_SHADOW:
										warning=this.readDropShadowFilter(this._bytes, filter);
									case BinGAFAssetConfigConverter.FILTER_BLUR:
										warning=this.readBlurFilter(this._bytes, filter);
										blurFilter=cast(filter.filterConfigs[filter.filterConfigs.length - 1],CBlurFilterData);
										if(blurFilter.blurX>=2 && blurFilter.blurY>=2)
										{
											if (!blurFilters.exists(Std.string(stateID)))
											{
												blurFilters[Std.string(stateID)]=blurFilter;
											}
										}
										else
										{
											blurFilters[Std.string(stateID)]=null;
										}
									case BinGAFAssetConfigConverter.FILTER_GLOW:
										warning=this.readGlowFilter(this._bytes, filter);
									case BinGAFAssetConfigConverter.FILTER_COLOR_MATRIX:
										warning=this.readColorMatrixFilter(this._bytes, filter);
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
					var data:any;
					var action:CFrameAction;
					var count:number=this._bytes.readUnsignednumber();
					for(a in 0...count)
					{
						action=new CFrameAction();
						action.type=this._bytes.readUnsignednumber();
						action.scope=this._bytes.readUTF();

						var paramsLength:number=this._bytes.readUnsignednumber();
						if(paramsLength>0)
						{
							var lBytes:Bytes = Bytes.alloc(paramsLength);
							this._bytes.readBytes(lBytes, 0, paramsLength);
							var paramsBA:GAFBytesInput = new GAFBytesInput(lBytes);
							paramsBA.bigEndian = false;
							while(paramsBA.position<paramsBA.length)
							{
								action.params.push(paramsBA.readUTF());
							}
							paramsBA.close();
							paramsBA = null;
						}

						if(action.type==CFrameAction.DISPATCH_EVENT &&  action.params[0]==CSound.GAF_PLAY_SOUND &&  action.params.length>3)
						{
							if(this._ignoreSounds)
							{
								continue;//do not add sound events if they're ignored
							}
							
							data=Json.parse(action.params[3]);
							//timelineConfig.addSound(data, frameNumber);
						}

						currentFrame.addAction(action);
					}
				}

				timelineConfig.animationConfigFrames.addFrame(currentFrame);

				prevFrame=currentFrame;
			} //end loop

			missedFrameNumber = prevFrame.frameNumber + 1;
			while (missedFrameNumber<=timelineConfig.framesCount) {
				timelineConfig.animationConfigFrames.addFrame(prevFrame.clone(missedFrameNumber));
				missedFrameNumber++;
			}

			for(currentFrame in timelineConfig.animationConfigFrames.frames)
			{
				for(instance in currentFrame.instances)
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
		} //end condition

		this.delayedReadNextTag();
	}
	
	private readMaskMaxSizes():void
	{
		for(timeline in this._config.timelines)
		{
			for(frame in timeline.animationConfigFrames.frames)
			{
				for(frameInstance in frame.instances)
				{
					var animationObject:CAnimationObject=timeline.animationObjects.getAnimationObject(frameInstance.id);
					if(animationObject.mask)
					{
						if(animationObject.maxSize==null)
						{
							animationObject.maxSize=new Point();
						}

						var maxSize:Point=animationObject.maxSize;

						if(animationObject.type==CAnimationObject.TYPE_TEXTURE)
						{
							BinGAFAssetConfigConverter.sHelperRectangle.copyFrom(this._textureElementSizes[Std.parsenumber(animationObject.regionID)]);
						}
						else if(animationObject.type==CAnimationObject.TYPE_TIMELINE)
						{
							var maskTimeline:GAFTimelineConfig=null;
							for(maskTimeline in this._config.timelines)
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
							var textField:CTextFieldObject=timeline.textFields.textFieldObjectsDictionary[animationObject.regionID];
							BinGAFAssetConfigConverter.sHelperRectangle.x =-textField.pivotPoint.x;
							BinGAFAssetConfigConverter.sHelperRectangle.y =-textField.pivotPoint.y;
							BinGAFAssetConfigConverter.sHelperRectangle.width = textField.width;
							BinGAFAssetConfigConverter.sHelperRectangle.height = textField.height;
						}
						//TODO
						//RectangleUtil.getBounds(sHelperRectangle, frameInstance.matrix, sHelperRectangle);
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
		this._bytes.close();
		this._bytes=null;

		this.readMaskMaxSizes();

		var itemIndex:number=0;
		
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

		for(textureAtlasScale in this._config.allTextureAtlases)
		{
			for(textureAtlasCSF in textureAtlasScale.allContentScaleFactors)
			{
				if(MathUtility.equals(this._config.defaultContentScaleFactor, textureAtlasCSF.csf))
				{
					textureAtlasScale.contentScaleFactor=textureAtlasCSF;
					break;
				}
			}
		}

		for(timelineConfig in this._config.timelines)
		{
			timelineConfig.allTextureAtlases=this._config.allTextureAtlases;

			for(textureAtlasScale in this._config.allTextureAtlases)
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
		if(hasEventListener(GAFEvent.ERROR))
		{
			this.emit(GAFEvent.ERROR, {bubbles:false, cancelable:false, text:message});
		}
		else
		{
			throw message;
		}
	}
	
	//--------------------------------------------------------------------------
	//
	//  GETTERS AND SETTERS
	//
	//--------------------------------------------------------------------------

	
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
	
	//--------------------------------------------------------------------------
	//
	//  STATIC METHODS
	//
	//--------------------------------------------------------------------------

	private static readStageConfig(tagContent:GAFBytesInput, config:GAFAssetConfig):void
	{
		var stageConfig:CStage=new CStage();

		stageConfig.fps = tagContent.readSByte();
		//stageConfig.color=tagContent.readnumber();
		stageConfig.color=tagContent.readnumber();
		stageConfig.width=tagContent.readUnsignedShort();
		stageConfig.height=tagContent.readUnsignedShort();
		
		config.stageConfig=stageConfig;
	}
	
	private static readDropShadowFilter(source:GAFBytesInput, filter:CFilter):string
	{
		var color:Array<any>=this.readColorValue(source);
		var blurX:number=source.readnumber();
		var blurY:number=source.readnumber();
		var angle:number=source.readnumber();
		var distance:number=source.readnumber();
		var strength:number=source.readnumber();
		var inner:boolean=source.readboolean();
		var knockout:boolean=source.readboolean();

		return filter.addDropShadowFilter(blurX, blurY, color[1], color[0], angle, distance, strength, inner, knockout);
	}

	private static readBlurFilter(source:GAFBytesInput, filter:CFilter):string
	{
		return filter.addBlurFilter(source.readnumber(), source.readnumber());
	}

	private static readGlowFilter(source:GAFBytesInput, filter:CFilter):string
	{
		var color:Array<any>=this.readColorValue(source);
		var blurX:number=source.readnumber();
		var blurY:number=source.readnumber();
		var strength:number=source.readnumber();
		var inner:boolean=source.readboolean();
		var knockout:boolean=source.readboolean();

		return filter.addGlowFilter(blurX, blurY, color[1], color[0], strength, inner, knockout);
	}

	private static readColorMatrixFilter(source:GAFBytesInput, filter:CFilter):string
	{
		var matrix:Array<number>=new Array<number>();
		for(i in 0...20)
		{
			matrix[i]=source.readnumber();
		}

		return filter.addColorMatrixFilter(matrix);
	}

	private static readColorValue(source:GAFBytesInput):Array<number>
	{
		var argbValue:number=source.readUnsignednumber();
		var alpha:number=Std.int(((argbValue>>24)& 0xFF)* 100 / 255)/ 100;
		var color:number=argbValue & 0xFFFFFF;

		return [alpha, color];
	}
	
	// -------------
	
	
 	set defaultScale(defaultScale:number)
	{
		return this._defaultScale=defaultScale;
	}

	
 	set defaultCSF(csf:number)
	{
		return this._defaultContentScaleFactor=csf;
	}
	
}