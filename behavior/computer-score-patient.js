class ComputerScorePatient {

  constructor(myIndex, locations) {
    this.index = myIndex;
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;

    this.tree = builder
      .sequence("Computer Score Patient")
        .do("Score Patient", (t) => {
            let patient = me().CurrentPatient;
            let entry = Hospital.computer.getEntry(patient);

            // get rooms C_ROOM
            // if you get back LocationStatus.NONE then return Running
            /*List<IRoom> cRooms = HospitalModel.get().getLocations(RoomType.C_ROOM);
            if(!cRooms.stream().anyMatch(i->i.getLocationStatus() == LocationStatus.NONE))
                return Status.RUNNING;//They are all occupied, so we have to wait.
            IRoom chosenRoom = cRooms.stream().filter(i->i.getLocationStatus()==LocationStatus.NONE).findFirst().get();
            */
           
            entry.es = 3;

            return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      .end()
      .build();
  }


}

export default ComputerScorePatient;