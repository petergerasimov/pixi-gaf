import { IAddOptions, Loader, LoaderResource } from "pixi.js";
import GAFBytesInput from "../utils/GAFBytesInput";

/**
 * Loader of GAF resources
 * @author Mathieu Anthoine
 */
export default class GAFLoader extends Loader
{

	names:Array<string>=[];
	contents:Array<GAFBytesInput>=[];


	constructor()
	{
		super();
	}

	addGAFFile (pUrl:string):void
	{
		if (pUrl.substring(pUrl.length-4) != ".gaf") throw new Error("GAFLoader supports only .gaf files");
		this.add({ url: pUrl, loadType: 1,xhrType:"arraybuffer"} as IAddOptions);
	}

	override load (cb?:any)
	{
		this.use(this.parseData.bind(this));
		return super.load();
	}

	private parseData(pResource:LoaderResource, pNext:() => void): void
	{
		this.names.push(pResource.url);
		const lBytes = new Uint8Array(pResource.data);
		this.contents.push(new GAFBytesInput(lBytes, 0, lBytes.length));
		pNext();
	}

}