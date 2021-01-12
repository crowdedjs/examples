import Vector3 from "../behavior/Vector3.js";
import Poses from "../models/Poses.js"

class WaitForever {
    constructor(index) {
        //this.agent = agent;
        this.index = index;
        let self = this;
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Wait Forever")
            .do("Wait Forever", (t) => {
                let agent = t.agentConstants.find(a => a.id == self.index);
                let simulationAgent = t.crowd.find(a => a.id == self.index);
                let loc = new Vector3(simulationAgent.x, simulationAgent.y, simulationAgent.z);
                agent.destination = new Vector3(loc.x, loc.y, loc.z);
                simulationAgent.pose = "Idle";


                return fluentBehaviorTree.BehaviorTreeStatus.Running;
            })
            .end()
            .build();
    }
    async update(agent, agentConstants, frame, msec) {
        await this.tree.tick({ agentConstants, frame, msec }) //Call the behavior tree
    }

}

export default WaitForever;