// NOT FULLY PORTED
import GoTo from "../behavior/GoTo.js"
import GoToLazy from "../behavior/GoToLazy.js";
import LeavePatient from "../behavior/LeavePatient.js";
import WaitForever from "../behavior/WaitForever.js"


class triageNurse {

  constructor(myIndex, agentConstants, locations, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "TriageNursePlace";
    let me= ()=>agentConstants.find(a=>a.id == myIndex);;

    let myGoal = locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);


    this.tree = builder
      .sequence("Pick Triage Room")
      .splice(new GoTo(self.index, myGoal.position).tree)
      

      .do("Wait For Patient Assignment", (t) => {
        if(!me().CurrentPatient) return fluentBehaviorTree.BehaviorTreeStatus.Running;
        return fluentBehaviorTree.BehaviorTreeStatus.Success; 

      })

      .splice(new GoToLazy(self.index, ()=>me().CurrentPatient.AssignedRoom.location).tree)

      .splice(new LeavePatient(self.index, agentConstants, locations).tree)
      .end()
      .build();
  }

  async update(agentConstants, crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default triageNurse;

