// NOT FULLY PORTED
import GetComputerResponsibility from "../behavior/GetComputerResponsibility.js";
import GetResponsibility from "../behavior/GetResponsibility.js";
import GoTo from "../behavior/GoTo.js";
import HandleResponsibility from "../behavior/HandleResponsibility.js";

class responsibility {

    constructor(agent, myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
  
      let me = agent;
      //let myGoal = me.Computer;
      //this.goTo = new GoTo(self.index, myGoal.position);

      this.tree = builder
      .sequence("Responsibility")
        
        // MAKE OWN FILE IF SHOWS UP ANYWHERE ELSE
        .do("getRooms", (t) => {
            me.addRoom(me.locations.find(l => l.name == "C1"));
            return fluentBehaviorTree.BehaviorTreeStatus.Success; 
        })
        // MAKE OWN FILE IF SHOWS UP ANYWHERE ELSE
        .do("getComputer", (t) => {
            // Not sure if medician subclass is implemented
            switch(me.getMedicianSubclass()) {
                case TECH:
                    me.Computer(me.locations.find(l => l.name == "TechPlace"));
                    break;
                case NURSE:
                    me.Computer(me.locations.find(l => l.name == "NursePlace"));
                    break;
                case RESIDENT:
                    me.Computer(me.locations.find(l => l.name == "ResidentStart"));
                    break;
                }

            return fluentBehaviorTree.BehaviorTreeStatus.Success;
        })

        // REPEAT
            .sequence("Computer Operations")
                .splice(new GoTo(self.index, me.Computer)) // GO TO COMPUTER
            
                .selector("Emergency")
                    .do("Handle Emergency", (t) => { return fluentBehaviorTree.BehaviorTreeStatus.Failure; }) // PLACEHOLDER
                    //.inverter("")
                    .sequence("Computer Stuff")
                        .splice(new GoTo(self.index, me.Computer)) // GO TO COMPUTER
                        
                        //NOT FINISHED
                        .splice(new GetComputerResponsibility().tree)
                        //NOT FINISHED
                        .splice(new HandleResponsibility().tree)


                    .end()
                    //.end()
                    //.inverter("")
                    .sequence("Handle Responsibility")
                        .splice(new GoTo(self.index, me.Computer)) // GO TO COMPUTER

                        //NOT FINISHED
                        .splice(new GetResponsibility().tree)

                        .do("Go To Responsibility", (t) => {
                            //WRITE THIS BEHAVIOR
                        })
                        .do("Wait For Responsibility Patient", (t) => {
                            //WRITE THIS BEHAVIOR            
                        })
                        .do("Set Up Transport", (t) => {
                            //WRITE THIS BEHAVIOR            
                        })
                        //NOT FINISHED
                        .splice(new HandleResponsibility().tree)

                        // UNTIL FAIL?
                        .sequence("Reassess Responsibility")
                            .do("Reassess", (t) => {
                                //WRITE THIS BEHAVIOR
                            })
                            //NOT FINISHED
                            .splice(new HandleResponsibility().tree)
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
  
    async update(agentConstants, crowd, msec) {
      //this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
      //return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }

export default responsibility;