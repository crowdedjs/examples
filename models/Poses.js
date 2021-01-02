class Poses {
  
  static poseList = [
    { key: "MaleSittingPose", file: "Male Sitting Pose" },
    { key: "Idle", file: "Idle" },
    { key: "SitToStand", file: "Sit To Stand" },
    { key: "SittingIdle", file: "Sitting Idle" },
    { key: "Sitting", file: "Sitting" },
    { key: "StandToSit", file: "Stand To Sit" },
    { key: "StartWalking", file:"Start Walking"},
    { key: "TypeToSit", file: "Type To Sit" },
    { key: "Typing", file: "Typing" },
    { key: "Walking", file: "Walking" },
  ]

  
  static get(poseKey){
    return this.poseList(p=>p.key == poseKey);
  }
}

export default Poses;