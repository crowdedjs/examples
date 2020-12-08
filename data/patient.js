// NOT FULLY PORTED
import GoTo from "../behavior/GoTo.js"
import WaitForever from "../behavior/WaitForever.js"



class patient {

  constructor(agent, myIndex, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let me = agent;
    let myGoal = me.locations.find(l => l.name == "Check In");
    if (!myGoal) throw new "We couldn't find a location called B_DESK";

    this.goTo = new GoTo(self.index, myGoal.position);

    this.tree = builder
      // how to set to repeat?
      .sequence("Patient Actions")
      .splice(this.goTo.tree)
      .splice(new WaitForever().tree)
            

      // dynamic Guard Selector ??
      .selector("Check In")
      .do("Go to A Room", (t) => {
        // check in room

      })
      .do("Stop", (t) => {

      })
      .end()
      .do("Log Text", (t) => {
        // "I stopped"
      })
      .do("Follow Instructions", (t) => {

      })
      .do("Wait Forever", (t) => new WaitForever().execute())

      .end()
      .build();
  }

  async update(agents, crowd, msec) {
    this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ agents, crowd, msec }) //Call the behavior tree
    return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default patient;
