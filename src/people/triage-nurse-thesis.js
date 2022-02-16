import GoTo from "../behavior/go-to.js";
import GoToLazy from "../behavior/go-to-lazy.js";
import LeavePatient from "../behavior/leave-patient.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree";
import PatientTempState from "../support/patient-temp-state.js";
import task from "../support/task-thesis.js";

class triageNurseThesis {

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
    let entrance = Hospital.getLocationByName("Main Entrance");

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
                  //Hospital.activeTriage.shift();
                  Hospital.activeTriage.splice(i, 1);
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
              // LEFTOVER ARTIFACT OF ORIGINAL ATTEMPT TO FIX TRIAGE WITH SHIFT CHANGES
              // THIS IF STATEMENT PROBABLY WON'T EVER RUN DUE TO THE ACTUAL SUCCESSFUL IMPLEMENTATION
              if (Hospital.computer.entries[i].getPatient().getInstructor() != null && Hospital.computer.entries[i].getPatient().getInstructor() == me() && Hospital.computer.entries[i].getPatient().getPatientTempState() == PatientTempState.FOLLOWING) {
                Hospital.computer.entries[i].getPatient().setInstructor(null);
                Hospital.computer.entries[i].getPatient().setPatientTempState(PatientTempState.WAITING);
                // THIS IF STATEMENT DOESN'T DO ANYTHING BECAUSE YOU CAN'T ACCESS THE VALUE FOR SOME REASON
                if (Hospital.activeGreeter[0].triageList[0] == Hospital.computer.entries[i].getPatient()) {
                  Hospital.activeGreeter[0].triageList.shift();
                }
                Hospital.activeGreeter[0].triageList.push(Hospital.computer.entries[i].getPatient());
              }
            }
            me().inSimulation = false;
            return fluentBehaviorTree.BehaviorTreeStatus.Running;
          })
        .end()
      .end()

      .splice(new GoTo(self.index, Hospital.locations.find(l => l.name == "TriageNursePlace").location).tree)
      // THESE ASSIGNMENTS ARE GIVEN BY THE GREETER NURSE
      .do("Wait For Patient Assignment", async (t) => {
        if (Hospital.triageTaskList.length == 0) {
          return fluentBehaviorTree.BehaviorTreeStatus.Failure;
        }
        else {
          // THIS IS NOT DESIGNED WITH SEVERITY/WAIT TIME OR ROOM ASSIGNMENT IN MIND YET
          let myTask = Hospital.triageTaskList.shift();
          me().setCurrentPatient(myTask.patient);
          me().getCurrentPatient().setInstructor(me());
          me().getCurrentPatient().setPatientTempState(PatientTempState.FOLLOWING);
  
          me().setBusy(true);
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        }
      })

      .splice(new GoToLazy(self.index, () => me().getCurrentPatient().getAssignedRoom().location).tree)
      
      .do("Leave Patient", (t) => {
        // ONCE THE PATIENT HAS BEEN DELIVERED, QUEUE TASKS TO THE APPROPRIATE MEDICAL STAFF
        // Task ID / Severity / Entry Time / Patient / Location
        if (me().getCurrentPatient().getAssignedRoom().name == "Main Entrance") {
          me().getCurrentPatient().setPatientTempState(PatientTempState.DONE);
          let result = leavePatient.tick(t)
          if (me().replacement == false) {
            me().setBusy(false);
          }
          return result;
        }
        
        let nurseTask = new task("Get Health Information", me().getCurrentPatient().getSeverity(), 0, me().getCurrentPatient(), me().getCurrentPatient().getAssignedRoom());
        Hospital.nurseTaskList.push(nurseTask);
        
        let techTaskVitals = new task("Get Vitals", me().getCurrentPatient().getSeverity(), 0, me().getCurrentPatient(), me().getCurrentPatient().getAssignedRoom());
        Hospital.techTaskList.push(techTaskVitals);

        let techTaskEKG = new task("Get EKG", me().getCurrentPatient().getSeverity(), 0, me().getCurrentPatient(), me().getCurrentPatient().getAssignedRoom());
        Hospital.techTaskList.push(techTaskEKG);

        let result = leavePatient.tick(t)
        if (me().replacement == false) {
          me().setBusy(false);
        }

        return result;
      })
      
    .end()
    .build();
  }

  async update(crowd, msec) {
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
  }

}

export default triageNurseThesis;