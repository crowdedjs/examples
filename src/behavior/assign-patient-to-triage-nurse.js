import PatientTempState from "../support/patient-temp-state.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree";
import FollowInstructions from "../behavior/follow-instructions.js";


class AssignPatientToTriageNurse {

  constructor(myIndex) {
    this.index = myIndex;
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;

    this.tree = builder
      .sequence("Assign Patient To Triage Nurse")
        .do("Assign Patient", (t) => {
          let agent = Hospital.agents.find(a => a.id == self.index);
          let simulationAgent = t.crowd.find(a => a.id == self.index);
          let myLocation = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
          
          /*
          List<IPerson> people = hospital.activePeople;
          IMedicalStaff closestTriageNurse = (IMedicalStaff) people.stream()
              .filter(i->i instanceof IMedicalStaff 
                  && ((IMedicalStaff)i).getMedicalStaffType() == MedicalStaffClass.NURSE 
                  && ((IMedicalStaff)i).getDoctorType() == MedicalStaffSubclass.TRIAGE_NURSE 
                  &&((IMedicalStaff)i).getCurrentPatient() == null)
              .sorted((a,b)->(int)(a.getLocation().distanceTo(myLocation) - b.getLocation().distanceTo(myLocation)))
              .findFirst()
              .orElse(null);
          if(closestTriageNurse == null || closestTriageNurse.getLocation().distanceTo(myLocation) > 3)
            return Status.RUNNING; //No triage nurse is available or close enough
          */
         let closestTriageNurses = Hospital.agents.filter(a=>a.medicalStaffType == "Nurse" && a.medicalStaffSubclass == "Triage Nurse" && a.getCurrentPatient() == null && a.inSimulation == true);

         
          // DISTANCETO NOT WORKING NOW FOR SOME REASON???
          //let closestTriageNursesSorted = closestTriageNurses.sort((a,b)=>Vector3.subtract(a.location, myLocation).length() - Vector3.subtract(b.location, myLocation).length());
          let closestTriageNursesSorted = closestTriageNurses.sort((a,b)=>Vector3.subtract(a.location, myLocation).lengthSquared() - Vector3.subtract(b.location, myLocation).lengthSquared());

          //let closestTriageNursesSorted = closestTriageNurses.sort((a,b)=>a.location.distanceTo(myLocation) - b.location.distanceTo(myLocation));
          let closestTriageNurse = closestTriageNursesSorted[0];

          if(closestTriageNurse == null) {
            return fluentBehaviorTree.BehaviorTreeStatus.Failure;
          }

          //let myPatient = me().getCurrentPatient();
          let myPatient = me().triageList[0];

          // This should work for multiple triage nurses as long as inactive triage nurses wait at TriageNursePlace
          if (closestTriageNurse.getBusy() || myPatient.getPermanentRoom() == null || myPatient.getInstructor() != me())
          {
            
            // TELL THE PATIENT TO GO TO THE WAITING ROOM
            //Hospital.patientToDoList.push(new GoToLazy(myPatient.id, () => Hospital.locations.find(l=> l.name == "Waiting Room").location).tree);
            Hospital.patientToDoList.push(0);

            return fluentBehaviorTree.BehaviorTreeStatus.Failure;
          }
          else
          {
            closestTriageNurse.setCurrentPatient(myPatient);
            myPatient.setInstructor(closestTriageNurse);
            myPatient.setPatientTempState(PatientTempState.FOLLOWING);
            me().setCurrentPatient(null);

            if (me().triageList[me().triageList.length - 1] == myPatient) {
              me().triageList.pop();
            }
            else if (me().triageList[0] == myPatient) {
              me().triageList.shift();
            }
            //hospital.addComment(me, myPatient, "Follow that nurse.");

            // TELL THE PATIENT TO FOLLOW INSTRUCTIONS
            //Hospital.patientToDoList.push(new FollowInstructions(myPatient.id).tree);
            Hospital.patientToDoList.push(1);

            return fluentBehaviorTree.BehaviorTreeStatus.Success;
          }
      })
      .end()
      .build();
  }


}

export default AssignPatientToTriageNurse;