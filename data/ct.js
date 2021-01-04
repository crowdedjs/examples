import AssignComputer from "../behavior/AssignComputer.js";
import responsibility from "./responsibility.js";

class ct {

    constructor(agent, myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
  
      this.tree = builder
        .sequence("Tech Tree")
          .splice(new AssignComputer().tree) // name CT 1
          .splice(new responsibility().tree) // lazy: true
        
        .end()
        .build();
    }
  
    async update(agents, crowd, msec) {
      this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ agents, crowd, msec }) //Call the behavior tree
      return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }

export default ct;