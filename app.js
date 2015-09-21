var fs = require('fs')
var markdown = require( "markdown" ).markdown;
var marked = require('marked');
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
});

var emoji = require('markdown-it-emoji');
var twemoji = require('twemoji')


md.use(emoji);
md.use(require('markdown-it-highlightjs'),{
	auto:'true',
	code: 'true'
});
md.use(require('markdown-it-checkbox'));
// md.use(require('markdown-it-anchor'));
md.renderer.rules.emoji = function(token, idx) {
  return twemoji.parse(token[idx].content);
};


var remote = require('remote'); 
var dialog = remote.require('dialog'); 

// SETUP MARKDOWN OPTIONS



var doc = document.getElementById('writer');
var preview_bucket = document.getElementById('preview');
var open_btn = document.getElementById('open_file');
var save_btn = document.getElementById('save_file');

function updatePreview(doc){
var preview = md.render(doc);
preview_bucket.innerHTML = preview;
// alert(preview);
}
function openFile(editor){
	dialog.showOpenDialog({ filters: [
   { name: 'text', extensions: ['md'] }
  ]}, function (fileNames) {
  if (fileNames === undefined) return;
  var fileName = fileNames[0];
  fs.readFile(fileName, 'utf-8', function (err, data) {
   	editor.value = data;
   	updatePreview(editor.value);
 		});
 	});
}

function saveFile(editor){
	dialog.showSaveDialog(function (fileName) {
    if (fileName === undefined) return;
    fs.writeFile(fileName, editor.value, function (err) {   
    });
  }); 
}
function saveFilePreview(editor){
	dialog.showSaveDialog(function (fileName) {
    if (fileName === undefined) return;
    fs.writeFile(fileName, editor.innerHTML, function (err) {   
    });
  }); 
}

doc.addEventListener('input', function()
{
	updatePreview(doc.value)
});

save_btn.addEventListener('click', function()
{
	saveFile(doc)
});

open_btn.addEventListener('click', function()
{
	 openFile(doc)
 }); 

/*========================================
=            Write click Menu            =
========================================*/
var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var menu = new Menu();
menu.append(new MenuItem({ label: 'Open', click: function() { openFile(document.getElementById('writer'));  } }));
menu.append(new MenuItem({ label: 'Save', click: function() { saveFile(document.getElementById('writer'));  } }));
menu.append(new MenuItem({ label: 'Export as HTML', click: function() { saveFilePreview(document.getElementById('preview'));  } }));



window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);

var main_menu = new Menu();


Menu.setApplicationMenu(main_menu);