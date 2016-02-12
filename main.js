var outStream = require('fs').createWriteStream('./out.js.bmp');

// InfoHeader

outStream.write('BM');                                 // 00-01: Signature
outStream.write(new Buffer([0x3A, 0x2F, 0x2A, 0x00])); // 02-05: Total file size
// 0x002A2F3A in little-endian (2764602)
// At the same time it's ASCII :/*\0
outStream.write(new Buffer([0x00, 0x00, 0x00, 0x00])); // 06-09: Reserved, zeroes
outStream.write(new Buffer([0x36, 0x00, 0x00, 0x00])); // 0A-0D: File offset to Raster data, 54

// Header

outStream.write(new Buffer([0x28, 0x00, 0x00, 0x00])); // 0E-11: Sizeof, 40
outStream.write(new Buffer([0xEC, 0x01, 0x00, 0x00])); // 12-15: Image width, 492
outStream.write(new Buffer([0x51, 0x07, 0x00, 0x00])); // 16-19: Image height, 1873

// A brief note here. The width and height are picked in a special way.
// (492 * 1873 * 3) + 54 = 0x002A2F3A

outStream.write(new Buffer([0x01, 0x00]));             // 1A-1B: Number of planes. Always 1
outStream.write(new Buffer([0x18, 0x00]));             // 1C-1D: BitCount, 24. (3 bytes per pixel)
outStream.write(new Buffer([0x00, 0x00, 0x00, 0x00])); // 1E-21: Compression, none.
outStream.write(new Buffer([0x00, 0x00, 0x00, 0x00])); // 22-25: Image size. 0 is a valid value if compression is none
outStream.write(new Buffer([0x13, 0x0B, 0x00, 0x00])); // 26-29: Horizontal resolution. Any value, 2835 pixels per meter in this case
outStream.write(new Buffer([0x13, 0x0B, 0x00, 0x00])); // 2A-2D: Vertical resolution. Any value, 2835 pixels per meter in this case
outStream.write(new Buffer([0x00, 0x00, 0x00, 0x00])); // 2E-31: Number of actually used colors. 0, I guess.
outStream.write(new Buffer([0x00, 0x00, 0x00, 0x00])); // 32-35: Number of important colors. 0: every color

// Pixel data

var buf = new Buffer(492 * 1873 * 3);
buf.fill(0x3B); // Whole lot of semicolons
buf.write('*/;', 0); // Close the string.

var text = require('fs').readFileSync('mobydick.txt', 'utf-8');
var code = 'document.write("<pre>"+' + JSON.stringify(text) + ')';

buf.write(code, 3);

outStream.write(buf);
