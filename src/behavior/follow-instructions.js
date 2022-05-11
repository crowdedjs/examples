import PatientTempState from "../support/patient-temp-state.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree";
import LocationStatus from "../support/location-status.js";
import task from "../support/task.js";

class FollowInstructions {

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

          // KEEP BELOW EDIT TO ADDRESS PATIENTS GETTING PUSHED OUT OF ROOMS, BUT NEED TO FIX PATIENTS FLEEING THEIR SCANNING ROOM
          // let destination = me().getAssignedRoom().getLocation();
          // if(Vector3.fromObject(destination).distanceToSquared(me().getLocation()) > .5){
          //   me().setPatientTempState(PatientTempState.GO_INTO_ROOM)
          // }
          // else{
          //   agentConstant.destination = new Vector3(agentConstant.location.x, agentConstant.location.y, agentConstant.location.z);
          // }
        }
        else if (state == PatientTempState.FOLLOWING) {          
          // me().waitToCheckIn = false;
          // me().waitInWaitingRoom = false;
          // me().waitInRoom1 = false;
          // me().waitInScanRoom = false;
          // me().waitInRoom2 = false;
          
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
          me().waitInRoom1 = true;

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
          me().lengthOfStay = me().ticksPresent;
          let patientDataValues = [me().lengthOfStay, me().waitingTime];
          Hospital.patientData.push(patientDataValues);
          // total simulation time: 24 hours -> 86400 ticks
          let lengthOfStayMinutes = ((1440 * me().lengthOfStay) / 86400);
          lengthOfStayMinutes = Math.round((lengthOfStayMinutes + Number.EPSILON) * 100) / 100;

          let waitingTimeMinutes = ((1440 * me().waitingTime) / 86400);
          waitingTimeMinutes = Math.round((waitingTimeMinutes + Number.EPSILON) * 100) / 100;
          // console.log("Patient " + id + " Length of Stay: " + me().lengthOfStay + " ticks / " + lengthOfStayMinutes + " minutes in-simulation");
          // console.log("Patient " + id + " Waited for: " + me().waitingTime + " ticks / " + waitingTimeMinutes + " minutes in-simulation");
          //console.log(lengthOfStayMinutes + "\t" + waitingTimeMinutes);
          //console.log(waitingTimeMinutes);

          let wait1Minutes = ((1440 * me().waitToCheckInValue) / 86400);
          wait1Minutes = Math.round((wait1Minutes + Number.EPSILON) * 100) / 100;

          let wait2Minutes = ((1440 * me().waitInWaitingRoomValue) / 86400);
          wait2Minutes = Math.round((wait2Minutes + Number.EPSILON) * 100) / 100;

          let wait3Minutes = ((1440 * me().waitInRoom1Value) / 86400);
          wait3Minutes = Math.round((wait3Minutes + Number.EPSILON) * 100) / 100;

          let wait4Minutes = ((1440 * me().waitInScanRoomValue) / 86400);
          wait4Minutes = Math.round((wait4Minutes + Number.EPSILON) * 100) / 100;

          let wait5Minutes = ((1440 * me().waitInRoom2Value) / 86400);
          wait5Minutes = Math.round((wait5Minutes + Number.EPSILON) * 100) / 100;

          
          console.log(lengthOfStayMinutes + "\t" + waitingTimeMinutes + "\n" + wait1Minutes + "\t" + wait2Minutes + "\t" + wait3Minutes + "\t" + wait4Minutes + "\t" + wait5Minutes);

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
          //me().getPermanentRoom().setLocationStatus(LocationStatus.SANITIZE);
          // NEW METHOD
          let sanitizeTask = new task("Sanitize", null, null, null, me().getPermanentRoom());
          Hospital.janitorTaskList.push(sanitizeTask);

        }
        else if(state == PatientTempState.ARRIVED) {
          agentConstant.destination = myGoal.location;
          me().waitToCheckIn = true;
        }
        else if(state == PatientTempState.BOOKED){
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

export default FollowInstructions;