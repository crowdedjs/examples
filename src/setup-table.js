export default function setupTable(crowdSetup) {

  // display a table of computer entries
  var table = document.getElementById("ComputerEntryTable");
  // title row
  var titleRow = table.insertRow(0);
  var titleCell = titleRow.insertCell(0);
  var chiefComplaintCell = titleRow.insertCell(1);
  var takenVitalsCell = titleRow.insertCell(2);
  var bedCell = titleRow.insertCell(3);
  var inSimulation = titleRow.insertCell(4);
  
  titleCell.innerHTML = "Computer Entry";
  chiefComplaintCell.innerHTML = "Chief Complaint";
  takenVitalsCell.innerHTML = "Vitals Taken";
  bedCell.innerHTML = "Assigned Bed";
  inSimulation.innerHTML = "In Hospital";

  let computerEntries = 0;

  function fillComputerTable() {
    for (let i = 0; i < Hospital.computer.entries.length; i++) {
      // add missing entries to table
      if (Hospital.computer.entries.length > computerEntries) {
        var tempRow = table.insertRow(computerEntries + 1)
        var cell1 = tempRow.insertCell(0);
        var cell2 = tempRow.insertCell(1);
        var cell3 = tempRow.insertCell(2);
        var cell4 = tempRow.insertCell(3);
        var cell5 = tempRow.insertCell(4);
        cell1.innerHTML = computerEntries + 1;
        cell2.innerHTML = Hospital.computer.entries[computerEntries].getChiefComplaint();
        cell3.innerHTML = Hospital.computer.entries[computerEntries].getVitals();
        cell4.innerHTML = Hospital.computer.entries[computerEntries].getBed().getName();
        cell5.innerHTML = Hospital.computer.entries[computerEntries].getPatient().inSimulation;

        computerEntries++;

        // var tempRow1 = table.insertRow(2)
        // var cell1 = tempRow1.insertCell(0);
        // var cell2 = tempRow1.insertCell(1);
        // var cell3 = tempRow1.insertCell(2);
        // cell1.innerHTML = "temp";
        // cell2.innerHTML = "sample text";
        // cell3.innerHTML = "more sample text";


        // var tempRow2 = table.insertRow(3)
        // var cell1 = tempRow2.insertCell(0);
        // var cell2 = tempRow2.insertCell(1);
        // var cell3 = tempRow2.insertCell(2);
        // cell1.innerHTML = "temp";
        // cell2.innerHTML = "sample text";
        // cell3.innerHTML = "more sample text";

        // var tempRow3 = table.insertRow(4)
        // var cell1 = tempRow3.insertCell(0);
        // var cell2 = tempRow3.insertCell(1);
        // var cell3 = tempRow3.insertCell(2);
        // cell1.innerHTML = "temp";
        // cell2.innerHTML = "sample text";
        // cell3.innerHTML = "more sample text";
      }

      //update existing entries in table
      document.getElementById("ComputerEntryTable").rows[i + 1].cells[1].innerHTML = Hospital.computer.entries[i].getChiefComplaint();
      if (typeof Hospital.computer.entries[i].getVitals() === 'undefined') {
        document.getElementById("ComputerEntryTable").rows[i + 1].cells[2].innerHTML = "Not Taken";
      }
      else {
        document.getElementById("ComputerEntryTable").rows[i + 1].cells[2].innerHTML = Hospital.computer.entries[i].getVitals();
      }
      document.getElementById("ComputerEntryTable").rows[i + 1].cells[3].innerHTML = Hospital.computer.entries[i].getBed().getName();
      document.getElementById("ComputerEntryTable").rows[i + 1].cells[4].innerHTML = Hospital.computer.entries[i].getPatient().inSimulation;
    }
    requestAnimationFrame(fillComputerTable);
  }

  fillComputerTable();

  //Show FPS Counter
  //Comment this line if you don't want to show the FPS counter
  // SCORING FUNCTION GRAPH
  //javascript: (function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()
  var stats = new Stats();
  //AGENTS IN SIMULATION PER FRAME
  var xPanel = stats.addPanel(new Stats.Panel('AGENTS', '#ff8', '#221'));
  //var yPanel = stats.addPanel( new Stats.Panel( 'y', '#f8f', '#212' ) );
  stats.showPanel(2);
  stats.dom.style.position = 'fixed';
  stats.dom.style.float = 'left';
  document.body.appendChild(stats.dom);
  let i = 0;

  // animates a graph that displays the agents in the simulation each frame
  function animate() {
    if (typeof crowdSetup.agentPositions[i] === 'undefined') {
      //console.log("undefined");
    }
    else {
      let agentsIn = 0;
      for (let j = 0; j < crowdSetup.agentPositions[i].length; j++) {
        if (crowdSetup.agentPositions[i][j].inSimulation) {
          agentsIn++;
        }
      }
      //xPanel.update(crowdSetup.agentPositions[i].length);
      xPanel.update(agentsIn);
      i++;
    }

    stats.update();

    requestAnimationFrame(animate);

  }

  animate();

}