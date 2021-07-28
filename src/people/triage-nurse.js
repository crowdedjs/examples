import GoTo from "../behavior/go-to.js";
import GoToLazy from "../behavior/go-to-lazy.js";
import LeavePatient from "../behavior/leave-patient.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree";
import PatientTempState from "../support/patient-temp-state.js";


class triageNurse {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "TriageNursePlace";
    //let goToName = "Check In"
    let me = () => Hospital.agents.find(a => a.id == myIndex);

    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);

    let leavePatient = new LeavePatient(self.index).tree;


    this.tree = builder
    .sequence("Pick Triage Room")

      .selector("Check for arrival")  
        .condition("Clock in", async (t) => me().onTheClock)
        .do("SHIFT CHANGE", (t) => {
          // SHIFT CHANGE
          if (me().onTheClock == false) {
            me().onTheClock = true;
            Hospital.activeTriage.push(me());
            if (Hospital.activeTriage[0] != me() && Hospital.activeTriage.length > 2) {
              for (let i = 0; i < Hospital.activeTriage.length; i++) {
                if (!Hospital.activeTriage[i].replacement) {
                  Hospital.activeTriage[i].replacement = true;
                  Hospital.activeTriage.shift();
                  break;
                }
              }
            }
          }
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        })
      .end()

      // SHIFT CHANGE SEQUENCE OF BEHAVIORS
      .selector("Check for Replacement")
        .condition("Replacement is Here", async (t) => !me().replacement)
        .sequence("Exit Procedure")
          .splice(new GoTo(self.index, Hospital.locations.find(l => l.name == "Main Entrance").location).tree)
          .do("Leave Simulation", (t) => {
            for(let i = 0; i < Hospital.computer.entries.length; i++) {
              if (Hospital.computer.entries[i].getPatient().getInstructor() != null && Hospital.computer.entries[i].getPatient().getInstructor() == me() && Hospital.computer.entries[i].getPatient().getPatientTempState() == PatientTempState.FOLLOWING) {
                Hospital.computer.entries[i].getPatient().setInstructor(null);
                Hospital.computer.entries[i].getPatient().setPatientTempState(PatientTempState.WAITING);
                Hospital.activeGreeter[0].triageList.push(Hospital.computer.entries[i].getPatient());
              }
            }
            // if (Hospital.aTeam[2] == me()) {
            //   Hospital.aTeam[2] = null;
            // }
            me().inSimulation = false;
            return fluentBehaviorTree.BehaviorTreeStatus.Running;
          })
        .end()
      .end()

      //.splice(new GoTo(self.index, myGoal.location).tree)
      .splice(new GoTo(self.index, Hospital.locations.find(l => l.name == "TriageNursePlace").location).tree)

      .do("Wait For Patient Assignment", (t) => {
        if (!me().getCurrentPatient()) return fluentBehaviorTree.BehaviorTreeStatus.Running;
        me().setBusy(true);
        return fluentBehaviorTree.BehaviorTreeStatus.Success;

      })

      .splice(new GoToLazy(self.index, () => me().getCurrentPatient().getAssignedRoom().location).tree)
      
      .do("Leave Patient", (t) => {
        let result = leavePatient.tick(t)
        me().setBusy(false);
        return result;
      })
    .end()
    .build();
  }

  async update(crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default triageNurse;

