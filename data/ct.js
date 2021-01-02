// not fully ported

class ct {

    constructor(myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
  
      this.tree = builder
        .sequence("Tech Tree")
    
            .do("Assign Computer", (t) => {
                // name CT 1
            })
            // include subtree responsibility lazy: true
            // .splice(new responsibility...)
        .end()
        .build();
    }
  
    async update(agentConstants, crowd, msec) {
      this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
      return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }