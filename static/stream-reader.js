/**
 * stream reader
 */

(function (exports, global) {
    if (!('binaryStream' in global)) throw 'require binary-stream.js,but not found';

    /**
	 * @param buffer ArrayBuffer,Unit8Array,DataView,etc...
	 * @param format string
	 *	i 	- Int32,4 bytes
	 * 	C4	- 一个字符数组,长度为4
	 *	s	- Int16,2 bytes
	 * @littleEndian - 大端或者小端,默认小端
	 *	
	 * @code begin
	 *		// 注意: 用'iiS4'格式串来描述一个C结构体
	 *		// 比如: struct demo {
	 *		// 			int m1;
	 *		//			int m2;
	 *		//			char str[4]
	 *		//		};
	 *		var sr = new streamReader(new ArrayBuffer(12), 'iiC4');
	 *		var data = sr.readToEnd(); // data是一个js Array,包含m1,m2,str
	 *		
	 *		for (var i = 0; i < data.length; ++i) {
	 *			console.log(data[i]);
	 *		}
	 *	@code end
	 */
    function streamReader(buffer, format, littleEndian) {
        this._buffer = new binaryStream(buffer);
        this._format = format;
        this._format_length = this._format.length;
        this._littleEndian = typeof littleEndian !== 'undefined' ? littleEndian : false;
        this._byteLength = buffer.byteLength;
        this._readBytes = 0;
        this._encoding = 'gb2312';
    }

    streamReader.prototype = {
        readToEnd: function () {
            var data = [];
            var index = 0;

            do {
                var cur = this._helper(index);

                index += cur.step;
                data.push(cur.data);
            } while (index < this._format_length);

            // 注释掉这一句以至于让reader能够不停的读数据
            //this._readBytes = 0;

            return data;
        },
        setFormat: function (fmt) {
            this._format = fmt;
            this._format_length = this._format.length;
            //this._readBytes = 0;
        },
        reset: function () {
            this._readBytes = 0;
        },
        /**
         * @param encoder String {'binary', 'gb2312'}
         */
        setEncoding: function (encoder) {
            this._encoding = encoder;
        },
        getBuffer: function () {
            return this._buffer;
        },
        _helper: function (index) {
            var ret = {
                step: 1
            };

            switch (this._format.charAt(index)) {
                case 'i':
                    ret.data = this._buffer.getInt32(this._readBytes, this._littleEndian);

                    this._readBytes += 4;
                    break;
                case 'I':
                    ret.data = this._buffer.getUint32(this._readBytes, this._littleEndian);

                    this._readBytes += 4;
                    break;
                case 's':
                    ret.data = this._buffer.getInt16(this._readBytes, this._littleEndian);

                    this._readBytes += 2;
                    break;
                case 'S':
                    ret.data = this._buffer.getUint16(this._readBytes, this._littleEndian);

                    this._readBytes += 2;
                    break;
                case 'b':
                    ret.data = this._buffer.getInt8(this._readBytes);

                    this._readBytes += 1;
                    break;
                case 'B':
                    ret.data = this._buffer.getUint8(this._readBytes);

                    this._readBytes += 1;
                    break;
                case 'f':
                    ret.data = this._buffer.getFloat32(this._readBytes, this._littleEndian);

                    this._readBytes += 4;
                    break;
                case 'F':
                    ret.data = this._buffer.getFloat64(this._readBytes, this._littleEndian);

                    this._readBytes += 8;
                    break;
                case 'C':
                    var substr = this._format.substr(index + 1);
                    var len = parseInt(substr);

                    ret.step = ('' + len).length + 1;

                    if (len === 1) {
                        ret.data = this._buffer.getString(len, this._readBytes);
                    } else {
                        var temp = '';
                        ret.data = '';
                        var tempLen = 0;

                        if (this._encoding === 'gb2312') {
                            for (var i = 0; i < len; ++i) {
                                temp = this._buffer.getUint8(this._readBytes + i);

                                if (temp === 0) break;

                                ret.data += '%' + temp.toString(16);
                                tempLen++;
                            }
                            try { ret.data = Gov.Encrypt.decoderGB2312(ret.data.toUpperCase()); } catch (e) { }
                        } else if (this._encoding === 'jpeg') {
                            // 复制图像数据
                            ret.data = new Uint8Array(this._buffer.buffer, this._readBytes, len);
                        } else if (this._encoding === 'binary') {
                            // 复制二进制数据
                            ret.data = new Uint8Array(this._buffer.buffer, this._readBytes, len);
                        } else {
                            for (var i = 0; i < len; ++i) {
                                temp = this._buffer.getChar(this._readBytes + i);

                                if (temp === '\0') break;

                                ret.data += temp;
                            }
                        }
                    }

                    this._readBytes += len;
                    break;
                default:
                    throw 'unknow format string at ' + index + ',the format string is ' + this._format;
            }

            return ret;
        }
    };

    if ('module' in global && exports === module.exports) {
        module.exports = streamReader;
    } else {
        exports.streamReader = streamReader;
    }

})(this, function () { return this; }());