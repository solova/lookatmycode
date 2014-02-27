editor = ace.edit "editor"
editor.setTheme "ace/theme/monokai"
editor.getSession().setMode 'ace/mode/javascript'

$ ->
    fnResize = ->
        $("#editor").css("height", $(window).height() - 144)
    $(window).resize(fnResize)
    fnResize()
