'use strict';

var PO = require('pofile');
var _ = require('lodash');
var Grid = require('tui-grid');
var $ = require('jquery');

var hideDuplicateChecked = false;
var formatter = function(value) {
    // var tagName = 'code';
    var container = document.createElement('div');
    container.innerText = value;

    return container.innerHTML;
    // return '<' + tagName + '>' + value + '</' + tagName + '>';
};

var columns = [
    {
        title: 'msgid',
        name: 'msgid',
        whiteSpace: 'normal',
        formatter: formatter,
        editOptions: {
            type: 'text',
            useViewMode: true
        }
    },
    {
        title: 'msgstr',
        name: 'msgstr',
        whiteSpace: 'normal',
        formatter: formatter,
        editOptions: {
            type: 'text',
            useViewMode: true
        }
    },
    {
        title: 'comments',
        name: 'comments',
        whiteSpace: 'normal',
        formatter: formatter,
        editOptions: {
            type: 'text',
            useViewMode: true
        }
    }
];

var POLoader = {
    src: {
        grid: null,
        po: null,
        gridData: null
    },
    target: {
        grid: null,
        po: null,
        gridData: null
    }
};

POLoader.initialize = function(srcId, targetId) {
    var options = {
        rowHeaders: ['rowNum', 'checkbox'],
        virtualScrolling: true,
        rowHeight: 60,
        bodyHeight: 800,
        columns: columns
    };
    POLoader.src.grid = new Grid(_.assign({
        el: $('#' + srcId)
    }, options));

    POLoader.target.grid = new Grid(_.assign({
        el: $('#' + targetId)
    }, options));
};

POLoader.loadSource = function(data) {
    _.assign(POLoader.src, parsePOString(data));
    resetData(POLoader.src);
};

POLoader.loadTarget = function(data) {
    _.assign(POLoader.target, parsePOString(data));
    resetData(POLoader.target);
};

POLoader.merge = function() {
    var src = POLoader.src.po;
    var target = POLoader.target.po;
    if (!src || !target) {
        return;
    }

    src.items.forEach(function(srcItem) {
        var targetFound = _.find(target.items, function(targetItem) {
            return srcItem.msgid === targetItem.msgid;
        });
        if (targetFound) {
            targetFound.msgstr = srcItem.msgstr;
        }
    });

    if (hideDuplicateChecked) {
        this.hideDuplicate(hideDuplicateChecked);
    } else {
        resetData(POLoader.target);
    }
};

/**
 * Filter item by column and keyword
 * @param {string} which - 'src', 'target'
 * @param {string} column - column name
 * @param {string} keyword - search keyword
 */
POLoader.filter = function(which, column, keyword) {
    var loader = POLoader[which];
    loader.gridData = filterGridData(makeGridData(loader.po), column, keyword);
    loader.grid.resetData(loader.gridData);
};

POLoader.hideDuplicate = function(enabled) {
    var srcData = makeGridData(POLoader.src.po);
    var targetData = makeGridData(POLoader.target.po);
    var filteredSrcData = enabled ? _.filter(srcData, function(row) {
        return !_.find(targetData, {'msgid': row.msgid, 'msgstr': row.msgstr});
    }) : srcData;
    var filteredTargetData = enabled ? _.filter(targetData, function(row) {
        return !_.find(srcData, {'msgid': row.msgid, 'msgstr': row.msgstr});
    }) : targetData;

    POLoader.src.grid.resetData(filteredSrcData);
    POLoader.target.grid.resetData(filteredTargetData);

    hideDuplicateChecked = enabled;
};

POLoader.getString = function(which) {
    var loader = POLoader[which];

    return loader ? loader.po.toString() : '';
};

/**
 * Load gridData into Grid
 * @param {Object} loader - loader
 */
function resetData(loader) {
    loader.gridData = makeGridData(loader.po);
    loader.grid.resetData(loader.gridData);
}

/**
 * Parse po file string
 * @param {string} data - po file string
 * @returns {Object}
 */
function parsePOString(data) {
    var po = PO.parse(data);

    return {
        po: po,
        gridData: makeGridData(po)
    };
}

/**
 * Convert po to gridData
 * @param {PO} po - PO class
 * @returns {Array}
 */
function makeGridData(po) {
    return po.items.map(function(item) {
        return {
            id: item.msgid,
            msgid: item.msgid,
            msgstr: item.msgstr.join(''),
            comments: item.comments
        };
    });//.slice(0, 100);
}

function filterGridData(rows, column, keyword) {
    if (!keyword) {
        return rows;
    }

    return rows.filter(function(row) {
        var value = row[column] || '';
        return value.indexOf(keyword) >= 0;
    });
}

module.exports = POLoader;

// function print(po) {
//     po.items.forEach(function(item) {
//         var msgstr = item.msgid_plural ? item.msgstr[0] : item.msgstr.join();
//         console.log(item.msgid + ' => ' + msgstr);
//     });
// }

// function save(po) {
//     po.save(appliedPoPath, function(err) {
//         if (err) {
//             console.log(err.stack);

//             return;
//         }
//     });
// }
