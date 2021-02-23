class Hospital{

  static agentConstants;
  static locations;
  static computer;
  static comments = [];
  static CTQueue = [];
  static activePeople = [];

  static CTOccupied = false;

  static getFPS(){return 60;}

  static getCTQueue()
  {
    return Hospital.CTQueue;
  }
  static setCTQueue(queue){
    Hospital.CTQueue = queue;
  }

  

  static isCTOccupied(){
    return Hospital.CTOccupied;
  }
  static setCTOccupied(occupied){
    Hospital.CTOccupied = occupied;
  }

  static getLocationByName(name){
    return this.locations.find(i=>i.getName() == name);

  }

  

}

export default Hospital;
