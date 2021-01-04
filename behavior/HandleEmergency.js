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
    
      async update(agents, positions, msec) {
        await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
      }
    
    }
    
    export default HandleEmergency;
