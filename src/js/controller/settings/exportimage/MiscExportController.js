(function () {
  var ns = $.namespace('pskl.controller.settings.exportimage');

  var BLACK = '#000000';

  ns.MiscExportController = function (piskelController) {
    this.piskelController = piskelController;
  };

  pskl.utils.inherit(ns.MiscExportController, pskl.controller.settings.AbstractSettingController);

  ns.MiscExportController.prototype.init = function () {
    var cDownloadButton = document.querySelector('.c-download-button');
    this.addEventListener(cDownloadButton, 'click', this.onDownloadCFileClick_);
    
    this.StandardExportType = document.querySelector('.');
    this.ARGB8ExportType = document.querySelector('[name=export-type][value=8ARGB]');
    this.MonoExportType = document.querySelector('[name=export-type][value=1BIT]');
  };
 
  ns.MiscExportController.prototype.onDownloadPixelLightCFileClick_ = function (evt) {
 var fileName = this.getPiskelName_() + '.c';
 var cName = this.getPiskelName_().replace(' ','_');
 var width = this.piskelController.getWidth();
 var height = this.piskelController.getHeight();
 var frameCount = this.piskelController.getFrameCount();
 
 // Useful defines for C routines
 var frameStr = '#include <stdint.h>\n\n';
 frameStr += '#define ' + cName.toUpperCase() + '_FRAME_COUNT ' +  this.piskelController.getFrameCount() + '\n';
 frameStr += '#define ' + cName.toUpperCase() + '_FRAME_WIDTH ' + width + '\n';
 frameStr += '#define ' + cName.toUpperCase() + '_FRAME_HEIGHT ' + height + '\n\n';
 
 frameStr += '/* Piskel data for \"' + this.getPiskelName_() + '\" */\n\n';
 
 frameStr += 'static const int8 ' + cName.toLowerCase();
 frameStr += '_data[' + frameCount + '][' + width * height + '] = {\n';
 
 for (var i = 0 ; i < frameCount ; i++) {
 var render = this.piskelController.renderFrameAt(i, true);
 var context = render.getContext('2d');
 var imgd = context.getImageData(0, 0, width, height);
 var pix = imgd.data;
 
 frameStr += '{\n';
 for (var j = 0; j < pix.length; j += 4) {
 frameStr += this.rgbToCHexPixelLight(pix[j], pix[j + 1], pix[j + 2], pix[j + 3]);
 if (j != pix.length - 4) {
 frameStr += ', ';
 }
 if (((j + 4) % (width * 4)) === 0) {
 frameStr += '\n';
 }
 }
 if (i != (frameCount - 1)) {
 frameStr += '},\n';
 } else {
 frameStr += '}\n';
 }
 }
 
 frameStr += '};\n';
 pskl.utils.BlobUtils.stringToBlob(frameStr, function(blob) {
                                   pskl.utils.FileUtils.downloadAsFile(blob, fileName);
                                   }.bind(this), 'application/text');
  };

  ns.MiscExportController.prototype.onDownloadCFileClick_ = function (evt) {
  
    var fileName = this.getPiskelName_() + '.c';
    var cName = this.getPiskelName_().replace(' ','_');
    var width = this.piskelController.getWidth();
    var height = this.piskelController.getHeight();
    var frameCount = this.piskelController.getFrameCount();
    
    

    // Useful defines for C routines
    /*var frameStr = '#include <stdint.h>\n\n';
    frameStr += '#define ' + cName.toUpperCase() + '_FRAME_COUNT ' +  this.piskelController.getFrameCount() + '\n';
    frameStr += '#define ' + cName.toUpperCase() + '_FRAME_WIDTH ' + width + '\n';
    frameStr += '#define ' + cName.toUpperCase() + '_FRAME_HEIGHT ' + height + '\n\n';
    */

    var frameStr = '/* Piskel data for \"' + this.getPiskelName_() + '\" */\n\n';

    frameStr += 'static const byte ' + cName.toLowerCase() + '[] PROGMEM = {\n';
    frameStr += width + ', ' + height + ',\n';

    for (var i = 0 ; i < frameCount ; i++) {
      var render = this.piskelController.renderFrameAt(i, true);
      var context = render.getContext('2d');
      var imgd = context.getImageData(0, 0, width, height);
      var pix = imgd.data;

      //frameStr += '{\n';
      for (var j = 0; j < pix.length; j += 4) {
        frameStr += this.rgbToCHexPixelLight(pix[j], pix[j + 1], pix[j + 2], pix[j + 3]);
        if (j != pix.length - 4) {
          frameStr += ', ';
        }
        if (((j + 4) % (width * 4)) === 0) {
          frameStr += '\n';
        }
      }
      /*if (i != (frameCount - 1)) {
        frameStr += '},\n';
      } else {
        frameStr += '}\n';
      }
      */
    }

    frameStr += '};\n';
    pskl.utils.BlobUtils.stringToBlob(frameStr, function(blob) {
      pskl.utils.FileUtils.downloadAsFile(blob, fileName);
    }.bind(this), 'application/text');
  };

  ns.MiscExportController.prototype.getPiskelName_ = function () {
    return this.piskelController.getPiskel().getDescriptor().name;
  };

  ns.MiscExportController.prototype.rgbToCHex = function (r, g, b, a) {
    var hexStr = '0x';
    hexStr += ('00' + a.toString(16)).substr(-2);
    hexStr += ('00' + b.toString(16)).substr(-2);
    hexStr += ('00' + g.toString(16)).substr(-2);
    hexStr += ('00' + r.toString(16)).substr(-2);
    return hexStr;
  };
 
 ns.MiscExportController.prototype.rgbToCHexPixelLight = function (r, g, b, a) {
 var hexStr = '0x' + (parseInt((a)/64)*64+parseInt((b)/64)*16+parseInt((g)/64)*4+parseInt((r)/64)).toString(16);
 return hexStr;
 };
})();
