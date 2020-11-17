// not fully ported
import GoTo from "../behavior/GoTo.js"

class attending {

    constructor(agent, myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
  
      let me = agent;
      let myGoal = me.locations.find(l=>l.name == "B Desk");
      if(!myGoal) throw new "We couldn't find a location called B_DESK";
      
      // let goTo = new GoTo(self.index, myGoal.position);

      // let subTree = builder.sequence("Go To Sequence")
      //   .do("Go To", goTo)
      //   .end()
      //   .build();

        this.goTo = new GoTo(self.index, myGoal.position);


      this.tree = builder
        .sequence("Attending Tree")
          .splice(this.goTo.tree)
          
    
            // .do("Go To A Room", (t) => {
             
              

            //   //let goTo = new GoTo(self.index, myGoal.position);
            //   //return goTo.do(t);
            //     // roomType B_DESK
            // })
            .do("Wait Forever", (t) => new WaitForever().execute())

        .end()
        .build();
    }
  
    async update(agents, crowd, msec) {
      this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ agents, crowd, msec }) //Call the behavior tree
      if(this.goTo.toReturn != null)
        return this.goTo.toReturn;
      return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }

  export default attending;