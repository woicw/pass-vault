import{__awaiter as e,__generator as t}from"./_virtual/_tslib.js";import r from"node-forge";import{writeFileContent as n,deleteFile as i}from"./file.js";import o from"inquirer";import{Encryption as s}from"./types.js";import{getPath as u}from"./utils.js";import c from"chalk";var getAes=function(){return r.random.getBytesSync(32)},createAes=function(){return e(void 0,void 0,void 0,function(){var e,i;return t(this,function(t){switch(t.label){case 0:return[4,getAes()];case 1:return e=t.sent(),[4,n(u(s.AES),r.util.bytesToHex(e))];case 2:return t.sent(),i=r.util.bytesToHex(e),console.log(c.red("AES Private Key:")+c.yellow(" ".concat(i))),[2,i]}})})},decrypt=function(e,t){return new Promise(function(n,i){t&&e||i();try{var o=r.util.hexToBytes(t.substring(0,32)),s=t.substring(32),u=r.cipher.createDecipher("AES-CBC",r.util.hexToBytes(e));u.start({iv:o}),u.update(r.util.createBuffer(r.util.hexToBytes(s))),u.finish();var c=u.output;n(c.toString())}catch(e){console.log(e,"error"),i(e)}})},encrypt=function(e,t){return new Promise(function(n,i){t&&e||i();var o=r.util.hexToBytes(e);try{var s=r.random.getBytesSync(16),u=r.cipher.createCipher("AES-CBC",o);u.start({iv:s}),u.update(r.util.createBuffer(t)),u.finish();var c=u.output,a=r.util.bytesToHex(s)+r.util.bytesToHex(c.getBytes());n(a)}catch(e){i(e)}})},setAes=function(){return e(void 0,void 0,void 0,function(){var e;return t(this,function(t){switch(t.label){case 0:return[4,o.prompt([{type:"input",name:"key",message:"Enter your key:"}])];case 1:return e=t.sent(),[4,n(u(s.AES),e.key)];case 2:return t.sent(),[2]}})})},del=function(){return e(void 0,void 0,void 0,function(){return t(this,function(e){return[2,i(u(s.AES))]})})};export{createAes,decrypt,del,encrypt,getAes,setAes};