import PatientTempState from "../support/patient-temp-state.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree";
import LocationStatus from "../support/location-status.js";
import task from "../support/task-thesis.js";

class FollowInstructionsThesis {

  constructor(myIndex) {
    //this.me = agent;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);
    
    this.index = myIndex;


    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference


    this.tree = builder
      .sequence("Follow Instructions")
      .do("Follow Instructions", t => {
        
        let agentConstant = Hospital.agents.find(a => a.id == self.index);
        
        let id = Hospital.agents[self.index].id;
        let simulationAgent = t.crowd.find(f=>f.id == id);
        let loc = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
        let state = me().getPatientTempState();
        
        let myGoal = Hospital.locations.find(l => l.name == "Check In");
        if (me().arrivalLocation.name == "Ambulance Entrance") {
          myGoal = Hospital.locations.find(l => l.name == "Ambulance Entrance");
        }

        if (state == PatientTempState.WAITING) {         
          //agentConstant.destination = new Vector3(loc.x, loc.y, loc.z);
          //agentConstant.destination = Vector3.fromObject(t.crowd.find(f=>f.id == me().idx).location);
          agentConstant.destination = new Vector3(agentConstant.location.x, agentConstant.location.y, agentConstant.location.z);
        }
        else if (state == PatientTempState.FOLLOWING) {          
          let instructor = me().getInstructor();
          let instructorLoc = Vector3.fromObject(t.crowd.find(f=>f.id == instructor.id).location);
          let instructorLocation = instructorLoc;
          let myLocation = loc;
      
          //if (myLocation.distanceTo(instructorLocation) < 1) // If we're really close, stop
          if (myLocation.distanceToSquared(instructorLocation) < 1) // If we're really close, stop
          {
            agentConstant.destination = new Vector3(loc.x, loc.y, loc.z);//Stop
          }
          // the patient needs to hold their horses. Wait for their instructor to come to them, then follow.
          // THE DISTANCE THEY FOLLOW GIVES WEIRD OUTCOMES
          //else if (myLocation.distanceTo(instructorLocation) > 10) {
          else if (myLocation.distanceToSquared(instructorLocation) > 100) {
            //console.log("Waiting for my instructor!");
          }
          else {
            //Head toward the instructor, but don't collide
            let towardMe = Vector3.subtract(instructorLocation, myLocation);
            towardMe.normalize();
            let destination = Vector3.add(instructorLocation, towardMe);
            agentConstant.destination = destination;
          }
        }
        else if (state == PatientTempState.GO_INTO_ROOM) {
          let destination = me().getAssignedRoom().getLocation();
          //if(Vector3.fromObject(destination).distanceTo(me().getLocation()) < .5){
          if(Vector3.fromObject(destination).distanceToSquared(me().getLocation()) < .5){
            me().setPatientTempState(PatientTempState.WAITING)
          }
          else{
            me().setDestination(destination);
          }
        }
        else if(state == PatientTempState.DONE){
          // TESTING - FPS is not 25, gives weird answers
          //me().lengthOfStay = ((me().ticksPresent * 25) / 1000) / 60;
          me().lengthOfStay = me().ticksPresent;
          let patientDataValues = [me().lengthOfStay, me().waitingTime];
          Hospital.patientData.push(patientDataValues);
          console.log("Patient " + id + " Length of Stay: " + me().lengthOfStay + " ticks");
          console.log("Patient " + id + " Waited for: " + me().waitingTime + " ticks");

          me().inSimulation = false;
          // ADJUST CTQUEUE OR XRAYQUEUE SO TECH TAKES NEXT PATIENT TO CT ROOM
          //Hospital.CTQueue.shift();
          for (let i = 0; i < Hospital.CTQueue.length; i++) {
            if (Hospital.CTQueue[i] == me()) {
              Hospital.CTQueue.splice(i, 1);
            }
          }
          for (let i = 0; i < Hospital.XRayQueue.length; i++) {
            if (Hospital.XRayQueue[i] == me()) {
              Hospital.XRayQueue.splice(i, 1);
            }
          }
          // SET ROOM AS READY TO CLEAN
          // OLD METHOD
          me().getPermanentRoom().setLocationStatus(LocationStatus.SANITIZE);
          // NEW METHOD
          let sanitizeTask = new task("Sanitize", null, null, null, me().getPermanentRoom());
          Hospital.janitorTaskList.push(sanitizeTask);

        }
        else if(state == PatientTempState.ARRIVED) {
          agentConstant.destination = myGoal.location;
        }
        else if(state == PatientTempState.BOOKED){
          // TESTING - FPS is not 25, gives weird answers
          //me().lengthOfStay = ((me().ticksPresent * 25) / 1000) / 60;
          me().lengthOfStay = me().ticksPresent;
          let patientDataValues = [me().lengthOfStay, me().waitingTime];
          Hospital.patientData.push(patientDataValues);
          console.log("Patient " + id + " Length of Stay: " + me().lengthOfStay + " ticks");
          console.log("Patient " + id + " Waited for: " + me().waitingTime + " ticks");

          me().inSimulation = false;
        }
        else {
          console.log("Invalid patient temp state " + state);
        }


        return fluentBehaviorTree.BehaviorTreeStatus.Running;
      })
      
      .end()
      .build();
  }



}

export default FollowInstructionsThesis;