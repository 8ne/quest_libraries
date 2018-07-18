function initDebugTable(css) {

    // Set original Stylesheet
    $('<style />').text(css).appendTo($('head'));

    // Create DevMode-Sidebar
    $('body').append(
        '<div class="devmode_sidebar_labels" id="devmode_sidebar_labels_debugtable"></div>' +
        '<div class="devmode_sidebar">' +
        '<div id="debugtable_names"></div>' +
        '<div id="debugtable_attr"></div>' +
        '</div>' +

        '<ul id="devmode_sidebar_popupmenu">' +
        '<li data-action="take">#take</li>' +
        '<li data-action="drop">#drop</li>' +
        '<li data-action="close">#close</li>' +
        '<li data-action="on">#on</li>' +
        '<li data-action="off">#off</li>' +
        '<li data-action="to">#to</li>' +
        '<li data-action="go">#go</li>' +
        '<li data-action="refresh">Refresh Names</li>' +
        '</ul>'
    );

    // Popop-Menu
    $("#debugtable_names").bind("contextmenu", function (event) {
        event.preventDefault();
        $("#devmode_sidebar_popupmenu").finish().toggle(100).
        css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
    });

    $(document).bind("mousedown", function (e) {
        if (!$(e.target).parents("#devmode_sidebar_popupmenu").length > 0) {
            $("#devmode_sidebar_popupmenu").hide(100);
        }
    });

    $("#devmode_sidebar_popupmenu li").click(function () {
        switch ($(this).attr("data-action")) {
            case "refresh":
                ASLEvent("getTableDataNames", "");
                break;
            default:
                ASLEvent("setCommand", $(this).attr("data-action") + " " + selectedname);
                break;
        }
        $("#devmode_sidebar_popupmenu").hide(100);
    });


    // Declare variables
    var devmode_sidebar_open = true;
    var devmode_sidebar_boxshadow = "-5px 5px 10px rgba(0, 0, 0, 0.2)";


    // Resizing the sidebar
    $('.devmode_sidebar').resizable({
        handles: 'w',
        distance: 30,
        minWidth: 300,
        resize: function (event, ui) {
            ui.position.left = ($(window).width() - $(this).width());
            $('.devmode_sidebar_labels').css({
                left: (ui.position.left - $('.devmode_sidebar_labels').width()) + "px"
            });
        },
        stop: function (event, ui) {
            $(this).css({
                left: "initial"
            });
            $('.devmode_sidebar_labels').css({
                right: $(this).width(),
                left: "initial"
            });
        }
    });


    // Hidden DevMode-Sidebar
    toggletable(0);


    // Appearance of the box shadow on mouseover
    $(".devmode_sidebar_labels").hover(function () {
        $(this).css("box-shadow", devmode_sidebar_boxshadow)
    }).mouseout(function () {
        if (!devmode_sidebar_open) $(this).css("box-shadow", "none")
    });


    // When clicking on the label of the sidebar it will be displayed.
    $('.devmode_sidebar_labels').on('click', function () {
        toggletable(200);
    });


    // DevMode-Sidebar fly in or out
    function toggletable(duration) {
        devmode_sidebar_open = !devmode_sidebar_open;
        if (devmode_sidebar_open) {
            var tok = "+";
            var boxshadowval = devmode_sidebar_boxshadow;
            $('.devmode_sidebar').resizable("enable");

        } else {
            var tok = "-";
            var boxshadowval = "none";
            $('.devmode_sidebar').resizable("disable");
        }
        $('.devmode_sidebar, .devmode_sidebar_labels').animate({
            right: tok + '=' + $('.devmode_sidebar').width()
        }, duration, "easeOutExpo");
        $('.devmode_sidebar').css('box-shadow', boxshadowval);
    }


    // If the window is resized, the sidebar should remain at the right margin
    $(window).resize(function () {
        if (devmode_sidebar_open) {
            $('.devmode_sidebar').css({
                right: '0px'
            });
        } else {
            $('.devmode_sidebar').css({
                right: '-' + $('.devmode_sidebar').width()
            });
        }
    });

    // The selected name
    var selectedname = "game";
    var opengroups = ["Gameobject", "Objects", "Rooms"];

    // Debugtable - Names
    $("#debugtable_names").tabulator({
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
        rowContext: function (e, row) {
            row.select();
        },
        rowSelected: function (row) {
            selectedname = row.getData().name;
            ASLEvent("getTableDataAttr", selectedname);
        },
        dataLoaded: function (data) {
            var hasMatch = false;
            for (var index = 0; index < data.length; ++index) {
                var element = data[index];
                if (element.name == selectedname) {
                    hasMatch = true;
                    break;
                }
            }
            if (hasMatch) $("#debugtable_names").tabulator("selectRow", selectedname);
        }
    });


    // Debugtable - Attributes
    $("#debugtable_attr").tabulator({
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
        cellEdited: function (cell) { // When you change the attributes
            ASLEvent("setTableData", selectedname + "." + cell.getRow().getData().attribute + "=" + cell.getRow().getData().value);
        }
    });


    // Debugtable - Read Names
    ASLEvent("getTableDataNames", "");

}


// Debugtable update
function setTableData(table, datastr) {
    var data = JSON.parse(datastr);
    $("#debugtable_" + table).tabulator("clearData");
    $("#debugtable_" + table).tabulator("setData", data);
    $("#debugtable_" + table).tabulator("redraw", true);
}