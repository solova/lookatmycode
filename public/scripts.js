var editor;

editor = ace.edit("editor");

editor.setTheme("ace/theme/monokai");

editor.getSession().setMode('ace/mode/javascript');

window.onresize = function(event) {
  console.log('resize');
  return document.getElementById('editor').style.height = window.innerHeight - 144;
};
