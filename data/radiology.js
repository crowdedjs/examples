// NOT FULLY PORTED

class radiology {

    constructor(myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
  
      this.tree = builder
        // how to set to repeat?
      .sequence("Go and Idle")
            .do("Go to Room", (t) => {
                
            })
           
            .do("Wait Forever", (t) => new WaitForever(myIndex).execute())
            
        .end()
        .build();
    }
  
    async update(agentConstants, crowd, msec) {
      this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
      return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }
  