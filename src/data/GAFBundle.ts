/**
 * GAFBundle is utility class that used to save all converted GAFTimelines from bundle in one place with easy access after conversion complete
 */

import IGAFTexture from "../display/IGAFTexture";
import GAFSoundData from "../sound/GAFSoundData";
import GAFAsset from "./GAFAsset";
import GAFTimeline from "./GAFTimeline";

/**
 * TODO
 * @author Mathieu Anthoine
 */
export default class GAFBundle
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

	private _name:string;
	private _soundData:GAFSoundData;
	private _gafAssets:Array<GAFAsset>;
	private _gafAssetsDictionary:Map<String,GAFAsset>;// GAFAsset by SWF name

	// --------------------------------------------------------------------------
	//
	//  CONSTRUCTOR
	//
	// --------------------------------------------------------------------------
	
	constructor()
	{
		this._gafAssets=[];
		this._gafAssetsDictionary=new Map<String,GAFAsset>();
	}

	// --------------------------------------------------------------------------
	//
	//  PUBLIC METHODS
	//
	// --------------------------------------------------------------------------

	/**
	* Disposes all assets in bundle
	*/
	dispose():void
	{
		if(this._gafAssets!=null)
		{
			// GAFSoundManager.getInstance().stopAll();
			// _soundData.dispose();
			this._soundData=null;

			for (const gafAsset of this._gafAssets)
			{
				gafAsset.dispose();
			}
			this._gafAssets=null;
			this._gafAssetsDictionary=null;
		}
	}

	getGAFTimeline(swfName:string, linkage:string="rootTimeline"):GAFTimeline
	{

		let gafTimeline:GAFTimeline=null;
		const gafAsset:GAFAsset = this._gafAssetsDictionary[swfName];
		
		if(gafAsset!=null)
		{
			gafTimeline=gafAsset.getGAFTimelineByLinkage(linkage);
		}
		
		return gafTimeline;
	}

	getCustomRegion(swfName:string, linkage:string, scale?:number, csf?:number):IGAFTexture
	{
		
		let gafTexture:IGAFTexture=null;
		const gafAsset:GAFAsset = this._gafAssetsDictionary[swfName];
		if(gafAsset!=null)
		{
			gafTexture = gafAsset.getCustomRegion(linkage, scale, csf);
		}

		return gafTexture;
	}

	// --------------------------------------------------------------------------
	//
	//  PRIVATE METHODS
	//
	// --------------------------------------------------------------------------

	private getGAFTimelineBySWFNameAndID(swfName:string, id:string):GAFTimeline
	{
		let gafTimeline:GAFTimeline=null;
		const gafAsset:GAFAsset=this._gafAssetsDictionary[swfName];
		if(gafAsset!=null)
		{
			gafTimeline=gafAsset.getGAFTimelineByID(id);
		}

		return gafTimeline;
	}

	addGAFAsset(gafAsset:GAFAsset):void
	{
		
		if(this._gafAssetsDictionary[gafAsset.id]==null)
		{
			this._gafAssetsDictionary[gafAsset.id]=gafAsset;
			this._gafAssets.push(gafAsset);
		}
		else
		{
			throw new Error("Bundle error. More then one gaf asset use id:'" + gafAsset.id + "'");
		}
	}

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

 	get soundData():GAFSoundData
	{
		return this._soundData;
	}

	set soundData(soundData:GAFSoundData)
	{
		this._soundData=soundData;
	}

 	get gafAssets():Array<GAFAsset>
	{
		return this._gafAssets;
	}

	/**
	* The name of the bundle. Used in GAFTimelinesManager to identify specific bundle.
	* Should be specified by user using corresponding setter or by passing the name as second parameter in GAFTimelinesManager.addGAFBundle().
	* The name can be auto-setted by ZipToGAFAssetConverter in two cases:
	* 1)If ZipToGAFAssetConverter.id is not empty ZipToGAFAssetConverter sets the bundle name equal to it's id;
	* 2)If ZipToGAFAssetConverter.id is empty, but gaf package(zip or folder)contain only one *.gaf config file,
	* ZipToGAFAssetConverter sets the bundle name equal to the name of the *.gaf config file.
	*/
	get name():string
	{
		return this._name;
	}

	set name(name:string)
	{
		this._name=name;
	}
}