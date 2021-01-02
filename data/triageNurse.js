// NOT FULLY PORTED
import GoTo from "../behavior/GoTo.js"
import WaitForever from "../tasks/WaitForever.js"


class triageNurse {

  constructor(agent, myIndex, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "TriageNursePlace";
    let me = agent;

    let myGoal = me.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);


    this.tree = builder
      // how to set to repeat?
      .sequence("Pick Triage Room")
      .splice(new GoTo(self.index, myGoal.position).tree)
      .splice(new WaitForever(myIndex).tree)
      .do("Go to Room By Name", (t) => {

      })

      .do("Wait For Patient Assignment", (t) => {

      })

      .do("Take Patient to Room", (t) => {

      })

      .do("Leave Patient", (t) => {

      })
      .end()
      .build();
  }

  async update(agentConstants, crowd, msec) {
    this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
    return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default triageNurse;

