// NOT FULLY PORTED

class triageNurse {

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
      .sequence("Pick Triage Room")
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
      await this.tree.tick({ agentConnstants, crowd, msec }) //Call the behavior tree
      return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }
  
