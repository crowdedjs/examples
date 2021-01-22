import ResponsibilitySubject from "../support/responsibility/ResponsibilitySubject.js"

class GoToResponsibility {

  constructor(myIndex, start) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    this.tree = builder
      .sequence("Go To Responsibility")
      //Set the destination. This is a one-shot behavior since we only want to
      //update the return value once
      .do("Go to responsibility", (t) => {
        let responsibility = me().getResponsibility();

        if (me().getResponsibility().getSubject() == ResponsibilitySubject.COMPUTER)
        return fluentBehaviorTree.BehaviorTreeStatus.Success;

        let destination = responsibility.getEntry().patient.getAssignedRoom().getLocation();

        me().setDestination(destination);

        let distance = me.getLocation().distanceTo(destination);
        if (distance < 1) {
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        }
        return fluentBehaviorTree.BehaviorTreeStatus.Running;
      })
      .end()
      .build();
  }
}

export default GoToResponsibility;