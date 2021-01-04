import Vector3 from "./Vector3.js";

class LookForArrivingPatient {
    constructor(myIndex) {
        this.index = myIndex;
        let self = this;
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Check For Patients")
                .do("Find Closest Patient", (t) => {
                let agent = t.agents.find(a => a.id == self.index);
                let simulationAgent = t.crowd.find(a => a.id == self.index);
                let myLocation = new Vector3(simulationAgent.x, simulationAgent.y, simulationAgent.z);

                let closestPatient = null;
                               
                /*
                let closestPatient = (APatient) agents.stream()
                    .filter(i=>i instanceof APatient && ((APatient)i).getPatientTempState() == "ARRIVING")
                    .sort((a,b)=>(int)(a.getLocation().distanceTo(myLocation) - b.getLocation().distanceTo(myLocation)))
                    .findFirst()
                    .orElse(null);
                */


                if (closestPatient == null || closestPatient.getLocation().distanceTo(myLocation) > 1)
                    return fluentBehaviorTree.BehaviorTreeStatus.Running;
            
                closestPatient.setPatientTempState("WAITING");
                closestPatient.setInstructor(agent);
                agent.setCurrentPatient(closestPatient);
                //hospital.addComment(me, closestPatient, "Can I help you?");
                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            
            })
            .end()
            .build();
    }
    async update(agents, positions, msec) {
        await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
    }

}

export default LookForArrivingPatient;