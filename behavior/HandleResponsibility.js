import Hospital from "../support/Hospital.js"

class HandleResponsibility {
    constructor(myIndex, agentConstants, locations) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me= ()=>agentConstants.find(a=>a.id == myIndex);;

        this.tree = builder
            .sequence("Handle Responsibility")
                .do("Do Work", (t) => {
		
                    let responsibility = me().Responsibility;
                    
                    let timeElapsed = 1.0/Hospital.getFPS();
                    
                    if(!responsibility.isStarted()) {
                        //HospitalModel.get().addComment(me, null, "Go " + responsibility.Name;
                        
                    }
                    
                    responsibility.doWork(timeElapsed);
                    
                    if(responsibility.isDone()) {
                        //me.removeResponsibility();
                        //HospitalModel.get().addComment(me, null, "Done " + responsibility.getName());
                        
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
		
                    return fluentBehaviorTree.BehaviorTreeStatus.Running;
                })
            .end()
            .build();
    }

        async update(agents, positions, msec) {
            await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
        }

}

export default HandleResponsibility;