// not fully ported
import GoTo from "../behavior/GoTo.js"
import WaitForever from "../tasks/WaitForever.js"


class greeterNurse {

    constructor(agent, myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me = agent;
      let myGoal = me.locations.find(l => l.name == "Check In");
      if (!myGoal) throw new "We couldn't find a location called B_DESK";
  
      //this.goTo = new GoTo(self.index, myGoal.position);
  
  
  
      this.tree = builder
        .sequence("Greeter Nurse Behaviors")
            .splice(new GoTo(self.index, myGoal.position).tree)
            .splice(new WaitForever().tree)
            //.do("Wait Forever", (t) => new WaitForever(agent).execute())

            
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

export default greeterNurse;