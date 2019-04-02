// ----------------------------------------------------------------------------------------------------
// MARK Public Variables
// ----------------------------------------------------------------------------------------------------
var selectedname = "game";
var opengroups = ["Gameobject", "Objects", "Rooms"];

// ----------------------------------------------------------------------------------------------------
// MARK Initialisation the DevModeSideBar
// ----------------------------------------------------------------------------------------------------
function initDevModeSideBar(css, pos, verbs) {

    // ----------------------------------------------------------------------------------------------------
    // MARK Set Stylesheet
    // ----------------------------------------------------------------------------------------------------
    $('<style />').text(css).appendTo($('head'));

    // ----------------------------------------------------------------------------------------------------
    // MARK Create DevMode-Sidebar
    // ----------------------------------------------------------------------------------------------------
    $('body').append(
        '<div id="devmode_sidebar_strip"></div>' +
        '<div id="devmode_sidebar">' +
        '<div id="devmode_sidebar_container"></div>' +
        '</div>'
    );

    // ----------------------------------------------------------------------------------------------------
    // MARK Prepare the sidebar for positioning
    // ----------------------------------------------------------------------------------------------------
    var placeholder = '<div id="devmode_sidebar_placeholder"></div>';
    switch (pos) {
        case "left":
            $('html').css({'margin-left': '50px'});
            $('#devmode_sidebar_strip').css({
                left: 0
            });
            $('#devmode_sidebar_container').before(placeholder);
            // ----------------------------------------------------------------------------------------------------
            // MARK Resizing the sidebar (Left)
            // ----------------------------------------------------------------------------------------------------
            $('#devmode_sidebar').resizable({
                handles: 'e',
                distance: 30,
                minWidth: 300
            });
            break;
        case "right":
            $('html').css({'margin-right': '50px'});
            $('#devmode_sidebar_strip').css({
                right: 0
            });
            $('#devmode_sidebar_container').after(placeholder);
            // ----------------------------------------------------------------------------------------------------
            // MARK Resizing the sidebar (Right)
            // ----------------------------------------------------------------------------------------------------
            $('#devmode_sidebar').resizable({
                handles: 'w',
                distance: 30,
                minWidth: 300,
                resize: function (event, ui) {
                    ui.position.left = ($(window).width() - $(this).width());
                },
                stop: function (event, ui) {
                    $(this).css({
                        left: "initial"
                    });
                }
            });
            break;
    }

    // ----------------------------------------------------------------------------------------------------
    // MARK Create Label for DevModeDebugTable
    // ----------------------------------------------------------------------------------------------------
    $('#devmode_sidebar_strip').append(
        '<div class="devmode_sidebar_label" id="devmode_sidebar_label_debugtable"></div>'
    );

    // ----------------------------------------------------------------------------------------------------
    // MARK Initialisation the Sidebar
    // ----------------------------------------------------------------------------------------------------
    $('#devmode_sidebar').sidebar({
        side: pos,
        speed: 200
    });

    // ----------------------------------------------------------------------------------------------------
    // MARK If you click on the label of the debug table, it is displayed and hidden
    // ----------------------------------------------------------------------------------------------------
    $('#devmode_sidebar_label_debugtable').on('click', function () {
        $('#devmode_sidebar').trigger("sidebar:toggle");
    });

    initDevModeDebugTable();
    initDevModePopupMenu(verbs);
}

// ----------------------------------------------------------------------------------------------------
// MARK Initialisation the DevModeDebugTable
// ----------------------------------------------------------------------------------------------------
function initDevModeDebugTable() {

    // ----------------------------------------------------------------------------------------------------
    // MARK Create DevMode-DebugTable
    // ----------------------------------------------------------------------------------------------------
    $('#devmode_sidebar_container').append(
        '<div id="devmode_sidebar_debugtable">' +
        '<div id="devmode_sidebar_debugtable_names"></div>' +
        '<div id="devmode_sidebar_debugtable_attr"></div>' +
        '</div>'
    );

    // ----------------------------------------------------------------------------------------------------
    // MARK Debugtable - Names
    // ----------------------------------------------------------------------------------------------------
    $("#devmode_sidebar_debugtable_names").tabulator({
        index: "name",
        groupBy: "typ",
        groupToggleElement: "header",
        selectable: 1,
        layout: "fitColumns",
        columns: [{
                title: "Name",
                field: "name",
                sorter: "string",
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by...",
                resizable: false
            },
            {
                title: "Typ",
                field: "typ",
                visible: false
            }
        ],
        groupStartOpen: function (value, count, data, group) {
            return (opengroups.indexOf(value) > -1);
        },
        groupVisibilityChanged: function (group, visible) {
            if (visible) opengroups.push(group.getKey());
            else opengroups.splice(opengroups.indexOf(group.getKey()), 1);
        },
        rowClick: function (e, row) { // For name selectiony
            row.select();
        },
        rowDblClick: function (e, row) {
            row.select();
            switch (row.getData().typ) {
                case "Objects":
                    ASLEvent("setCommand", "#take " + selectedname);
                    break;
                case "Rooms":
                    ASLEvent("setCommand", "#go " + selectedname);
                    break;
            }
        },
        rowContext: function (e, row) {
            row.select();
            $('#devmode_sidebar_debugtable_popupmenu li').css({
                "font-weight": "normal"
            });
            switch (row.getData().typ) {
                case "Objects":
                    $('#devmode_sidebar_debugtable_popupmenu li[data-action="#take"]').css({
                        "font-weight": "bold"
                    });
                    break;
                case "Rooms":
                    $('#devmode_sidebar_debugtable_popupmenu li[data-action="#go"]').css({
                        "font-weight": "bold"
                    });
                    break;
            }
        },
        rowSelected: function (row) {
            selectedname = row.getData().name;
            ASLEvent("getTableDataAttr", selectedname);
        },
        dataLoaded: function (data) {
            var hasMatch = false;
            for (var index = 0; index < data.length; ++index) {
                var element = data[index];
                if (element.name === selectedname) {
                    hasMatch = true;
                    break;
                }
            }
            if (hasMatch) $("#devmode_sidebar_debugtable_names").tabulator("selectRow", selectedname);
        }
    });

    // ----------------------------------------------------------------------------------------------------
    // MARK Debugtable - Attributes
    // ----------------------------------------------------------------------------------------------------
    $("#devmode_sidebar_debugtable_attr").tabulator({
        index: "Attribute",
        layout: "fitColumns",
        initialSort: [{
                column: "attribute",
                dir: "asc"
            },
            {
                column: "value",
                dir: "asc"
            }
        ],
        columns: [{
                title: "Attribute",
                field: "attribute",
                sorter: "string",
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by...",
                resizable: false
            },
            {
                title: "Value",
                field: "value",
                sorter: "string",
                editor: "input",
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by...",
                resizable: false
            }
        ],
        cellEdited: function (cell) {
            ASLEvent("setAttribute", selectedname + "." + cell.getRow().getData().attribute + "=" + cell.getRow().getData().value);
        }
    });

    // ----------------------------------------------------------------------------------------------------
    // Debugtable - Read Names
    // ----------------------------------------------------------------------------------------------------
    ASLEvent("getTableDataNames", "");

}

// ----------------------------------------------------------------------------------------------------
// MARK Debugtable update
// ----------------------------------------------------------------------------------------------------
function setTableData(table, datastr) {

    var data = JSON.parse(datastr);
    $("#devmode_sidebar_debugtable_" + table).tabulator("clearData");
    $("#devmode_sidebar_debugtable_" + table).tabulator("setData", data);
    $("#devmode_sidebar_debugtable_" + table).tabulator("redraw", true);

}

// ----------------------------------------------------------------------------------------------------
// MARK Popop-Menu
// ----------------------------------------------------------------------------------------------------
function initDevModePopupMenu(verbs) {

    // ----------------------------------------------------------------------------------------------------
    // MARK Set Verbs in Popup-Menu
    // ----------------------------------------------------------------------------------------------------
    verbs = verbs.split(",");
    menuitems = "";
    verbs.forEach(function (s, i, o) {
        menuitems += '<li data-action="' + s + '">' + s + '</li>';
    });

    // ----------------------------------------------------------------------------------------------------
    // MARK Create Popupmenu
    // ----------------------------------------------------------------------------------------------------   
    $('#devmode_sidebar').after(
        '<ul id="devmode_sidebar_debugtable_popupmenu">' +
        menuitems +
        '<li data-action="refresh">Refresh Names</li>' +
        '</ul>'
    );

    $("#devmode_sidebar_debugtable_names").bind("contextmenu", function (event) {
        event.preventDefault();
        $("#devmode_sidebar_debugtable_popupmenu").finish().toggle(100).
        css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
    });

    $(document).bind("mousedown", function (e) {
        if (!$(e.target).parents("#devmode_sidebar_debugtable_popupmenu").length > 0) {
            $("#devmode_sidebar_debugtable_popupmenu").hide(100);
        }
    });

    $("#devmode_sidebar_debugtable_popupmenu li").click(function () {
        switch ($(this).attr("data-action")) {
            case "refresh":
                ASLEvent("getTableDataNames", "");
                break;
            default:
                ASLEvent("setCommand", $(this).attr("data-action") + " " + selectedname);
                break;
        }
        $("#devmode_sidebar_debugtable_popupmenu").hide(100);
    });

}