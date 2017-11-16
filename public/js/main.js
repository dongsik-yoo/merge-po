'use strict';

POLoader.initialize('srcGrid', 'targetGrid');

document.getElementById('srcfile').onchange = function(event) {
    var file = event.target.files[0];
    readFile(file, function(data) {
        POLoader.loadSource(data);
    });
};

document.getElementById('targetfile').onchange = function(event) {
    var file = event.target.files[0];
    readFile(file, function(data) {
        POLoader.loadTarget(data);
    });
};

document.getElementById('btn-merge').onclick = function(event) {
    POLoader.merge();
};

document.getElementById('btn-save').onclick = function(event) {
    var pofile = POLoader.getString('target');
    var filename = document.getElementById('targetFileName').value || 'po_' + Date.now() + '.po';
    saveTextAsFile(pofile, filename);
};

_.forEach(document.getElementsByClassName('filter-msgid'), function(element) {
    element.onchange = onFilterByMsgid;
});

document.getElementById('hide-duplicate').onchange = function(event) {
    POLoader.hideDuplicate(this.checked);
};

// document.getElementsByName('btn-filter-reset').forEach(function(element) {
//     element.onclick = onFilterByMsgid;
// });

function onFilterByMsgid(event) {
    var which = this.name;
    var column = 'msgid';
    var keyword = this.value;
    POLoader.filter(which, column, keyword);
}

function readFile(file, callback) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var data = event.target.result;
        callback(data);
    };
    reader.readAsText(file);
}

function saveTextAsFile(text, filename) {
    // copied source
    var textToSaveAsBlob = new Blob([text], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = filename;
 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// test source
// POLoader.loadSource(source_po_file);
// test target
// POLoader.loadTarget(target_po_file);
