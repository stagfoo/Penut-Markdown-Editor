var fs = require('fs')
var markdown = require( "markdown" ).markdown;
var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: false,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  smartypants: false
});


var doc = document.getElementById('writer');
var preview_bucket = document.getElementById('preview');

function updatePreview(doc){
var preview = marked(doc);
console.log(preview_bucket)
console.log(preview_bucket.innerHTML)
preview_bucket.innerHTML = preview;
// alert(preview);
}


doc.addEventListener('input', function()
{
	updatePreview(doc.value)
});

//var contents = fs.readFileSync('./package.json','utf8')
//alert(contents)