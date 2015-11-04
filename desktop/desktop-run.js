//Fs file system
var fs = require('fs');
//var codemirror = require('codemirror');
// Setup codemirror

//used to create the menu
var remote = require('remote'); 
var dialog = remote.require('dialog'); 
//Gets the markdown info
var doc = document.getElementById('writer');
var preview_bucket = document.getElementById('preview');

//TODO: Setup Color Coding.
// codemirror.fromTextArea(doc, {
//     lineNumbers: true,
//     mode: 'GFM'
    
// });




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
// function insertAtCaret(text) {
  
//     var txtarea = document.getElementById('writer');
//     var scrollPos = txtarea.scrollTop;
//     var caretPos = txtarea.selectionStart;

//     var front = (txtarea.innerHTML).substring(0, caretPos);
//     var back = (txtarea.innerHTML).substring(txtarea.selectionEnd, txtarea.innerHTML.length);
//     console.log(front);
//     console.log(back);
//     console.log(caretPos);

//     txtarea.innerHTML = "";
//     txtarea.innerHTML = front + text + back;
//     caretPos = caretPos + text.length;
//     txtarea.selectionStart = caretPos;
//     txtarea.selectionEnd = caretPos;
//     txtarea.focus();
//     txtarea.scrollTop = scrollPos;
// }

function insertAtCaret(text) {
    var lasttext = document.getElementById('writer');
    var oldtext = lasttext.value;
    var curpos = lasttext.selectionStart;
    pretext = oldtext.substring(0,curpos);
    posttest = oldtext.substring(curpos,oldtext.length);
    lasttext.value = pretext + text + posttest;
}


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
   	editor.text = data; 
    editor.value = data;  
   	updatePreview(editor.text);
 		});
 	});
}

//save file to disk
function saveFile(editor){
	 dialog.showSaveDialog({ filters: [
     { name: 'text', extensions: ['md'] }
    ]}, function (fileName) {
    if (fileName === undefined) return;
    fs.writeFile(fileName, editor.value, function (err) {   
    });
  }); 
}
//save HTML file to disk 
// TODO: add wrapper for styles 


var html_head;
var html_footer;
//get Wrappers
fs.readFile( __dirname +'/head.html', function (err, data) {
  if (err) {
    throw err; 
  }
 html_head = data.toString();
});
//Load footer
fs.readFile( __dirname +'/footer.html', function (err, data) {
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
doc.addEventListener('input', function(){ updatePreview(doc.value) });

/*======================================
=            Toolbar button            =
======================================*/
var italic_btn = document.getElementById('italic');
var link_btn = document.getElementById('link');
var strike_btn = document.getElementById('strike');
var list_btn = document.getElementById('list');
var quote_btn = document.getElementById('quote');
var image_btn = document.getElementById('image');
var emoji_btn = document.getElementById('emoji');
var code_btn = document.getElementById('code');
var checkbox_btn = document.getElementById('checkbox');
var settings_btn = document.getElementById('settings');

italic_btn.addEventListener('click', function(){ insertAtCaret('**') });
link_btn.addEventListener('click', function(){ insertAtCaret('[link](http)') });
strike_btn.addEventListener('click', function(){ insertAtCaret('~~ ~~') });
list_btn.addEventListener('click', function(){ insertAtCaret('- ') });
quote_btn.addEventListener('click', function(){ insertAtCaret('>') });
image_btn.addEventListener('click', function(){ insertAtCaret('![meta](http)') });
emoji_btn.addEventListener('click', function(){ insertAtCaret(':)') });
code_btn.addEventListener('click', function(){ insertAtCaret('``` ```') });
// checkbox_btn.addEventListener('click', function(){ insertAtCaret('- [x]') });

//creates buttons to save the document(not used currently)
var open_btn = document.getElementById('open_file');
var save_btn = document.getElementById('save_file');
var export_btn = document.getElementById('export_file');


save_btn.addEventListener('click', function(){ saveFile(doc) });
open_btn.addEventListener('click', function(){ openFile(doc) }); 
export_btn.addEventListener('click', function(){ saveFilePreview(document.getElementById('preview')); }); 
settings_btn.addEventListener('click', function(){ alert('Settings coming soon 0:)') });


/*========================================
=            Write click Menu            =
========================================*/
var remote = require('remote');
// var Menu = remote.require('menu');
// var MenuItem = remote.require('menu-item');

// var menu = new Menu();
// menu.append(new MenuItem({ label: 'Open', click: function() { openFile(document.getElementById('writer'));  } }));
// menu.append(new MenuItem({ label: 'Save', click: function() { saveFile(document.getElementById('writer'));  } }));
// menu.append(new MenuItem({ label: 'Export as HTML', click: function() { saveFilePreview(document.getElementById('preview'));  } }));



// var main_menu = new Menu();
// Menu.setApplicationMenu(main_menu);


/*====================================
=            Default Menu            =
====================================*/
var Menu = require("menu");

var template = [{
    label: "Application",
    submenu: [
        { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]}
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));

window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  Menu.popup(remote.getCurrentWindow());
}, false);
