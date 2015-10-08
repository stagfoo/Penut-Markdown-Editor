//Fs file system
var fs = require('fs');
//used to create the menu
var remote = require('remote'); 
var dialog = remote.require('dialog'); 
//Gets the markdown info
var doc = document.getElementById('writer');
var preview_bucket = document.getElementById('preview');
//creates buttons to save the document(not used currently)
var open_btn = document.getElementById('open_file');
var save_btn = document.getElementById('save_file');
var export_btn = document.getElementById('export_file');

var export_doc;
//Parse Markdown
var markdown = require( "markdown" ).markdown;
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
});
//emoji with twitter emojis
var emoji = require('markdown-it-emoji');
var twemoji = require('twemoji');
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



//Updates Preview 
function updatePreview(doc){
var preview = md.render(doc);
preview_bucket.innerHTML = preview;
}

//Opens a file and puts it into the text area
function openFile(editor){
	dialog.showOpenDialog({ filters: [
   { name: 'text', extensions: ['md'] }
  ]}, function (fileNames) {
  if (fileNames === undefined) return;
  var fileName = fileNames[0];
  fs.readFile(fileName, 'utf-8', function (err, data) {
   	editor.innerHTML = data;
   	updatePreview(editor.innerHTML);
 		});
 	});
}

//save file to disk
function saveFile(editor){
	dialog.showSaveDialog(function (fileName) {
    if (fileName === undefined) return;
    fs.writeFile(fileName, editor.innerHTML, function (err) {   
    });
  }); 
}
//save HTML file to disk 
// TODO: add wrapper for styles 


var html_head;
var html_footer;
//get Wrappers
fs.readFile( process.cwd() +'/res/html_template/head.html', function (err, data) {
  if (err) {
    throw err; 
  }
 html_head = data.toString();
});
//Load footer
fs.readFile( process.cwd() +'/res/html_template/footer.html', function (err, data) {
  if (err) {
    throw err; 
  }
  html_footer = data.toString();
});


function saveFilePreview(editor){
	console.log(html_head)
  console.log(editor.innerHTML)
  console.log(html_footer)

	var final_doc = html_head + editor.innerHTML + html_footer;

	dialog.showSaveDialog(function (fileName) {
    if (fileName === undefined) return;
    fs.writeFile(fileName, final_doc, function (err) {   
    });
  }); 
}

doc.addEventListener('input', function()
{
	updatePreview(doc.innerText)
});

save_btn.addEventListener('click', function()
{
	saveFile(doc)
});

open_btn.addEventListener('click', function()
{
	 openFile(doc)
 }); 

export_btn.addEventListener('click', function()
{
   saveFilePreview(document.getElementById('preview'));
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

// var main_menu = new Menu();


// Menu.setApplicationMenu(main_menu);