var CodeModel, changeAuthor, changeCode, changeLang, changeTitle, changeURL, code, editor, idle, prev, saveToFile;

editor = ace.edit("editor");

editor.setTheme("ace/theme/monokai");

if (typeof user === "undefined" || user === null) {
  editor.setReadOnly(true);
}

changeTitle = function(model) {
  return $(".brand").text(model.get('title'));
};

changeLang = function(model) {
  var lang;
  lang = model.get('lang');
  console.log('change lang', lang);
  editor.getSession().setMode("ace/mode/" + lang);
  return $('.lang-menu li a').each(function(index, el) {
    if ($(this).data('lang') === lang) {
      return $('.current-lang').text($(this).text());
    }
  });
};

changeURL = function(model) {
  return history.pushState({}, model.get('title'), model.get('id'));
};

changeCode = function(model) {
  return editor.setValue(model.get('code'));
};

changeAuthor = function(model) {
  if (model.get('author')) {
    $('.author-wrapper').show();
    return $('.code-author').text(model.get('author'));
  } else {
    return $('.author-wrapper').hide();
  }
};

CodeModel = Backbone.Model.extend({
  urlRoot: "/code",
  defaults: {
    title: "Code",
    code: "Please log in to access this service",
    author: "",
    lang: "javascript",
    created: new Date(),
    views: 0
  }
});

code = new CodeModel(raw || {});

code.on("change:id", changeURL, this);

code.on("change:lang", changeLang, this);

code.on("change:code", changeCode, this);

code.on("change:author", changeAuthor, this);

code.on("change:title", changeTitle, this);

prev = "";

idle = function() {
  console.log('idle');
  if ((!editor.getReadOnly()) && editor.getValue() !== prev) {
    prev = editor.getValue();
    code.set('code', prev, {
      silent: true
    });
    console.log('save');
    code.save();
  }
  return setTimeout(idle, 1500);
};

saveToFile = function() {
  var downloadLink, ext, fileNameToSaveAs, textFileAsBlob, textToWrite;
  textToWrite = editor.getValue();
  textFileAsBlob = new Blob([textToWrite], {
    type: 'text/plain'
  });
  ext = code.get('lang');
  if (ext === 'javascript') {
    ext = 'js';
  }
  if (ext === 'golang') {
    ext = 'go';
  }
  fileNameToSaveAs = code.get('title') + '.' + ext;
  downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL !== null) {
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }
  return downloadLink.click();
};

$(function() {
  var fnResize;
  fnResize = function() {
    return $("#editor").css("height", $(window).height() - 144);
  };
  $(window).resize(fnResize);
  fnResize();
  $('.lang-menu li a').click(function(event) {
    return code.set('lang', $(this).data('lang'));
  });
  $('.brand').click(function(event) {
    var title;
    if (!editor.getReadOnly()) {
      title = window.prompt("", code.get('title'));
      return code.set('title', title);
    }
  });
  $('.fork').click(function(e) {
    e.preventDefault();
    code.unset('id');
    return code.save();
  });
  $('.download').click(saveToFile);
  $('.like').click(function(e) {
    return e.preventDefault();
  });
  if (raw) {
    changeLang(code);
    changeCode(code);
    changeAuthor(code);
    changeTitle(code);
  }
  return setTimeout(idle, 1500);
});
