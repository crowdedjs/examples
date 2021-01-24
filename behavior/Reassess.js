import Vector3 from "./Vector3.js";

class GoTo {

  constructor(myIndex, start) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    this.tree = builder
      .sequence("Reassess")
      //Set the destination. This is a one-shot behavior since we only want to
      //update the return value once
      .do("Reassess", t=>{
        let computer  = me().Computer;
        let patient = me().CurrentPatient;
        let entry = computer.getEntry(patient);
        let responsibility = null;
        if(entry != null)
          responsibility = ResponsibilityFactory.get(me().MedicianSubclass()).get(entry, me())
      })
     
      .end()
      .build();
  }


}

export default GoTo;
