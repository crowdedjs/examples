import Vector3 from "./Vector3.js";

class Stop {
    constructor(myIndex) {
        this.index = myIndex;
        let self = this;
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Stop")
                .do("Stop", (t) => {
                    let agent = Hospital.agents.find(a => a.id == self.index);
                    let simulationAgent = t.crowd.find(a => a.id == self.index);
                    let loc = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
                    agent.destination = new Vector3(loc.x, loc.y, loc.z);

                    console.log("Stopped");
                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }
    async update(agents, positions, msec) {
        await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
    }

}

export default Stop;