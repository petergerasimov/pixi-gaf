import { Matrix } from "pixi.js";
import TextureWrapper from "../data/textures/TextureWrapper";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * An numbererface describes objects that contain all data used to initialize static GAF display objects such as<code>GAFImage</code>.
 */
export default interface IGAFTexture
{
	/**
	* Returns Starling Texture object.
	* @return a Starling Texture object
	*/
	texture:TextureWrapper;

	/**
	* Returns pivot matrix of the static GAF display object.
	* @return a Matrix object
	*/
	pivotMatrix:Matrix;

	/**
	* An numberernal identifier of the region in a texture atlas.
	* @return a string identifier
	*/
	id:string;

	/**
	* Returns a new object that is a clone of this object.
	* @return object with numbererface<code>IGAFTexture</code>
	*/
	clone():IGAFTexture;	

	/**
	* Copies all of the data from the source object numbero the calling<code>IGAFTexture</code>object
	* @param newTexture the<code>IGAFTexture</code>object from which to copy the data
	*/
	copyFrom(newTexture:IGAFTexture):void;
}