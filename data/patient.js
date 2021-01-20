import FollowInstructions from "../behavior/FollowInstructions.js";
import GoTo from "../behavior/GoTo.js";
// import LOG 
import Stop from "../behavior/Stop.js";
import WaitForever from "../behavior/WaitForever.js";



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
    if (!myGoal) throw new Exception("We couldn't find a location called Check In");

    this.goTo = new GoTo(self.index, myGoal.position);

    this.tree = builder

    .sequence("Patient Actions")         
      .selector("Check In")
        .splice(this.goTo.tree) // CHECK IN

        .splice(new Stop().tree)
     
      // For testing purposes, relic from java codebase
      // .do("Log Text", (t) => {
      //   // "I stopped"
      // })
      
      .splice(new FollowInstructions().tree)

      .splice(new WaitForever().tree)
    .end()
    .build();
  }

  async update(agentConstants, crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default patient;