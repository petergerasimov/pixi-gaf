/**
 * AS3 ByteArray "Wrapper"
 * @author Mathieu Anthoine
 */
export default class GAFBytesInput {
	bigEndian = true;
	constructor(private buffer: ArrayBuffer, public position = 0, public length = buffer.byteLength) {}

	readBytes(position: number, length: number) {
		this.position += position;
		return new Uint8Array(this.buffer.slice(this.position,this.position += length));
	}

	readByte() {
		return (new Uint8Array(this.buffer.slice(this.position++,this.position)))[0];
	}

	readSByte() {
		const lByte = this.readByte();
		return lByte > 127 ? lByte-256 : lByte;
	}
	
	readUnsignedByte () {
		return this.readByte();
	}

	readUint16() {
		return this.readByte() | (this.readByte() << 8);
	}

	readUint16BE() {
		return (this.readByte() << 8) | this.readByte();
	}

	readInt16() {
		const lByte =  this.readUint16() - 32768;
		return lByte > 32767 ? lByte-65536 : lByte;
		
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
	
	readnumber () {
		// return this.readnumber32();
		const lnumber = this.readnumber32();
		return lnumber > 2147483648 ? lnumber - 4294967296 : lnumber;
	}
	
	readUnsignednumber() {
		return this.readnumber32();
	}

	// may return an Unsigned number32 but number32 are converted to number32 if they are above 2147483648
	private readnumber32 () {
		const lA:number = this.readUnsignedShort();
		const lB:number = this.readUnsignedShort();
		return (lB << 16) + lA;
	}
	
	readboolean () {
		return this.readSByte() != 0;
	}
	
	readUTF() {
		return String.fromCharCode(this.readUint16());
	}
	
	
}