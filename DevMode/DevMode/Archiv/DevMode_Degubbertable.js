$('head').html(
    '<link href="DevMode/tabulator.min.css" rel="stylesheet" />' +
    '<script type="text/javascript" src="DevMode/tabulator.min.js"></script>'
);

// Eine Ausblendung der Tabelle ermöglichen (mittels Anfasser).
$('body').html(
    '<div id="debuggertable">' +
    '<div id="debuggertable_names"></div>' +
    '<div id="debuggertable_attr"></div>' +
    '</div>'
);

$(document).ready(function () {

    $('#debuggertable').css({
        "height": "100vh",
        "width": "100vw",
        "background": "white",
        "font-family": "Lucida Console"
    });
    $('#debuggertable input').css({
        "font-family": "Lucida Console"
    });
    $('#debuggertable_names').css({
        "box-sizing": "border-box",
        "float": "left",
        "height": "100%",
        "width": "33%",
        "margin-right": "5px"
    });
    $('#debuggertable_attr').css({
        "box-sizing": "border-box",
        "float": "left",
        "height": "100%",
        "width": "66%"
    });

    // Name-Table
    $("#debuggertable_names").tabulator({
        selectable: 1,
        layout: "fitColumns", // passt sich perfekt dem übergeordneten Container an
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

    // Attribute-Table
    $("#debuggertable_attr").tabulator({
        layout: "fitColumns", // passt sich perfekt dem übergeordneten Container an.
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


    function tableupdate(table, datastr) {
        var data = JSON.parse(datastr);
        $("#debuggertable_" + table).tabulator("clearData"); // Daten, zuvor löschen, damit nichts übrig bleibt von den alten Daten.
        $("#debuggertable_" + table).tabulator("setData", data); // Prüfe, ob alte Daten auch entfernt werden mit updateOrAddData. Falls ja kann clearData werggelassen werden.
    }


    // Namen werden geladen (Über Devmode) // Frage, ob id verwendet werden muss, oder weggelassen werden kann.
    // zu DevMode schicken und der schickt den JSON-String direkt zu tableupdate.
    tableupdate('names', '[{"name":"kiste"},{"name":"game"},{"name":"tisch"}]');


})



/*








// Befüllen der Namenstabelle beim start (Über DevMode rüber schicken)
var debuggertable_names_data = [
    {id:1, name:"kiste"}, // Frage, ob id verwendet werden muss, oder weggelassen werden kann.
    {id:2, name:"game"},
    {id:3, name:"tisch"}
];

// Tabellendaten in die Tabelle laden
$("#debuggertable_names").tabulator("setData", debuggertable_names_data);





// Initialisierung der Tabelle
// Value ist Editierbar, Sortierbar, Titelfiter
$("#debuggertable_attval").tabulator({
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
// $("#debuggertable_attval").tabulator("setData", tabledata); // Prüfen, ob es nötig ist die Tabelle vorher mit setData zu befüllen oder ob es ausreicht immer updateOrAddData zu verwenden.



function tableupdate (name) {
    $("#debuggertable_attval").tabulator("clearData"); // Daten, zuvor löschen, damit nichts übrig bleibt von den alten Daten.

    // Aktualisieren der Attval-Tabelle (Bei Klick auf einen Namen in der Namenstabelle werden die Attribute plus Values Angezeigt und aktualisiert / Über DevMode rüber schicken)
    var debuggertable_attval_data = [
        {id:1, attribute:"isopen", value:"false"},
        {id:2, attribute:"level", value:"4"},
        {id:3, attribute:"alias", value:"Tischlein"}
    ]; // Die Variable wird im DevMode.aslx generiert. Hierzu wird die Variable Name hingeschickt und alle Attribute und Values des Objektes mit dem Namen zurück im JSON-Format.

    $("#debuggertable_attval").tabulator("updateOrAddData", debuggertable_attval_data); // Prüfe, ob alte Daten auch entfernt werden mit updateOrAddData. Falls ja kann clearData werggelassen werden.
}





// Falls alle Daten aus der Tabelle gewünscht werden.
// var data = $("#debuggertable").tabulator("getData");


*/