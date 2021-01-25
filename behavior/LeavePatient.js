import PatientTempState from "../support/PatientTempState.js";
import RoomType from "../support/RoomType.js"

class LeavePatient {

  constructor(myIndex, locations) {
    this.index = myIndex;
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    this.tree = builder
      .sequence("Leave Patient")
        .do("Assign Room", (t) => {
            let patient = me().CurrentPatient;
            me().CurrentPatient = null;
            patient.PatientTempState = PatientTempState.GO_INTO_ROOM;
            patient.AssignedRoom = Hospital.computer.getEntry(patient).Bed;
            

            return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      .end()
      .build();
  }


}

export default LeavePatient;