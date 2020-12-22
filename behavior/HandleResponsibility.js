// NEEDS WORK

class HandleResponsibility {
    constructor(myIndex, start, end) {
        this.index = myIndex;
        this.waypoints = [];
        this.waypoints.push(start);
        this.waypoints.push(end);

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me = agent;

        this.tree = builder
            .sequence("Handle Responsibility")
                .do("Do Work", (t) => {
		
                    responsibility = me.Responsibility;
                    
                    //timeElapsed = 1.0f/(float)HospitalModel.get().getFPS();
                    
                    if(!responsibility.isStarted()) {
                        //HospitalModel.get().addComment(me, null, "Go " + responsibility.Name;
                        
                    }
                    
                    //responsibility.doWork(timeElapsed);
                    
                    if(responsibility.isDone()) {
                        //me.removeResponsibility();
                        //HospitalModel.get().addComment(me, null, "Done " + responsibility.getName());
                        
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
		
                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
                })
            .end()
            .build();
    }

        async update(agents, positions, msec) {
            await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
        }

}

export default HandleResponsibility;