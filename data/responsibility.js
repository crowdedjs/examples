// NOT FULLY PORTED
import GetComputerResponsibility from "../behavior/GetComputerResponsibility.js";
import GetResponsibility from "../behavior/GetResponsibility.js";
import GoTo from "../behavior/GoTo.js";
import GoToLazy from "../behavior/GoToLazy.js";
import HandleResponsibility from "../behavior/HandleResponsibility.js";
import Vector3 from "../behavior/Vector3.js";

class responsibility {

    constructor(myIndex, agentConstants, locations, start, end) {
        this.index = myIndex;
        this.waypoints = [];
        this.waypoints.push(start);
        this.waypoints.push(end);

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        this.toReturn = null;

        let self = this;//Since we need to reference this in anonymous functions, we need a reference

        //   let me = agent;
        //let me = agentConstants.find(a=>a.id==self.index);
        let me = () => agentConstants.find(a => a.id == myIndex);

        //let myGoal = me.Computer;
        //this.goTo = new GoTo(self.index, myGoal.position);

        this.tree = builder
            .sequence("Responsibility")


                // MAKE OWN FILE IF SHOWS UP ANYWHERE ELSE
                .do("getRooms", (t) => {
                    let agent = t.agentConstants.find(a => a.id == myIndex);
                    agent.addRoom(locations.find(l => l.name == "C1"));
                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
                })
                // MAKE OWN FILE IF SHOWS UP ANYWHERE ELSE
                .do("getComputer", (t) => {
                    // Not sure if medician subclass is implemented
                    switch (me().MedicianSubclass) {
                        case "Tech":
                            me.Computer = locations.find(l => l.name == "TechPlace");
                            break;
                        case "Nurse":
                            me.Computer=locations.find(l => l.name == "NursePlace");
                            break;
                        case "Resident":
                            me.Computer=locations.find(l => l.name == "ResidentStart");
                            break;
                    }

                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
                })

                // REPEAT
                //.sequence("Computer Operations")
                //.splice(new GoToLazy(self.index, me=>me.Computer).tree) // GO TO COMPUTER
                .splice(new GoToLazy(self.index, () => me().Computer).tree)// GO TO COMPUTER

                //.selector("Emergency")
                //.do("Handle Emergency", (t) => { return fluentBehaviorTree.BehaviorTreeStatus.Failure; }) // PLACEHOLDER
                //.inverter("")
                //.sequence("Computer Stuff")
                //.splice(new GoToLazy(self.index, () => me().Computer).tree) // GO TO COMPUTER

                //NOT FINISHED
                .splice(new GetComputerResponsibility().tree)
                //NOT FINISHED
                .splice(new HandleResponsibility().tree)


                //.end()
                //.end()
                //.inverter("")
                //.sequence("Handle Responsibility")
                .splice(new GoToLazy(self.index, () => me().Computer).tree) // GO TO COMPUTER

                //NOT FINISHED
                .splice(new GetResponsibility().tree)

                .do("Go To Responsibility", (t) => {
                    //WRITE THIS BEHAVIOR
                    throw new Exception("Not implemented)")
                })
                .do("Wait For Responsibility Patient", (t) => {
                    //WRITE THIS BEHAVIOR            
                    throw new Exception("Not implemented)")
                })
                .do("Set Up Transport", (t) => {
                    //WRITE THIS BEHAVIOR    
                    throw new Exception("Not implemented)")
                })
                //NOT FINISHED
                .splice(new HandleResponsibility().tree)

                // UNTIL FAIL?
                .sequence("Reassess Responsibility")
                .do("Reassess", (t) => {
                    //WRITE THIS BEHAVIOR
                    throw new Exception("Not implemented)")
                })
                //NOT FINISHED
                .splice(new HandleResponsibility().tree)
                //.end()
                //.end()
                .do("Do Nothing", (t) => {
                    // return running?
                    // behavior runs once and succeeds, and if called again, returns running
                })

                //.end()
                //.end()

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