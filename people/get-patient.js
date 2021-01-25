// not fully ported
import GoTo from "../behavior/go-to.js";

class getPatient {

    constructor(myIndex, locations, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me = agent;

      this.tree = builder
        .sequence("Get Patient")

            // MAKE INTO OWN BEHAVIOR
            .do("Go To My Patient", (t) => {
              patient = me.CurrentPatient;
              me.AssignedRoom(patient.AssignedRoom);
              myRoom = me.AssignedRoom;
              // set destination and go to room

              return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .splice(new GoTo(self.index, myRoom))

            // MAKE INTO OWN BEHAVIOR
            .do("Call Patient", (t) => {
              patient.Instructor(me);
              patient.PatientTempState("FOLLOWING_INSTRUCTIONS");

              return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })

            // MAKE INTO OWN BEHAVIOR
            .do("Wait For Patient", (t) => {
              // UPDATE THIS LINE
              patientLocation = me.CurrentPatient.Location;
              // UPDATE THIS LINE
              if(patientLocation.distanceTo(me.Location < 1))
                return fluentBehaviorTree.BehaviorTreeStatus.Success;
              return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })

        .end()
        .build();
    }
  
    async update( crowd, msec) {
      //this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ crowd, msec }) //Call the behavior tree
      //return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }

export default getPatient;