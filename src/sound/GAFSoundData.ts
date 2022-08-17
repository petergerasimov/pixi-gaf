import CSound from "../data/config/CSound";

/**
 * TODO
 * @author Mathieu Anthoine
 *
 * 
 */
export default class GAFSoundData
{
	private onFail:()=>void;
	private onSuccess:()=>void;
	private _sounds: any;
	private _soundQueue:Array<CSound>;

	// getSoundByLinkage(linkage:string):Sound
	// {
		// if(_sounds)
		// {
			// return _sounds[linkage];
		// }
		// return null;
	// }

	addSound(soundData:CSound, swfName:string, soundBytes:GAFBytesInput):void
	{
		// var sound:Sound=new Sound();
		// if(soundBytes)
		// {
			// if(soundBytes.position>0)
			// {
				// soundData.sound=_sounds[soundData.linkageName];
				// return;
			// }
			// else
			// {
				// sound.loadCompressedDataFromByteArray(soundBytes, soundBytes.length);
			// }
		// }
		// else
		// {
			// _soundQueue ||=new Array<CSound>();
			// _soundQueue.push(soundData);
		// }
//
		// soundData.sound=sound;
//
		// _sounds ||={};
		// if(soundData.linkageName.length>0)
		// {
			// _sounds[soundData.linkageName]=sound;
		// }
		// else
		// {
			// _sounds[swfName] ||={};
			// _sounds[swfName][soundData.soundID]=sound;
		// }
	}
//
	// gaf_private getSound(soundID:number, swfName:string):Sound
	// {
		// if(_sounds)
		// {
			// return _sounds[swfName][soundID];
		// }
		// return null;
	// }
//
	// gaf_private loadSounds(onSuccess:Function, onFail:Function):void
	// {
		// onSuccess=onSuccess;
		// onFail=onFail;
		// loadSound();
	// }
//
	// function dispose():void
	// {
		// for(var sound:Sound in _sounds)
		// {
			// sound.close();
		// }
	// }
//
	// private loadSound():void
	// {
		// var soundDataConfig:CSound=_soundQueue.pop();
		// with(soundDataConfig.sound)
		// {
			// addEventListener(Event.COMPLETE, onSoundLoaded);
			// addEventListener(IOErrorEvent.IO_ERROR, onError);
			// load(new URLRequest(soundDataConfig.source));
		// }
	// }
//
	// private onSoundLoaded(event:Event):void
	// {
		// removeListeners(event);
//
		// if(_soundQueue.length>0)
		// {
			// loadSound();
		// }
		// else
		// {
			// onSuccess();
			// onSuccess=null;
			// onFail=null;
		// }
	// }
//
	// private onError(event:IOErrorEvent):void
	// {
		// removeListeners(event);
		// onFail(event);
		// onFail=null;
		// onSuccess=null;
	// }
//
	// private removeListeners(event:Event):void
	// {
		// var sound:Sound=event.target as Sound;
		// sound.removeEventListener(Event.COMPLETE, onSoundLoaded);
		// sound.removeEventListener(IOErrorEvent.IO_ERROR, onError);
	// }
//
	// gaf_private get hasSoundsToLoad():boolean
	// {
		// return _soundQueue && _soundQueue.length>0;
	// }
}