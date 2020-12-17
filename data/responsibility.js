// NOT FULLY PORTED

import GoTo from "../behavior/GoTo.js";

class responsibility {

    constructor(myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
  
      let me = agent;
      let myGoal = me.Computer;
      this.goTo = new GoTo(self.index, myGoal.position);

      this.tree = builder
      .sequence("Responsibility")
        
        .do("getRooms", (t) => {
            // Java behavior doesn't seem like it does much?
        })
        .do("getComputer", (t) => {
            // WRITE THIS BEHAVIOR, MIGHT AFFECT THE GO TO IN HERE
        })

        // REPEAT
            .sequence("Computer Operations")
                .splice(this.goTo.tree) // GO TO COMPUTER
            
                .selector("Emergency")
                    .do("Handle Emergency", (t) => { return fluentBehaviorTree.BehaviorTreeStatus.Failure; }) // PLACEHOLDER
                    //.inverter("")
                    .sequence("Computer Stuff")
                        .splice(this.goTo.tree) // GO TO COMPUTER
                        
                        .do("Get Computer Responsibility", (t) => {
                            // What does this do in the Java code?
                        })
                        .do("Handle Responsibility", (t) => {
                            //WRITE THIS BEHAVIOR
                        })

                    .end()
                    //.end()
                    //.inverter("")
                    .sequence("Handle Responsibility")
                        .splice(this.goTo.tree) // GO TO COMPUTER

                        .do("Get Responsibility", (t) => {
                            //WRITE THIS BEHAVIOR
                        })
                        .do("Go To Responsibility", (t) => {
                            //WRITE THIS BEHAVIOR
                        })
                        .do("Wait For Responsibility Patient", (t) => {
                            //WRITE THIS BEHAVIOR            
                        })
                        .do("Set Up Transport", (t) => {
                            //WRITE THIS BEHAVIOR            
                        })
                        .do("Handle Responsibility", (t) => {
                            //WRITE THIS BEHAVIOR            
                        })
                        // UNTIL FAIL?
                        .sequence("Reassess Responsibility")
                            .do("Reassess", (t) => {
                                //WRITE THIS BEHAVIOR
                            })
                            .do("Handle Responsibility", (t) => {
                                //WRITE THIS BEHAVIOR
                            })
                        .end()
                    //.end()
                    .do("Do Nothing", (t) => {
                        // return running?
                        // behavior runs once and succeeds, and if called again, returns running
                    })

                .end()
            .end()

        .end()
        .build();
    }
  
    async update(agents, crowd, msec) {
      this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ agents, crowd, msec }) //Call the behavior tree
      return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }

export default responsibility;
  