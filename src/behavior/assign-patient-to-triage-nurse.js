import PatientTempState from "../support/patient-temp-state.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree";
import FollowInstructions from "./follow-instructions-old.js";
import task from "../support/task.js";


class AssignPatientToTriageNurse {

  constructor(myIndex) {
    this.index = myIndex;
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    this.tree = builder
      .sequence("Assign Patient To Triage Nurse")
        .do("Assign Patient", (t) => {
          if (me().triageList.length == 0) {
            return fluentBehaviorTree.BehaviorTreeStatus.Failure;
          }
          else {
            let myPatient = me().triageList.shift();
            // Task ID / Severity / Entry Time / Patient / Location
            let triageTask = new task("Triage", myPatient.getSeverity(), 0, myPatient, myPatient.getAssignedRoom());

            Hospital.triageTaskList.push(triageTask);

            return fluentBehaviorTree.BehaviorTreeStatus.Success;
          }    
      })
      .end()
      .build();
  }


}

export default AssignPatientToTriageNurse;