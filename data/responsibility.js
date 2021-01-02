// NOT FULLY PORTED

class responsibility {

    constructor(myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
  
      this.tree = builder
      .sequence("Responsibility")
        .do("getRooms", (t) => {
                
        })
        .do("getComputer", (t) => {
                
        })        
        // how to repeat without repeater?
            .sequence("Computer Operations")
                .do("Go To Computer", (t) => {
                    
                })
                .selector("Emergency")
                    .do("Handle Emergency", (t) => new HandleEmergency().execute())
                    .inverter("")
                        // repeat until fail???
                            .sequence("Computer Stuff")
                                .do("Go To Computer", (t) => {
                    
                                })
                                .do("Get Computer Responsibility", (t) => {
                    
                                })
                                .do("Handle Responsibility", (t) => {
                    
                                })
                            .end()
                    .end()
                    .inverter("")
                        // repeat until fail???
                            .sequence("Handle Responsibility")
                                .do("Go To Computer", (t) => {
                                    
                                })
                                .do("Get Responsibility", (t) => {
                    
                                })
                                .do("Go To Responsibility", (t) => {
                    
                                })
                                .do("Wait For Responsibility Patient", (t) => {
                    
                                })
                                .do("Set Up Transport", (t) => {
                    
                                })
                                .do("Handle Responsibility", (t) => {
                    
                                })
                                // repeat until fail???
                                    .sequence("Reassess Responsibility")
                                        .do("Reassess", (t) => {
                    
                                        })
                                        .do("Handle Responsibility", (t) => {
                    
                                        })
                                    .end()
                    .end()
                .end()
            .end()

        .end()
        .build();
    }
  
    async update(agentConstants, crowd, msec) {
      this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
      return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }
  