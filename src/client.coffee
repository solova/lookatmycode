editor = ace.edit "editor"
editor.setTheme "ace/theme/monokai"

# editor.getSession().setTabSize(2)
# editor.getSession().setUseSoftTabs(true)
# editor.renderer.setShowPrintMargin(false)

editor.getSession().setMode 'ace/mode/javascript'
