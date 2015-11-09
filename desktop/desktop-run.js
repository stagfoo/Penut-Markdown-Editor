/*====================================
=            REQUIREMENTS            =
====================================*/
var fs = require('fs'); //For saving files
var storage = require('local-storage-json'); //for saving settings

require('codemirror/mode/markdown/markdown');
require('codemirror/mode/gfm/gfm');
var CodeMirror = require('codemirror/lib/codemirror'); //coloring markdown

/*----------  Code coloring on Writer side  ----------*/

//TODO: Write better color coding / Fix Toolbar
var writer = document.getElementById('writer');
var doc = CodeMirror.fromTextArea(writer, {
     lineNumbers: false,
     lineWrapping: true,
     mode: {
      name: 'markdown',
      highlightFormatting: true
     },
      theme: "default"
    
 });
/*----------  END Code coloring on Writer side  ----------*/


var remote = require('remote'); //used to create the menu
var dialog = remote.require('dialog'); //this is get system dialogs
var preview_bucket = document.getElementById('preview'); //Gets the markdown info





/*========================================
=            Parsing Markdown            =
========================================*/
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

/*===============================================
=            Insert Markdown Presets            =
===============================================*/
//TODO: re-write for Codemirror
// function insertAtCaret(text) {

function insertAtCaret(data) {
    var cursor = doc.getCursor(); // gets the line number in the cursor position
    var line = doc.getLine(cursor.line); // get the line contents
    var pos = { // create a new object to avoid mutation of the original selection
        line: cursor.line,
        ch: line.length // set the character position to the end of the line
    }
    doc.replaceRange('\n'+data+'\n', pos); // adds a new line
}


//Updates Preview 
function updatePreview(doc){
var preview = md.render(doc);
preview_bucket.innerHTML = preview;
}


/*=====================================
=            FILE HANDLING            =
=====================================*/
//Open File 
//TODO: open in new window
function openFile(editor){
	dialog.showOpenDialog({ filters: [
   { name: 'text', extensions: ['md'] }
  ]}, function (fileNames) {
  if (fileNames === undefined) return;
  var fileName = fileNames[0];
  fs.readFile(fileName, 'utf-8', function (err, data) {
   	// editor.text = data; 

    editor.setValue(data);  
   	updatePreview(editor.getValue());
 		});
 	});
}

//Saves File
function saveFile(editor){
	dialog.showSaveDialog({ filters: [
   { name: 'text', extensions: ['md'] }
    ]},function (fileName) {
    if (fileName === undefined) return;
    fs.writeFile(fileName, editor.getValue(), function (err) {   
    });
  }); 
}
//save HTML file to disk 
// TODO: add wrapper for styles 

/*===================================
=            HTML EXPORT            =
===================================*/
var html_head;
var html_footer;
//Get head
fs.readFile( __dirname +'/lib/head.html', function (err, data) {
  if (err) {
    throw err; 
  }
 html_head = data.toString();
});
//Load footer
fs.readFile( __dirname +'/lib/footer.html', function (err, data) {
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

/*=============================
=       Show Preview             =
=============================*/
doc.on('change',function(){
  // get value right from instance
  updatePreview(doc.getValue());
});
/*======================================
=            Toolbar button            =
======================================*/
var heading_btn = document.getElementById('heading');
var italic_btn = document.getElementById('italic');
var link_btn = document.getElementById('link');
var strike_btn = document.getElementById('strike');
var list_btn = document.getElementById('list');
var quote_btn = document.getElementById('quote');
var image_btn = document.getElementById('image');
var emoji_btn = document.getElementById('emoji');
var code_btn = document.getElementById('code');
// var checkbox_btn = document.getElementById('checkbox');
var settings_btn = document.getElementById('settings');

heading_btn.addEventListener('click', function(){ insertAtCaret('#') });
italic_btn.addEventListener('click', function(){ insertAtCaret('**') });
link_btn.addEventListener('click', function(){ insertAtCaret('[text](http)') });
strike_btn.addEventListener('click', function(){ insertAtCaret('~~ ~~') });
list_btn.addEventListener('click', function(){ insertAtCaret('- ') });
quote_btn.addEventListener('click', function(){ insertAtCaret('>') });
image_btn.addEventListener('click', function(){ insertAtCaret('![alt](http)') });
emoji_btn.addEventListener('click', function(){ insertAtCaret(':)') });
code_btn.addEventListener('click', function(){ insertAtCaret('``` ```') });
// checkbox_btn.addEventListener('click', function(){ insertAtCaret('- [x] 1.') });

//creates buttons to save the document(not used currently)
var open_btn = document.getElementById('open_file');
var save_btn = document.getElementById('save_file');
var export_btn = document.getElementById('export_file');


save_btn.addEventListener('click', function(){ saveFile(doc) });
open_btn.addEventListener('click', function(){ openFile(doc) }); 
export_btn.addEventListener('click', function(){ saveFilePreview(document.getElementById('preview')); }); 
settings_btn.addEventListener('click', function(){ alert('Settings coming soon 0:)') });


/*====================================
=            Default Menu            =
====================================*/
// var Menu = require("menu");

// var template = [{
//     label: "Application",
//     submenu: [
//         { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
//         { type: "separator" },
//         { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
//     ]}, {
//     label: "Edit",
//     submenu: [
//         { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
//         { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
//         { type: "separator" },
//         { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
//         { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
//         { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
//         { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
//     ]}
// ];

// Menu.setApplicationMenu(Menu.buildFromTemplate(template));

// window.addEventListener('contextmenu', function (e) {
//   e.preventDefault();
//   Menu.popup(remote.getCurrentWindow());
// }, false);

/*=============================================
=            Settings JSON            =
=============================================*/
// var store = new Lawnchair({name:'testing'}, function(store) {

//     // Create an object
//     var me = {key:'brian'};

//     // Save it
//     store.save(me);

//     // Access it later... Yes even after a page refresh!
//     store.get('brian', function(me) {
//         console.log(me);
//     });
// });






