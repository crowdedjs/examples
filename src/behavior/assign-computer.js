import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class AssignComputer {
    
      constructor(myIndex, room) {
        this.index = myIndex;
        this.room = room;
    
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
    
        this.tree = builder
          .sequence("Assign Computer")
          //Set the computer. This is a one-shot behavior since we only want to
          //update the return value once
            .do("Set Computer Location", (t) => {
              let agent = Hospital.agents.find(a => a.id == myIndex);

              agent.Computer =  Vector3.fromObject(this.room)

              return fluentBehaviorTree.BehaviorTreeStatus.Success;
          })
          .end()
          .build();
        }

}

export default AssignComputer;