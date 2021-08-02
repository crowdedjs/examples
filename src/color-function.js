import * as THREE from "three"

//Color agents based on their description
function colorFunction(agentDescription) {
  let color = new THREE.Color(200, 0, 200);
  // GREEN
  if (agentDescription.name == "patient") {
    color = new THREE.Color(0, .75, 0);
  }
  // WHITE
  else if (agentDescription.name == "Nurse") {
    color = new THREE.Color(.75, .75, .75);
  }
  // RED
  else if (agentDescription.name == "Attending") {
    color = new THREE.Color(.75, 0, 0);
  }
  // YELLOW
  else if (agentDescription.name == "Resident") {
    color = new THREE.Color(.75, .75, 0);
  }
  // TEMPORARY CYAN FOR TESTING
  else if (agentDescription.medicalStaffSubclass == "Janitorial") {
    color = new THREE.Color(0, .75, .75);
  }
  // BLUE
  else if (agentDescription.name == "Tech") {
    color = new THREE.Color(0, 0, .75);
  }
  // CYAN
  else if (agentDescription.name == "Pharmacist") {
    color = new THREE.Color(0, .75, .75);
  }
  // BLACK
  else {
    color = new THREE.Color(0, 0, 0);
  }
  return color;
}

export default colorFunction;