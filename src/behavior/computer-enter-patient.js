
import ComputerEntry from "../support/computer-entry.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"


class ComputerEnterPatient {
    constructor(myIndex) {
        this.index = myIndex;
        let self = this;
        let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Computer Enter Patient")
                .do("Enter Patient", (t) => {
                    //let patient = me().getCurrentPatient();
                    //let patient = me().PatientList[0];
                    // let entry = new ComputerEntry(patient, "Unknown", "Not Taken", "Waiting");
                    //let entry = new ComputerEntry(patient, "Unknown");

                    //Hospital.computer.add(entry);
                    //Hospital.computer.print();

                    //
                    //
                    //

                    // for(let i = 0; i < me().PatientList.length; i++) {
                    //     if (Hospital.computer.getEntry(me().PatientList[i]) == null) {
                    //         let patient = me().PatientList[i];
                    //         let entry = new ComputerEntry(patient, "Unknown");
                    //         Hospital.computer.add(entry);
                    //     }
                    // }

                    if (Hospital.computer.getEntry(me().PatientList[0]) == null) {
                        let patient = me().PatientList[0];
                        let entry = new ComputerEntry(patient, "Unknown");
                        Hospital.computer.add(entry);
                        
                        if (patient.emergencyQueue == false && patient.getSeverity() == "ESI1") {
                            Hospital.emergencyQueue.push(patient);
                            patient.emergencyQueue = true;
                        }
                    }
                    
                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }

}

export default ComputerEnterPatient;