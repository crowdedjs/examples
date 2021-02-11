
import ComputerEntry from "../support/computer-entry.js"

class ComputerEnterPatient {
    constructor(myIndex, locations) {
        this.index = myIndex;
        let self = this;
        let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Computer Enter Patient")
                .do("Enter Patient", (t) => {
                    let patient = me().getCurrentPatient();
                    let entry = new ComputerEntry(patient, "Unknown")
                    
                    Hospital.computer.add(entry);
                    //Hospital.computer.print();

                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }

}

export default ComputerEnterPatient;