class Hospital{

  static agentConstants;
  static locations;
  static computer;
  static comments = [];
  static CTQueue = [];
  static activePeople = [];

  //static CTOccupied = false;
  static CT1Occupied = false;
  static CT2Occupied = false;

  // doctor = 0, resident = 1, nurse = 2, tech = 3, phlebotomist = 4, imaging = 5
  static aTeam = [];
  static emergencyQueue = [];

  static getFPS(){return 60;}

  static getCTQueue()
  {
    return Hospital.CTQueue;
  }
  static setCTQueue(queue){
    Hospital.CTQueue = queue;
  }

  

  // static isCTOccupied(){
  //   return Hospital.CTOccupied;
  // }
  // static setCTOccupied(occupied){
  //   Hospital.CTOccupied = occupied;
  // }
  static isCT1Occupied() {
    return Hospital.CT1Occupied;
  }
  static isCT2Occupied() {
    return Hospital.CT2Occupied;
  }
  static setCT1Occupied(occupied){
    Hospital.CT1Occupied = occupied;
  }
  static setCT2Occupied(occupied){
    Hospital.CT2Occupied = occupied;
  }

  static getLocationByName(name){
    return this.locations.find(i=>i.getName() == name);

  }

  

}

export default Hospital;
