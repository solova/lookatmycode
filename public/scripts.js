var editor;

editor = ace.edit("editor");

editor.setTheme("ace/theme/monokai");

editor.getSession().setMode('ace/mode/javascript');

$(function() {
  var fnResize;
  fnResize = function() {
    return $("#editor").css("height", $(window).height() - 144);
  };
  $(window).resize(fnResize);
  return fnResize();
});
