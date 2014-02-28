editor = ace.edit "editor"
editor.setTheme "ace/theme/monokai"

if not user?
    editor.setReadOnly yes


changeTitle = (model) ->
    $(".brand").text(model.get('title'))

changeLang = (model) ->
    lang = model.get 'lang'
    console.log 'change lang', lang
    editor.getSession().setMode "ace/mode/#{lang}"
    $('.lang-menu li a').each (index, el) ->
        $('.current-lang').text $(this).text() if $(this).data('lang') is lang


changeURL = (model) ->
    history.pushState {}, model.get('title'), model.get('id')

changeCode = (model) ->
    editor.setValue model.get('code')

changeAuthor = (model) ->
    if model.get 'author'
        $('.author-wrapper').show()
        $('.code-author').text(model.get('author'))
    else
        $('.author-wrapper').hide()

CodeModel = Backbone.Model.extend
    urlRoot: "/code",
    defaults:
        title: "Code"
        code: "Please log in to access this service"
        author: ""
        lang: "javascript"
        created: new Date()
        views: 0

code = new CodeModel(raw || {})
code.on "change:id", changeURL, @
code.on "change:lang", changeLang, @
code.on "change:code", changeCode, @
code.on "change:author", changeAuthor, @
code.on "change:title", changeTitle, @

prev = ""
idle = ->
    console.log 'idle'
    if (not editor.getReadOnly()) and editor.getValue() isnt prev
        prev = editor.getValue()
        code.set 'code', prev, silent:yes
        console.log 'save'
        code.save()
    setTimeout idle, 1500

saveToFile = ->

    textToWrite = editor.getValue()
    textFileAsBlob = new Blob([textToWrite], type:'text/plain')

    ext = code.get('lang')
    ext = 'js' if ext is 'javascript'
    ext = 'go' if ext is 'golang'
    fileNameToSaveAs = code.get('title') + '.' + ext

    downloadLink = document.createElement("a")
    downloadLink.download = fileNameToSaveAs
    downloadLink.innerHTML = "Download File"
    if window.webkitURL != null
    
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob)
    else
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob)
        downloadLink.onclick = destroyClickedElement
        downloadLink.style.display = "none"
        document.body.appendChild(downloadLink)

    downloadLink.click()


$ ->
    fnResize = ->
        $("#editor").css("height", $(window).height() - 144)
    $(window).resize(fnResize)
    fnResize()

    $('.lang-menu li a').click( (event) ->
        code.set 'lang', $(@).data('lang')
    )

    $('.brand').click( (event) ->
        if (not editor.getReadOnly())
            title = window.prompt "", code.get 'title'
            code.set 'title', title
    )

    $('.fork').click( (e) ->
        e.preventDefault()
        code.unset('id')
        code.save()
    )
    $('.download').click(saveToFile)
    $('.like').click( (e) -> e.preventDefault() )

    if raw
        changeLang(code)
        changeCode(code)
        changeAuthor(code)
        changeTitle(code)

    setTimeout idle, 1500
