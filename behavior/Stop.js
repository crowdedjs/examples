import Vector3 from "./Vector3.js";

class Stop {
    constructor() {
        this.index = myIndex;
        let self = this;
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Stop")
                .do("Stop", (t) => {
                    let agent = t.agents.find(a => a.id == self.index);
                    let simulationAgent = t.crowd.find(a => a.id == self.index);
                    let loc = new Vector3(simulationAgent.x, simulationAgent.y, simulationAgent.z);
                    agent.destination = new Vector3(loc.x, loc.y, loc.z);


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