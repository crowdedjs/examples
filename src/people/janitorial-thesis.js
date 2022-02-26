import GoTo from "../behavior/go-to.js"
import GoToLazy from "../behavior/go-to-lazy.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import LocationStatus from "../support/location-status.js";
import task from "../support/task-thesis.js";
import TakeTime from "../behavior/take-time.js";

class janitorialThesis {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "Fast Track 1";
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    let myGoal = Hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);
    let entrance = Hospital.getLocationByName("Main Entrance");

    let myRoom;

    this.tree = builder
      
      .sequence("Janitor Behaviors")
        .splice(new GoTo(self.index, myGoal.location).tree)
        .selector("Task List Tasks")
          .do("Get a Task", (t) => {
              // CHECK IF NEEDED TO CLOCK IN
              if (!me().onTheClock) {
                  me().onTheClock = true;
                  Hospital.activeJanitor.push(me());
                  return fluentBehaviorTree.BehaviorTreeStatus.Success;
              }
              // CHECK IF NEEDED TO CLOCK OUT
              else if (Hospital.activeJanitor.length > 1 && Hospital.activeJanitor[0] == me()) {
                  let clockOutTask = new task("Clock Out", null, null, null, entrance);
                  me().setTask(clockOutTask);
                  me().replacement = true;
                  return fluentBehaviorTree.BehaviorTreeStatus.Failure;
              }
              // IF ALREADY ALLOCATED A TASK, CONTINUE
              else if (me().getTask() != null) {
                  return fluentBehaviorTree.BehaviorTreeStatus.Failure;
              }
              // CHECK IF ANY TASKS ARE AVAILABLE, CONTINUE
              else if (Hospital.janitorTaskList.length != 0) {
                  me().setTask(Hospital.janitorTaskList.shift());
                  return fluentBehaviorTree.BehaviorTreeStatus.Failure;
              }
              // OTHERWISE DON'T PROCEED (SUCCESS WILL RESTART SELECTOR)
              else {
                  return fluentBehaviorTree.BehaviorTreeStatus.Success;
              }
          })
          // I think it has to be done this way because you can't do operations in a splice for the most part
          .inverter("Need to return failure")
              .sequence("Go to Task")
                  .do("Determine Location", (t) => {
                      if (me().getTask().location != null) {
                          myGoal = me().getTask().location;
                      }
                      else {
                          myGoal = Hospital.locations.find(l => l.name == goToName);
                      }
                      return fluentBehaviorTree.BehaviorTreeStatus.Success; 
                  })
                  // GoTo gives me problems sometimes that GoToLazy does not
                  .splice(new GoToLazy(self.index, () => myGoal.location).tree)
              .end()
          .end()

          .do("Clock Out", (t) => {
              if (me().getTask().taskID != "Clock Out") {
                return fluentBehaviorTree.BehaviorTreeStatus.Failure;
              }
              else {
                Hospital.activeJanitor.shift();
                me().inSimulation = false;
                return fluentBehaviorTree.BehaviorTreeStatus.Success;
              }
          })                             
        
          // THIS TASK IS GIVEN BY THE PATIENT FOLLOW INSTRUCTIONS
          .do("Sanitize", (t) => {
            if (me().getTask().taskID != "Sanitize") {
              return fluentBehaviorTree.BehaviorTreeStatus.Failure;
            }
            else {
              myRoom = me().getTask().location;
              myRoom.setLocationStatus(LocationStatus.NONE);
              me().taskTime = 100;
              me().setTask(null);
              return fluentBehaviorTree.BehaviorTreeStatus.Success;
            }  
          })
        .end()
        // IF SUCCEEDING IN TASK, TAKE TIME TO DO THAT TASK
        // TakeTime doesn't work in some instances, but the code itself works. For instance if you remove the next .end(), it will work, but then the sequence is broken.
        //.splice(new TakeTime(1000, 2000).tree)
        .do("Take Time", (t) => {
          while (me().taskTime > 0)
          {
              me().taskTime == me().taskTime--;
              return fluentBehaviorTree.BehaviorTreeStatus.Running;
          }

          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        })
        
      //   .do("Clock Out", (t) => {
      //     if (!me().replacement) {
      //       return fluentBehaviorTree.BehaviorTreeStatus.Failure;
      //     }
      //     else {
      //       //Hospital.activeJanitor.shift();
      //       me().inSimulation = false;
      //       return fluentBehaviorTree.BehaviorTreeStatus.Running;
      //     }
      //   }) 
      .end()
      .build();
  }

  async update( crowd, msec) {
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
  }

}

export default janitorialThesis;
