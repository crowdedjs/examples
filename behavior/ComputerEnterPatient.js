
import Hospital from "../support/Hospital.js"
import ComputerEntry from "../support/ComputerEntry.js"

class ComputerEnterPatient {
    constructor(myIndex, agentConstants, locations) {
        this.index = myIndex;
        let self = this;
        let me= ()=>agentConstants.find(a=>a.id == myIndex);;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Computer Enter Patient")
                .do("Enter Patient", (t) => {
                    let patient = me().CurrentPatient;
                    let entry = new ComputerEntry(patient, "Unknown")
                    
                    // need "this" ?
                    Hospital.computer.add(entry);
                    Hospital.computer.print();

                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }
    async update(agents, positions, msec) {
        await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
    }

}

export default ComputerEnterPatient;