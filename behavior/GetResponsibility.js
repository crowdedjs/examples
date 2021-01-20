// NEEDS WORK

class GetResponsibility {
    constructor(myIndex, agentConstants, locations) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me= ()=>agentConstants.find(a=>a.id == myIndex);;

        this.tree = builder
            .sequence("Get Responsibility")
                .do("Check Responsibilities", (t) => {
                    //Computer computer = HospitalModel.get().computer;
                    //get computer

                    //go through computer entries and find highest priority task
                    // requires looking thru responsibilities to get priority?
                    
                    if (this.responsibility == null) {
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                    }

                    //HospitalModel.get().addComment(me, null, "!! " + responsibility.getName());

                    me.Responsibility(responsibility);

                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
                })
            .end()
            .build();
    }

        async update(agents, positions, msec) {
            await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
        }
}

export default GetResponsibility;