function generateNovaModelCypher() {
    let activeSheet = SpreadsheetApp.getActiveSpreadsheet();
  
    // This represents ALL the data
    var values = activeSheet.getDataRange().offset(1, 0).getValues();
  
    // make functional?
    let jtbd_collection = [];
    for (var i = 0; i < values.length; i++) {
      let jtbd = {};
      jtbd.name = values[i][0];
      jtbd.actors = values[i][1].toString().split(';');
      jtbd.read = values[i][2].toString().split(';');
      jtbd.write = values[i][3].toString().split(';');
      jtbd.update = values[i][4].toString().split(';');
      jtbd_collection.push(jtbd);
    }
  
    let cypher_script = "";
  
    jtbd_collection.filter(jtbd => jtbd.name).forEach(jtbd => {
      let jtbd_merge = 'MERGE (jtbd:JTBD {name: \'' + jtbd.name + '\', progress: 0})\r\n';
      let data_merge = '';
      jtbd.read
        .filter(d => d)
        .forEach((data, i) => data_merge
          += 'MERGE (reading' + i + ':Data {name: \'' + data + '\'})\r\n');
  
      jtbd.update
        .filter(d => d)
        .forEach((data, i) => data_merge
          += 'MERGE (updating' + i + ':Data {name: \'' + data + '\'})\r\n');
  
      jtbd.write
        .filter(d => d)
        .forEach((data, i) => data_merge
          += 'MERGE (writing' + i + ':Data {name: \'' + data + '\'})\r\n');
  
      let actor_merge = '';
      jtbd.actors
        .filter(a => a)
        .forEach((actor, i) => actor_merge
          += 'MERGE (a' + i + ':Actor {name: \'' + actor + '\'})\r\n'
          + 'MERGE (a' + i + ')-[does' + i + ':DOES]->(jtbd)\r\n'
        );
  
      let readers_merge = '';
      jtbd.read
        .filter(r => r)
        .forEach((r, i) => readers_merge
          += 'MERGE (jtbd)-[reads' + i + ':READS]->(reading' + i + ')\r\n'
        );
  
      let updaters_merge = '';
      jtbd.update
        .filter(r => r)
        .forEach((r, i) => updaters_merge
          += 'MERGE (jtbd)-[updates' + i + ':UPDATES]->(updating' + i + ')\r\n'
        );
  
      let writers_merge = '';
      jtbd.write
        .filter(r => r)
        .forEach((r, i) => writers_merge
          += 'MERGE (jtbd)-[writes' + i + ':WRITES]->(writing' + i + ')\r\n'
        );
  
      cypher_script
        += jtbd_merge
        + actor_merge
        + data_merge
        + readers_merge
        + writers_merge
        + updaters_merge
        + ';\r\n';
    });
  
    var cypherSheet = activeSheet.getSheetByName("cypher");
  
    if (cypherSheet != null) {
      activeSheet.deleteSheet(cypherSheet);
    }
  
    cypherSheet = activeSheet.insertSheet();
    cypherSheet.setName("cypher");
  
    cypherSheet.setColumnWidth(1, 400);
    cypherSheet.getRange(1, 1).setValue(cypher_script);
  }
  
  function onOpen() {
    let ui = SpreadsheetApp.getUi();
    ui.createMenu('Nova Modelling').addItem('Generate Cypher', 'generateNovaModelCypher').addToUi();
  }