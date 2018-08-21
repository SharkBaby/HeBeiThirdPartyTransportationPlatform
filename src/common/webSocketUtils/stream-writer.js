/**
 * stream writer
 */
import {
  binaryStream
} from '@/common/webSocketUtils/binary-stream'
let streamWriter = '';
(function (exports, global) {
    // 注释人：向浩
    // 注释时间：2018-07-16
    // 注释原因：通过包管理来进行模块加载，不采用js应用的方式加载
    // if (!('binaryStream' in global)) throw 'require binary-stream.js,but not found';

    streamWriter = function (littleEndian) {
        this._buffer = null;
        this._byte_length = 0;
        this._format = '';
        this._writeBytes = 0;
        this._littleEndian = typeof littleEndian !== 'undefined' ? littleEndian : false;
    }

    /**
	 * @code begin
	 *		// 考虑以下C结构体
	 *		// struct demo {
	 *		// 		int m1;
	 *		//		int m2;
	 *		//		char str[4];
	 *		//	};
	 *		// 如何用js来实现这样的一个结构体呢?看下面的例子代码
	 *		var sw = new streamWriter();
	 *		
	 *		sw.createBuffer(12);
	 *		var data = [];
	 *		
	 *		data.push(12);
	 *		data.push(56);
	 *		data.push('abc');
	 *
	 *		sw.writeBuffer(data, 'iiS3'); // 'iiS3'是格式化字符串,比如i代表C语言里面的int
	 *		var buffer = sw.getBuffer(); // 现在buffer里面就包含了这样的一个结构体
	 *	@code end
	 */
    streamWriter.prototype = {
        createBuffer: function (byteLength) {
            if (typeof byteLength === 'undefined') {
                throw 'arguments byteLength is undefined';
            }
            if (typeof byteLength !== 'number') {
                throw 'arguments byteLength not an number';
            }

            // create buffer
            if (this._buffer !== null) {
                this._buffer = null; // 解引用
            }
            this._buffer = new binaryStream(new Int8Array(byteLength));
            this._byte_length = byteLength;
        },
        writeBuffer: function (array, format) {
            if (this._writeBytes === this._byte_length) {
                throw 'buffer is full';
            }

            if (typeof format === 'undefined') {
                this._format = '';
                for (var i = 0; i < array.length; ++i) {
                    // 注意,如果你不设置格式
                    // 这种方式将有可能截断数据
                    this._format += 'b';
                }
            } else {
                this._format = format;
            }

            var index = 0;
            var length = this._format.length;
            do {
                var value = array.shift();
                var ret = this._helper(index, value);
                index += ret.step;
            } while (index < length);
        },
        getBuffer: function () {
            return this._buffer.buffer;
        },
        getBufferObj:function(){
            return this._buffer;
        },
        _helper: function (index, value) {
            var ret = {
                step: 1
            };

            switch (this._format.charAt(index)) {
                case 'i':
                    this._buffer.setInt32(this._writeBytes, value, this._littleEndian);

                    this._writeBytes += 4;
                    break;
                case 'I':
                    this._buffer.setUint32(this._writeBytes, value, this._littleEndian);

                    this._writeBytes += 4;
                    break;
                case 's':
                    this._buffer.setInt16(this._writeBytes, value, this._littleEndian);

                    this._writeBytes += 2;
                    break;
                case 'S':
                    this._buffer.setUint16(this._writeBytes, value, this._littleEndian);

                    this._writeBytes += 2;
                    break;
                case 'b':
                    this._buffer.setInt8(this._writeBytes, value);

                    this._writeBytes += 1;
                    break;
                case 'B':
                    this._buffer.setUint8(this._writeBytes, value);

                    this._writeBytes += 1;
                    break;
                case 'f':
                    this._buffer.setFloat32(this._writeBytes, value, this._littleEndian);

                    this._writeBytes += 4;
                    break;
                case 'F':
                    this._buffer.setFloat64(this._writeBytes, value, this._littleEndian);

                    this._writeBytes += 8;
                    break;
                case 'C':
                    // 对数组不足的元素补'\0'
                    var substr = this._format.substr(index + 1);
                    var str_len = parseInt(substr);
                    var length = value.length > str_len ? str_len : value.length;
                    var i = 0;

                    ret.step = ('' + str_len).length + 1;

                    for (i = 0; i < length; ++i) {
                        this._buffer.setChar(this._writeBytes + i, value[i]);
                    }
                    for (; i < str_len; ++i) {
                        this._buffer.setChar(this._writeBytes + i, '\0');
                    }

                    this._writeBytes += str_len;
                    break;
                case 'l':
                    this._buffer.setInt64(this._writeBytes, value, this._littleEndian);

                    this._writeBytes += 8;
                    break;
                default:
                    throw 'unknow format string at ' + index + ',the format string is ' + this._format;
            }

            return ret;
        }
    };

    // if ('module' in global && exports === module.exports) {
    //     module.exports = streamWriter;
    // } else {
    //     exports.streamWriter = streamWriter;
    // }
})(this, function () { return this; }());

export {
    streamWriter
}