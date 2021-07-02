import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class ComputerScorePatient {

  constructor(myIndex) {
    this.index = myIndex;
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;

    this.tree = builder
      .sequence("Computer Score Patient")
        .do("Score Patient", (t) => {
            //let patient = me().getCurrentPatient();
            //let patient = me().PatientList[0];
            //let entry = Hospital.computer.getEntry(patient);

            // get rooms C_ROOM
            // if you get back LocationStatus.NONE then return Running
            /*List<IRoom> cRooms = HospitalModel.get().getLocations(RoomType.C_ROOM);
            if(!cRooms.stream().anyMatch(i->i.getLocationStatus() == LocationStatus.NONE))
                return Status.RUNNING;//They are all occupied, so we have to wait.
            IRoom chosenRoom = cRooms.stream().filter(i->i.getLocationStatus()==LocationStatus.NONE).findFirst().get();
            */
           
            //entry.es = 3;

            //
            //
            //

            // for(let i = 0; i < me().PatientList.length; i++) {
            //   let patient = me().PatientList[i];
            //   let entry = Hospital.computer.getEntry(patient);
            //   if (entry.es == null) {
            //     entry.es = 3;
            //   }
            // }

            let patient = me().PatientList[0];
            let entry = Hospital.computer.getEntry(patient);
            if (entry.es == null) {
              entry.es = 3;
            }

            return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      .end()
      .build();
  }


}

export default ComputerScorePatient;