// not fully ported

class greeterNurse {

    constructor(myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
  
      this.tree = builder
        .sequence("Greeter Nurse Behaviors")
    
            .do("Go to a Room", (t) => {
                // room type CHECK_IN
            })
            .do("Look for Arriving Patient", (t) => {

            })
            .do("Take Time", (t) => {
                // seconds: uniform, 30, 90
            })
            .do("Computer Enter Patient", (t) => {

            })
            .do("Take Time", (t) => {
                // seconds: uniform, 30, 60
            })
            .do("Computer Score Patient", (t) => {

            })
            .do("Take Time", (t) => {
                // seconds: uniform, 30, 60
            })
            .do("Computer Assign Patient Room", (t) => {

            })
            .do("Assign Patient to Triage Nurse", (t) => {

            })
            .do("Wait Forever", (t) => new WaitForever().execute())
                    
        .end()
        .build();
    }
  
    async update(agents, crowd, msec) {
      this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ agents, crowd, msec }) //Call the behavior tree
      return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }