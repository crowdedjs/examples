import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class HandleEmergency {
    constructor() {
               
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        
        this.tree = builder
          .sequence("Handle Emergency")
            .do("Return failure", (t) => {
                return fluentBehaviorTree.BehaviorTreeStatus.Failure;
          })
          
          .end()
          .build();
      }
    
    
    }
    
    export default HandleEmergency;