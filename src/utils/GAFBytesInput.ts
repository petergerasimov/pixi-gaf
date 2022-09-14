/**
 * AS3 ByteArray "Wrapper"
 * @author Mathieu Anthoine
 */
 export default class GAFBytesInput {
	bigEndian = true;
	constructor(private buffer: ArrayBuffer, public position = 0, public length = buffer.byteLength) {}

	readBytes(position: number, length: number) {
		this.position += position;
		return new Int8Array(this.buffer.slice(this.position,this.position += length));
	}

	readByte() {
		return (new Int8Array(this.buffer.slice(this.position++,this.position)))[0];
	}

	readSByte() {
		return this.readByte();
	}
	
	readUnsignedByte () {
		return (new Uint8Array(this.buffer.slice(this.position++,this.position)))[0];
	}

	readUint16() {
		return this.readUnsignedByte() | (this.readUnsignedByte() << 8);
	}

	readUint16BE() {
		return (this.readUnsignedByte() << 8) | this.readUnsignedByte();
	}

	readInt16() {
		return (new Int16Array(this.buffer.slice(this.position,this.position+=2)))[0];
	}

	readInt16BE() {
		const lByte =  this.readUint16BE() - 32768;
		return lByte > 32767 ? lByte-65536 : lByte;
	}

	// Couldn't find in haxe docs what this is supposed to do
	readnumber16() {
		return this.bigEndian ? this.readInt16BE() : this.readInt16();
	}
	
	readShort() {
		return this.readnumber16();
	}	
	
	readUnsignedShort () {
		return this.bigEndian ? this.readUint16BE() : this.readUint16();
	}
	
	readnumber() {
		// return this.readnumber32();
		// const lnumber = this.readnumber32();
		// return lnumber > 2147483648 ? lnumber - 4294967296 : lnumber;
		return (new Float32Array(this.buffer.slice(this.position,this.position+=4)))[0];
	}
	
	readUnsignednumber() {
		return this.readnumber32();
	}

	// may return an Unsigned number32 but number32 are converted to number32 if they are above 2147483648
	private readnumber32 () {
		return this.readnumber();

		const lA:number = this.readUnsignedShort();
		const lB:number = this.readUnsignedShort();
		return (lB << 16) | lA;
	}
	
	readboolean () {
		return this.readSByte() != 0;
	}
	
	readUTF() {
		return String.fromCharCode(this.readUint16());
	}
	
	
}