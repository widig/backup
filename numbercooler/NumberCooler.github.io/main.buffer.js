

Router.addPage({name:"buffer",template:"base"},function(args,template,router) { // flow 


	/*
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();


	/*	
	buffer
		ctors
		
			new Buffer(array)
			new Buffer(buffer)
			new Buffer(arrayBuffer)
			new Buffer(size)
			new Buffer(str[, encoding])

		static attributes
		
			Buffer.byteLength(string[, encoding])
			Buffer.compare(buf1, buf2)
			Buffer.concat(list[, totalLength])
			Buffer.isBuffer(obj)
			Buffer.isEncoding(encoding)
		
		members:
		
			buf[index]
			buf.compare(otherBuffer)
			buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])
			buf.entries()
			buf.equals(otherBuffer)
			buf.fill(value[, offset[, end]][, encoding])
			buf.indexOf(value[, byteOffset][, encoding])
			buf.includes(value[, byteOffset][, encoding])
			buf.keys()
			buf.length
			buf.readDoubleBE(offset[, noAssert])
			buf.readDoubleLE(offset[, noAssert])
			buf.readFloatBE(offset[, noAssert])
			buf.readFloatLE(offset[, noAssert])
			buf.readInt8(offset[, noAssert])
			buf.readInt16BE(offset[, noAssert])
			buf.readInt16LE(offset[, noAssert])
			buf.readInt32BE(offset[, noAssert])
			buf.readInt32LE(offset[, noAssert])
			buf.readIntBE(offset, byteLength[, noAssert])
			buf.readIntLE(offset, byteLength[, noAssert])
			buf.readUInt8(offset[, noAssert])
			buf.readUInt16BE(offset[, noAssert])
			buf.readUInt16LE(offset[, noAssert])
			buf.readUInt32BE(offset[, noAssert])
			buf.readUInt32LE(offset[, noAssert])
			buf.readUIntBE(offset, byteLength[, noAssert])
			buf.readUIntLE(offset, byteLength[, noAssert])
			buf.slice([start[, end]])
			buf.toString([encoding[, start[, end]]])
			buf.toJSON()
			buf.values()
			buf.write(string[, offset[, length]][, encoding])
			buf.writeDoubleBE(value, offset[, noAssert])
			buf.writeDoubleLE(value, offset[, noAssert])
			buf.writeFloatBE(value, offset[, noAssert])
			buf.writeFloatLE(value, offset[, noAssert])
			buf.writeInt8(value, offset[, noAssert])
			buf.writeInt16BE(value, offset[, noAssert])
			buf.writeInt16LE(value, offset[, noAssert])
			buf.writeInt32BE(value, offset[, noAssert])
			buf.writeInt32LE(value, offset[, noAssert])
			buf.writeIntBE(value, offset, byteLength[, noAssert])
			buf.writeIntLE(value, offset, byteLength[, noAssert])
			buf.writeUInt8(value, offset[, noAssert])
			buf.writeUInt16BE(value, offset[, noAssert])
			buf.writeUInt16LE(value, offset[, noAssert])
			buf.writeUInt32BE(value, offset[, noAssert])
			buf.writeUInt32LE(value, offset[, noAssert])
			buf.writeUIntBE(value, offset, byteLength[, noAssert])
			buf.writeUIntLE(value, offset, byteLength[, noAssert])
			
			// extensions
			
			buf.writeStructBE(value,offset [,noAssert])
			buf.writeStructLE(value,offset [,noAssert])
			buf.readStructBE(offset [,noAssert])
			buf.readStructLE(offset [,noAssert])
			
			buf.writeUInt64BE(value,offset[,noAssert)
			buf.writeUInt64LE(value,offset[,noAssert)
			buf.writeInt64BE(value,offset[,noAssert)
			buf.writeInt64LE(value,offset[,noAssert)
			
			buf.readUInt64BE(offset[,noAssert)
			buf.readUInt64LE(offset[,noAssert)
			buf.readInt64BE(offset[,noAssert)
			buf.readInt64LE(offset[,noAssert)

			buf.writeBIBE(value,size,offset [,noAssert])
			buf.writeBILE(value,size,offset [,noAssert])
			buf.readBIBE(size,offset [,noAssert])
			buf.readBILE(size,offset [,noAssert])
	*/
		

});