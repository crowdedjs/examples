import GoTo from "../behavior/GoTo.js";
import WaitForever from "../behavior/WaitForever.js";

class janitorial {

    constructor(agent, myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
  
      let me = agent;
      let myGoal = me.locations.find(l => l.name == "FAST_TRACK");
      if (!myGoal) throw new "We couldn't find a location called FAST_TRACK";

      this.goTo = new GoTo(self.index, myGoal.position);

      this.tree = builder
      
      // REPEAT
      .sequence("Janitorial")
        .splice(this.goTo.tree) //FAST_TRACK type
        .splice(new WaitForever().tree)  
      .end()
      .build();
    }
  
    async update(agents, crowd, msec) {
      this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ agents, crowd, msec }) //Call the behavior tree
      return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }

export default janitorial;
  