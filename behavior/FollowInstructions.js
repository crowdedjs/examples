class FollowInstructions {
    constructor() {
        this.index = myIndex;
        let self = this;
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Follow Instructions")
                .do("Instructions", (t) => {
                    let agent = t.agents.find(a => a.id == self.index);
                    let state = agent.PatientTempState;
                    
                    if(state == "WAITING") {
                        // STOP
                        let simulationAgent = t.crowd.find(a => a.id == self.index);
                        let loc = new Vector3(simulationAgent.x, simulationAgent.y, simulationAgent.z);
                        agent.destination = new Vector3(loc.x, loc.y, loc.z);
                    }
                    else if (state == "FOLLOWING") {
                        let instructor = agent.Instructor;
                        let instructorLocation = instructor.Location;
                        
                        let simulationAgent = t.crowd.find(a => a.id == self.index);
                        let loc = new Vector3(simulationAgent.x, simulationAgent.y, simulationAgent.z);
                        
                        if (loc.distanceTo(instructorLocation) < 1) {
                            // STOP
                            agent.destination = new Vector3(loc.x, loc.y, loc.z);
                        }
                        else {
                            // goTo instructor 
                            // HOW TO SPLICE THIS IN HERE
                        }
                    }
                    else if (state == "GO_INTO_ROOM") {
                        // CHECK THIS LINE v
                        let destination = new Vector3(agent.AssignedRoom.Location);
                        if (destination.distanceTo(agent.Location) <  .5) {
                            agent.PatientTempState("WAITING");
                        }
                        else {
                            agent.Destination(destination);
                        }
                    }
                    else {
                        console.log("ERROR, Patient in an unknown patient state");
                    }

                    return fluentBehaviorTree.BehaviorTreeStatus.Running;
            })
            .end()
            .build();
    }
    async update(agents, positions, msec) {
        await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
    }

}

export default FollowInstructions;