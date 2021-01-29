// NOT FULLY PORTED
import GoTo from "../behavior/go-to.js"
import GoToLazy from "../behavior/go-to-lazy.js";
import LeavePatient from "../behavior/leave-patient.js";
import WaitForever from "../behavior/wait-forever.js"


class triageNurse {

  constructor(myIndex, locations, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "TriageNursePlace";
    let me = () => Hospital.agents.find(a => a.id == myIndex);;

    let myGoal = locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);

    let leavePatient = new LeavePatient(self.index, locations).tree;


    this.tree = builder
      .sequence("Pick Triage Room")
      .splice(new GoTo(self.index, myGoal.position).tree)


      .do("Wait For Patient Assignment", (t) => {
        if (!me().getCurrentPatient()) return fluentBehaviorTree.BehaviorTreeStatus.Running;
        return fluentBehaviorTree.BehaviorTreeStatus.Success;

      })

      .splice(new GoToLazy(self.index, () => me().getCurrentPatient().getAssignedRoom().location).tree)

      .do("Leave Patient", (t) => {
        let result = leavePatient.tick(t)
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

