import FollowInstructions from "../behavior/follow-instructions.js";
import GoTo from "../behavior/go-to.js";
import GoToLazy from "../behavior/go-to-lazy.js";
// import LOG 
import Stop from "../behavior/stop.js";
import WaitForever from "../behavior/wait-forever.js";



class patient {

  constructor(myIndex, locations, startLocation) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(startLocation);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let me = () => Hospital.agents.find(a => a.id == myIndex);;
    let myGoal = locations.find(l => l.name == "Check In");
    if (!myGoal) throw new Exception("We couldn't find a location called Check In");

    // this.goTo = new GoTo(self.index, myGoal.position);

    this.tree = builder

      .sequence("Patient Actions")
      //.selector("Check In")
      .splice(new GoToLazy(myIndex, () => this.waypoints[0].position).tree)// CHECK IN

      .splice(new Stop(myIndex).tree)



      .splice(new FollowInstructions(myIndex, locations).tree)

      .splice(new WaitForever(myIndex, locations).tree)
      .end()
      .build();
  }

  async update( crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default patient;