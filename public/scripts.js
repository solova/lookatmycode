var editor;

editor = void 0;

$(function() {
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  return editor.getSession().setMode('ace/mode/javascript');
});
