import PatientTempState from "../support/patient-temp-state.js";
import RoomType from "../support/room-type.js"

class LeavePatient {

  constructor(myIndex) {
    this.index = myIndex;
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    this.tree = builder
      .sequence("Leave Patient")
        .do("Assign Room", (t) => {
            let patient = me().getCurrentPatient();
            me().setCurrentPatient(null);
            patient.setPatientTempState(PatientTempState.GO_INTO_ROOM);
            patient.setAssignedRoom(Hospital.computer.getEntry(patient).getBed());
            

            return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      .end()
      .build();
  }


}

export default LeavePatient;