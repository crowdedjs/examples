import GoTo from "../behavior/go-to.js"
import GoToLazy from "../behavior/go-to-lazy.js";
import LeavePatient from "../behavior/leave-patient.js";
import WaitForever from "../behavior/wait-forever.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



class triageNurse {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "TriageNursePlace";
    let me = () => Hospital.agents.find(a => a.id == myIndex);;

    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);

    let leavePatient = new LeavePatient(self.index).tree;


    this.tree = builder
      .sequence("Pick Triage Room")
      .splice(new GoTo(self.index, myGoal.location).tree)


      .do("Wait For Patient Assignment", (t) => {
        if (!me().getCurrentPatient()) return fluentBehaviorTree.BehaviorTreeStatus.Running;
        me().setBusy(true);
        console.log("I'm Busy!");
        return fluentBehaviorTree.BehaviorTreeStatus.Success;

      })

      .splice(new GoToLazy(self.index, () => me().getCurrentPatient().getAssignedRoom().location).tree)

      .do("Leave Patient", (t) => {
        let result = leavePatient.tick(t)
        me.busy(false);
        console.log("I'm free!");
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

