/* eslint-disable valid-jsdoc */
/**
 * AS3 Conversion of Starling TextureAtlas class
 * @author Mathieu Anthoine
 */

import { Rectangle } from "pixi.js";
import SubTexture from "./SubTexture";
import TextureWrapper from "./TextureWrapper";

/** A texture atlas is a collection of many smaller textures in one big image. This class
 *  is used to access textures from such an atlas.
 *  
 *<p>Using a texture atlas for your textures solves two problems:</p>
 *  
 *<ul>
 *	<li>Whenever you switch between textures, the batching of image objects is disrupted.</li>
 *	<li>Any Stage3D texture has to have side lengths that are powers of two. Starling hides 
 *		this limitation from you, but at the cost of additional graphics memory.</li>
 *</ul>
 *  
 *<p>By using a texture atlas, you avoid both texture switches and the power-of-two 
 *  limitation. All textures are within one big "super-texture", and Starling takes care that 
 *  the correct part of this texture is displayed.</p>
 *  
 *<p>There are several ways to create a texture atlas. One is to use the atlas generator 
 *  script that is bundled with Starling's sibling, the<a href="http://www.sparrow-framework.org">
 *  Sparrow framework</a>. It was only tested in Mac OS X, though. A great multi-platform 
 *  alternative is the commercial tool<a href="http://www.texturepacker.com">
 *  Texture Packer</a>.</p>
 *  
 *<p>Whatever tool you use, Starling expects the following file format:</p>
 * 
 *<listing>
 * 	&lt;TextureAtlas imagePath='atlas.png'&gt;
 * 	 &lt;SubTexture name='texture_1' x='0'  y='0' width='50' height='50'/&gt;
 * 	 &lt;SubTexture name='texture_2' x='50' y='0' width='20' height='30'/&gt;
 * 	&lt;/TextureAtlas&gt;
 *</listing>
 *  
 *<strong>Texture Frame</strong>
 *
 *<p>If your images have transparent areas at their edges, you can make use of the 
 *<code>frame</code>property of the Texture class. Trim the texture by removing the 
 *  transparent edges and specify the original texture size like this:</p>
 * 
 *<listing>
 * 	&lt;SubTexture name='trimmed' x='0' y='0' height='10' width='10'
 * 		frameX='-10' frameY='-10' frameWidth='30' frameHeight='30'/&gt;
 *</listing>
 *
 *<strong>Texture Rotation</strong>
 *
 *<p>Some atlas generators can optionally rotate individual textures to optimize the texture
 *  distribution. This is supported via the boolean attribute "rotated". If it is set to
 *<code>true</code>for a certain subtexture, this means that the texture on the atlas
 *  has been rotated by 90 degrees, clockwise. Starling will undo that rotation by rotating
 *  it counter-clockwise.</p>
 *
 *<p>In this case, the positional coordinates(<code>x, y, width, height</code>)
 *  are expected to point at the subtexture as it is present on the atlas(in its rotated
 *  form), while the "frame" properties must describe the texture in its upright form.</p>
 *
 */
export default class TextureAtlas
{
	private _atlasTexture:TextureWrapper;
	private _subTextures:Map<string,TextureWrapper>;
	private _subTextureNames:Array<string>;
	
	/** helper objects */
	private static sNames:Array<string>=[];
	
	/** Create a texture atlas from a texture by parsing the regions from an XML file. */
	constructor(texture:TextureWrapper)
	{
		this._subTextures=new Map<string,TextureWrapper>();
		this._atlasTexture=texture;
	}
	
	/** Disposes the atlas texture. */
	dispose():void
	{
		this._atlasTexture.destroy();
	}
	
	/** Retrieves a SubTexture by name. Returns<code>null</code>if it is not found. */
	getTexture(name:string):TextureWrapper
	{
		return this._subTextures[name];
	}
	
	/** Returns all textures that start with a certain string, sorted alphabetically
	*(especially useful for "MovieClip"). */
	getTextures(prefix:string="", out?:Array<TextureWrapper>  ):Array<TextureWrapper>
	{
		if (out == null) out = [];

		for (const name of this.getNames(prefix, TextureAtlas.sNames)) {
			out[out.length] = this.getTexture(name);// avoid 'push'
		}
		
		// sNames.length=0;
		TextureAtlas.sNames=[];
		return out;
	}
	
	/** Returns all texture names that start with a certain string, sorted alphabetically. */
	getNames(prefix:string="", out?:Array<string>):Array<string>
	{
		if (out == null) out = [];
		let name:string;
		
		if(this._subTextureNames==null)
		{
			// optimization:store sorted list of texture names
			this._subTextureNames=[];

			for(const name of this._subTextures.keys()) {
				this._subTextureNames[this._subTextureNames.length]=name; 
			}

			this._subTextureNames.sort(function (pA:string,pB:string):number { return pA.toLowerCase()<pB.toLowerCase() ? -1 : 1;});
		}

		for(name in this._subTextureNames) {
			if(name.indexOf(prefix)==0) out[out.length]=name;
		}
		
		return out;
	}
	
	/** Returns the region rectangle associated with a specific name, or<code>null</code>
	*  if no region with that name has been registered. */
	getRegion(name:string):Rectangle
	{
		const subTexture:SubTexture=this._subTextures[name];
		return subTexture!=null ? subTexture.region:null;
	}
	
	/** Returns the frame rectangle of a specific region, or<code>null</code>if that region 
	*  has no frame. */
	getFrame(name:string):Rectangle
	{
		const subTexture:SubTexture=this._subTextures[name];
		return subTexture!=null ? subTexture.frame:null;
	}
	
	/** If true, the specified region in the atlas is rotated by 90 degrees(clockwise). The
	*  SubTexture is thus rotated counter-clockwise to cancel out that transformation. */
	getRotation(name:string):boolean
	{
		const subTexture:SubTexture=this._subTextures[name];
		return subTexture!=null ? subTexture.rotated:false;
	}

	/** Adds a named region for a SubTexture(described by rectangle with coordinates in
	*  points)with an optional frame. */
	addRegion(name:string, region:Rectangle, frame:Rectangle=null, rotated:boolean=false):void
	{
		this._subTextures[name]=new SubTexture(this._atlasTexture, region, false, frame, rotated);
		this._subTextureNames=null;
	}
	
	/** Removes a region with a certain name. */
	removeRegion(name:string):void
	{
		const subTexture:SubTexture=this._subTextures[name];
		// if(subTexture) subTexture.dispose();
		if(subTexture!=null) subTexture.destroy();
		this._subTextures.delete(name);
		this._subTextureNames=null;
	}
	
	/** The base texture that makes up the atlas. */
	
 	get texture():TextureWrapper { return this._atlasTexture;}
	
	// utility methods

	private static parseBool(value:string):boolean
	{
		return value.toLowerCase()=="true";
	}
}