var pleeease = require('../../node_modules/pleeease-brunch/node_modules/pleeease');
var prismjs  = require('prismjs');

var input = document.querySelector('#input');
var output = document.querySelector('#output');

if(location.search !== '') {
  var q = location.search.substring(1);
  input.value = decodeURI(q);
}

var options = {
	"optimizers": {
		"minifier": false
	}
};
function htmlEntities(str) {
  return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
var doPleeease = function () {
  var source = input.value;
  var compiled = source;
  try {
    compiled = pleeease.process(source, options);
  } catch (err) {}
  output.innerHTML = prismjs.highlight(compiled, prismjs.languages.css);
};
doPleeease();
input.addEventListener('keyup', doPleeease);