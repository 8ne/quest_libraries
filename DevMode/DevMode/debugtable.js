function initDebugTable(css, datastr) {
    console.log(datastr);
    // Set original Stylesheet
    $('<style />').text(css).appendTo($('head'));

    // Create DevMode-Sidebar
    $('body').append(
        '<div id="devmode_sidebar">' +
        '<div id="debugtable_label" class="devmode_labels"></div>' +
        '<div id="debugtable">' +
        '<div id="debugtable_names"></div>' +
        '<div id="debugtable_attr"></div>' +
        '</div>' +
        '</div>'
    );

    // Custom Stylesheet
    $('#devmode_sidebar').css({
        "font-family": "Microsoft Sans Serif",
        "height": "100%",
        "width": "30%",
        "top": "0px",
        "right": "0px",
        "display": "flex",
        "position": "fixed",
        "z-index": "1000"
    })

    $('.devmode_labels').css({
        "box-sizing": "border-box",
        "text-align": "center",
        "border-bottom-left-radius": "10px",
        "height": "50px",
        "width": "50px",
        "background-color": "ghostwhite",
        "background-repeat": "no-repeat, repeat",
        "background-position": "center",
        "box-shadow": "0px 5px 10px silver",
        "z-index": "0"
    })

    $('#debugtable_label').css({
        "background-image": "url('quest://res/DevMode/debugtable.png')"
    })

    $('#debugtable').css({
        "box-sizing": "border-box",
        "display": "flex",
        "height": "100%",
        "width": "100%",
        "border": "none",
        "box-shadow": "0px 5px 10px silver",
        "background-color": "ghostwhite"
    });

    $('#debugtable_names').css({
        "box-sizing": "border-box",
        "border": "none",
        "float": "right",
        "height": "100%",
        "width": "33.3%",
        "background-color": "ghostwhite"
    });
    
    $('#debugtable_attr').css({
        "box-sizing": "border-box",
        "border": "none",
        "float": "right",
        "height": "100%",
        "width": "66.6%",
        "background-color": "ghostwhite"
    });


    // Hidden DevMode-Sidebar
    var devmode_sidebar_show = true;
    toggletable (0);


    // When clicking on the label of the sidebar it will be displayed.
    $('.devmode_labels').on('click', function () {
        toggletable (200);
    });


    function toggletable (duration) {
        if (devmode_sidebar_show) tok = "-";
        else tok = "+";
        $('#devmode_sidebar').animate( { right: tok + '=' + ($('#devmode_sidebar').width() - $('.devmode_labels').width()) + 'px' }, duration );    
        devmode_sidebar_show = !devmode_sidebar_show;
    }
    

    // Debugtable - Names
    $("#debugtable_names").tabulator({
        selectable: 1,
        layout: "fitColumns",
        initialSort: [{
            column: "name",
            dir: "asc"
        }],
        columns: [{
            title: "Name",
            field: "name",
            sorter: "string",
            headerFilter: "input",
            headerFilterPlaceholder: "Name",
            resizable: false
        }],
        rowClick: function (e, row) {
            row.select();
            tableupdate('attr', '[{"attribute":"isopen","value":"true"},{"attribute":"level","value":"23"},{"attribute":"alias","value":"XXX"}]');
            // row.getData().name zu DevMode schicken und der schickt den JSON-String direkt zu tableupdate.
        }
    });


    // Debugtable - Attributes
    $("#debugtable_attr").tabulator({
        selectable: 1,
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
                headerFilterPlaceholder: "Attribute",
                resizable: false
            },
            {
                title: "Value",
                field: "value",
                sorter: "string",
                editor: "input",
                headerFilter: "input",
                headerFilterPlaceholder: "Value",
                resizable: false
            }
        ],
        dataEdited: function (data) { // Wenn Daten vom Benutzer geändert werden.
            console.log(data);
            // Zurück zu DevMode.aslx schicken und Attribute setzen.
            // Evtl. ein Rückgängig einbauen, wenn Fehler von Quest gegeben wird.
        }
    });


    // Custom Stylesheet, after Tablecreating
    $('.tabulator .tabulator-header .tabulator-col').css({
        "border-bottom": "0px",
        "background-color": "ghostwhite"
    })

    $('.tabulator-selected').css({
        "color": "white",
        "background-color": "ghostwhite"
    })


    // Debugtable - Read Names
    try {
        tableupdate('names', datastr);
    }
    catch (err) {
        alert ("Beim Einlesen der Daten ist folgender Fehler aufgetreten: " + err);
    }

}

// Debugtable update
function tableupdate(table, datastr) {
    var data = JSON.parse(datastr);
    $("#debugtable_" + table).tabulator("clearData"); // Daten, zuvor löschen, damit nichts übrig bleibt von den alten Daten.
    $("#debugtable_" + table).tabulator("setData", data); // Prüfe, ob alte Daten auch entfernt werden mit updateOrAddData. Falls ja kann clearData werggelassen werden.
}





    // Namen werden geladen (Über Devmode) // Frage, ob id verwendet werden muss, oder weggelassen werden kann.
    // zu DevMode schicken und der schickt den JSON-String direkt zu tableupdate.
//    tableupdate('names', '[{"name":"kiste"},{"name":"game"},{"name":"tisch"}]');




/*








// Befüllen der Namenstabelle beim start (Über DevMode rüber schicken)
var debugtable_names_data = [
    {id:1, name:"kiste"}, // Frage, ob id verwendet werden muss, oder weggelassen werden kann.
    {id:2, name:"game"},
    {id:3, name:"tisch"}
];

// Tabellendaten in die Tabelle laden
$("#debugtable_names").tabulator("setData", debugtable_names_data);





// Initialisierung der Tabelle
// Value ist Editierbar, Sortierbar, Titelfiter
$("#debugtable_attval").tabulator({
    height:"100%",
    width:"50%",
    // layout:"fitColumns", // passt sich perfekt dem übergeordneten Container an.
    initialSort:[
        {column:"attribute", dir:"asc"},
        {column:"value", dir:"asc"}
    ],    
    columns:[
        {title:"Attribute", field:"attribute", sorter:"string", headerFilter:"input"},
        {title:"Value", field:"value", sorter:"string", editor:"input", headerFilter:"input"}
    ],
    dataEdited:function(data){ // Wenn Daten vom Benutzer geändert werden.
        // Zurück zu DevMode.aslx schicken und Attribute setzen.
        // Evtl. ein Rückgängig einbauen, wenn Fehler von Quest gegeben wird.
    }
});






//// Befüllen der Attval-Tabelle beim start (Über DevMode rüber schicken)
//var tabledata = [
//    {id:1, attribute:"isopen", value:"true"},
//    {id:2, attribute:"level", value:"3"},
//    {id:3, attribute:"alias", value:"XXX"}
//];

// Tabellendaten in die Tabelle laden.
// $("#debugtable_attval").tabulator("setData", tabledata); // Prüfen, ob es nötig ist die Tabelle vorher mit setData zu befüllen oder ob es ausreicht immer updateOrAddData zu verwenden.



function tableupdate (name) {
    $("#debugtable_attval").tabulator("clearData"); // Daten, zuvor löschen, damit nichts übrig bleibt von den alten Daten.

    // Aktualisieren der Attval-Tabelle (Bei Klick auf einen Namen in der Namenstabelle werden die Attribute plus Values Angezeigt und aktualisiert / Über DevMode rüber schicken)
    var debugtable_attval_data = [
        {id:1, attribute:"isopen", value:"false"},
        {id:2, attribute:"level", value:"4"},
        {id:3, attribute:"alias", value:"Tischlein"}
    ]; // Die Variable wird im DevMode.aslx generiert. Hierzu wird die Variable Name hingeschickt und alle Attribute und Values des Objektes mit dem Namen zurück im JSON-Format.

    $("#debugtable_attval").tabulator("updateOrAddData", debugtable_attval_data); // Prüfe, ob alte Daten auch entfernt werden mit updateOrAddData. Falls ja kann clearData werggelassen werden.
}





// Falls alle Daten aus der Tabelle gewünscht werden.
// var data = $("#debugtable").tabulator("getData");


*/