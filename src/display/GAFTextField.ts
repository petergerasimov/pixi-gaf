// import com.github.haxePixiGAF.data.GAF;
// import com.github.haxePixiGAF.data.config.CFilter;
// import com.github.haxePixiGAF.data.config.CTextFieldObject;
// import com.github.haxePixiGAF.text.TextFormatAlign;
// import js.Lib;
// import pixi.core.display.DisplayObject.DestroyOptions;
// import pixi.core.graphics.Graphics;
// import pixi.core.math.Matrix;
// import pixi.core.math.Point;
// import pixi.core.text.DefaultStyle;
// import pixi.core.text.Text;
// import haxe.extern.EitherType;
// import pixi.core.text.TextStyle;

// using com.github.haxePixiGAF.utils.MatrixUtility;

import { Point, Text, Graphics, IDestroyOptions, TextStyle } from "pixi.js";
import CFilter from "../data/config/CFilter";
import CTextFieldObject from "../data/config/CTextFieldObject";
import TextFormatAlign from "../text/TextFormatAlign";
import GAFContainer from "./GAFContainer";
import IGAFDebug from "./IGAFDebug";

/**
 * GAFTextField is a text entry control that extends functionality of the<code>feathers.controls.TextInput</code>
 * for the GAF library needs.
 * All dynamic text fields(including input text fields)in GAF library are instances of the GAFTextField.
 */
/**
 * TODO
 * @author Mathieu Anthoine
 */
export default class GAFTextField extends GAFContainer implements IGAFDebug
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

	private static HELPER_POINT:Point=new Point();
	
	private _scale:number;
	private _csf:number;

	private __debugOriginalAlpha:number=null;

	private _orientationChanged:boolean;

	private _config:CTextFieldObject;
	
	private textField:Text;

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------

	constructor(config:CTextFieldObject, scale:number=1, csf:number=1, debug = false)
	{
		super();
		
		config.textFormat.wordWrap = true;
		config.textFormat.wordWrapWidth = config.width;
		
		this.textField = new Text(config.text, config.textFormat);
		
		if(Number.isNaN(scale))scale=1;
		if(Number.isNaN(csf))csf=1;
				
		this._scale=scale;
		this._csf=csf;
		
		if (config.textFormat.align == TextFormatAlign.CENTER) {
			this.textField.anchor.x = 0.5;
			this.textField.x = config.width / 2;
		}
		else if (config.textFormat.align == TextFormatAlign.RIGHT) {
			this.textField.anchor.x = 1;
			this.textField.x = config.width;
		}
		
		if (debug) {
			const lGraph:Graphics = new Graphics();
			lGraph.beginFill(0x00FFFF);
			lGraph.drawRect(0,0, config.width, config.height);
			lGraph.endFill();
			lGraph.alpha = 0.5;
			this.addChild(lGraph);
		}
		
		// TODO: Input text ?
		// restrict=config.restrict;
		// isEditable=config.editable;
		// isEnabled=isEditable || config.selectable;// editable text must be selectable anyway
		// displayAsPassword=config.displayAsPassword;
		// maxChars=config.maxChars;
		// verticalAlign=TextInput.VERTICAL_ALIGN_TOP;

		// textEditorProperties.textFormat=cloneTextFormat(config.textFormat);
		// textEditorProperties.embedFonts=GAF.useDeviceFonts ? false:config.embedFonts;
		// textEditorProperties.multiline=config.multiline;
		// textEditorProperties.wordWrap=config.wordWrap;
		// textEditorFactory=function():ITextEditor
		// {
			// return new GAFTextFieldTextEditor(_scale, _csf);
		// };

		this.addChild(this.textField);
		
		this.invalidateSize();

		this._config = config;

	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	// Creates a new instance of GAFTextField.
	copy():GAFTextField
	{
		const clone:GAFTextField=new GAFTextField(this._config, this._scale, this._csf);
		clone.alpha=this.alpha;
		clone.visible=this.visible;
		clone.transformationMatrix=this.transformationMatrix;
		// TODO
		// clone.textEditorFactory=textEditorFactory;
		clone.setFilterConfig(this._filterConfig, this._filterScale);

		return clone;
	}

	/**
	* @private
	* We need to update the textField size after the textInput was transformed
	*/
	invalidateSize():void
	{
		// if(textEditor && textEditor is TextFieldTextEditor)
		// {
			// (textEditor as TextFieldTextEditor).invalidate(INVALIDATION_FLAG_SIZE);
		// }
		// invalidate(INVALIDATION_FLAG_SIZE);
	}

 	set debugColors(value:Array<number>)
	{
		// var t:Texture=Texture.fromColor(1, 1, DebugUtility.RENDERING_NEUTRAL_COLOR, 1, true);
		// var bgImage:Image=new Image(t);
		// var alpha0:number;
		// var alpha1:number;
//
		// switch(value.length)
		// {
			// case 1:
				// bgImage.color=value[0];
				// bgImage.alpha=(value[0]>>>24)/ 255;
				// break;
			// case 2:
				// bgImage.setVertexColor(0, value[0]);
				// bgImage.setVertexColor(1, value[0]);
				// bgImage.setVertexColor(2, value[1]);
				// bgImage.setVertexColor(3, value[1]);
//
				// alpha0=(value[0]>>>24)/ 255;
				// alpha1=(value[1]>>>24)/ 255;
				// bgImage.setVertexAlpha(0, alpha0);
				// bgImage.setVertexAlpha(1, alpha0);
				// bgImage.setVertexAlpha(2, alpha1);
				// bgImage.setVertexAlpha(3, alpha1);
				// break;
			// case 3:
				// bgImage.setVertexColor(0, value[0]);
				// bgImage.setVertexColor(1, value[0]);
				// bgImage.setVertexColor(2, value[1]);
				// bgImage.setVertexColor(3, value[2]);
//
				// alpha0=(value[0]>>>24)/ 255;
				// bgImage.setVertexAlpha(0, alpha0);
				// bgImage.setVertexAlpha(1, alpha0);
				// bgImage.setVertexAlpha(2,(value[1]>>>24)/ 255);
				// bgImage.setVertexAlpha(3,(value[2]>>>24)/ 255);
				// break;
			// case 4:
				// bgImage.setVertexColor(0, value[0]);
				// bgImage.setVertexColor(1, value[1]);
				// bgImage.setVertexColor(2, value[2]);
				// bgImage.setVertexColor(3, value[3]);
//
				// bgImage.setVertexAlpha(0,(value[0]>>>24)/ 255);
				// bgImage.setVertexAlpha(1,(value[1]>>>24)/ 255);
				// bgImage.setVertexAlpha(2,(value[2]>>>24)/ 255);
				// bgImage.setVertexAlpha(3,(value[3]>>>24)/ 255);
				// break;
		// }
//
		// return backgroundSkin=bgImage;
	}

	override setFilterConfig(value:CFilter, scale:number=1):void
	{
		if(this._filterConfig !=value || this._filterScale !=scale)
		{
			if(value!=null)
			{
				this._filterConfig=value;
				this._filterScale=scale;
			}
			else
			{
				this._filterConfig=null;
				this._filterScale=null;
			}

			this.applyFilter();
		}
	}

	// --------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	private applyFilter():void
	{
		// if(textEditor)
		// {
			// if(textEditor is GAFTextFieldTextEditor)
			// {
				// (textEditor as GAFTextFieldTextEditor).setFilterConfig(_filterConfig, _filterScale);
			// }
			// else if(_filterConfig && !Number.isNaN(_filterScale))
			// {
				// if(_filterChain)
				// {
					// _filterChain.dispose();
				// }
				// else
				// {
					// _filterChain=new GAFFilterChain();
				// }
//
				// _filterChain.setFilterData(_filterConfig);
				// filter=_filterChain;
			// }
			// else if(filter)
			// {
				// filter.dispose();
				// filter=null;
//
				// _filterChain=null;
			// }
		// }
	}

	private __debugHighlight():void
	{
		if(Number.isNaN(this.__debugOriginalAlpha))
		{
			this.__debugOriginalAlpha=this.alpha;
		}
		this.alpha=1;
	}

	private __debugLowlight():void
	{
		if(Number.isNaN(this.__debugOriginalAlpha))
		{
			this.__debugOriginalAlpha=this.alpha;
		}
		this.alpha=.05;
	}

	private __debugResetLight():void
	{
		if(!Number.isNaN(this.__debugOriginalAlpha))
		{
			this.alpha=this.__debugOriginalAlpha;
			this.__debugOriginalAlpha=null;
		}
	}

	// --------------------------------------------------------------------------
	//
	// OVERRIDDEN METHODS
	//
	// --------------------------------------------------------------------------

	// override private createTextEditor():void
	// {
		// super.createTextEditor();
//
		// applyFilter();
	// }

	override destroy(options?: boolean | IDestroyOptions):void
	{
		super.destroy(options);
		this._config=null;
	}

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
	* The width of the text in pixels.
	* @return {Number}
	*/
 	get textWidth():number
	{
		// validate();
		// textEditor.measureText(HELPER_POINT);

		return GAFTextField.HELPER_POINT.x;
	}

	/**
	* The height of the text in pixels.
	* @return {Number}
	*/
 	get textHeight():number
	{
		// validate();
		// textEditor.measureText(HELPER_POINT);

		return GAFTextField.HELPER_POINT.y;
	}
	
	get text():string {
		return this.textField.text;
	}
	
	set text(pText:string) {
		this.textField.text = pText;
	}
	
	get style ():TextStyle {
		return this.textField.style as TextStyle;
	}

	// --------------------------------------------------------------------------
	//
	//  STATIC METHODS
	//
	// --------------------------------------------------------------------------
	private cloneTextFormat(textFormat:TextStyle):TextStyle
	{
		if (textFormat==null) throw new Error("Argument \"textFormat\" must be not null.");

		const result:TextStyle = new TextStyle();
		result.fontFamily=textFormat.fontFamily;
		result.fontSize=textFormat.fontSize;
		result.fill = textFormat.fill;
		result.fontWeight=textFormat.fontWeight;
		result.fontStyle=textFormat.fontStyle;
		// textFormat. = underline;
		// textFormat. = url;
		// textFormat. = target;
		result.align=textFormat.align;
		// textFormat. = leftMargin;
		// textFormat. = rightMargin;
		// textFormat. = blockIndent;
		// textFormat. = leading;

		return result;
	}
	

}