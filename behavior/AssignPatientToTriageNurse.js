import Vector3 from "./Vector3.js";

class AssignPatientToTriageNurse {

  constructor(myIndex) {
    this.index = myIndex;
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    //let me = agent;

    this.tree = builder
      .sequence("Assign Patient To Triage Nurse")
        .do("Assign Patient", (t) => {
          let agent = t.agents.find(a => a.id == self.index);
          let simulationAgent = t.crowd.find(a => a.id == self.index);
          let myLocation = new Vector3(simulationAgent.x, simulationAgent.y, simulationAgent.z);
          
          /*
          List<IPerson> people = hospital.activePeople;
          IMedician closestTriageNurse = (IMedician) people.stream()
              .filter(i->i instanceof IMedician 
                  && ((IMedician)i).getMedicianType() == MedicianClass.NURSE 
                  && ((IMedician)i).getDoctorType() == MedicianSubclass.TRIAGE_NURSE 
                  &&((IMedician)i).getCurrentPatient() == null)
              .sorted((a,b)->(int)(a.getLocation().distanceTo(myLocation) - b.getLocation().distanceTo(myLocation)))
              .findFirst()
              .orElse(null);
          if(closestTriageNurse == null || closestTriageNurse.getLocation().distanceTo(myLocation) > 3)
            return Status.RUNNING; //No triage nurse is available or close enough
          */

          myPatient = me.CurrentPatient;
          closestTriageNurse.CurrentPatient(myPatient);
          myPatient.Instructor(closestTriageNurse);
          myPatient.PatientTempState("FOLLOWING");
          me.CurrentPatient(null);
          //hospital.addComment(me, myPatient, "Follow that nurse.");

          return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      .end()
      .build();
  }

  async update(agents, positions, msec) {
    await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
  }

}

export default AssignPatientToTriageNurse;