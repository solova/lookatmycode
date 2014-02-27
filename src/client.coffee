editor = ace.edit "editor"
editor.setTheme "ace/theme/monokai"

# editor.getSession().setTabSize(2)
# editor.getSession().setUseSoftTabs(true)
# editor.renderer.setShowPrintMargin(false)

editor.getSession().setMode 'ace/mode/javascript'

window.onresize = (event) ->
    console.log('resize')
    document.getElementById('editor').style.height = window.innerHeight - 144
