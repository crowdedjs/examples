// NOT FULLY PORTED

class patient {

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
      .sequence("Patient Actions")
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
  