import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class AssignPatientToCTQueue {
  constructor(myIndex, bed) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me = () => Hospital.agents.find(a => a.id == myIndex);;

    this.tree = builder
      .sequence("Assign Patient To CT Queue")
      .do("Assign Patient", (t) => {
        
        let myPatient = me().getCurrentPatient();
        Hospital.getCTQueue().add(myPatient);
        console.log(Hospital.getCTQueue());
        
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      .end()
      .build();
  }

}

export default AssignPatientToCTQueue;