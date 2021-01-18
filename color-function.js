//Color agents based on their description
function colorFunction(agentDescription) {
  let color = new THREE.Color(200, 0, 200);
  if (agentDescription.name == "patient") {
    color = new THREE.Color(0, .75, 0);
  }
  else if (agentDescription.name == "Nurse") {
    color = new THREE.Color(.75, .75, .75);
  }
  else if (agentDescription.name == "Attending") {
    color = new THREE.Color(.75, 0, 0);
  }
  else if (agentDescription.name == "Resident") {
    color = new THREE.Color(.75, .75, 0);
  }
  else if (agentDescription.name == "Tech") {
    color = new THREE.Color(0, 0, .75);
  }
  else {
    color = new THREE.Color(0, 0, 0);
  }
  return color;
}

export default colorFunction;