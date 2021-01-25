import ATransportResponsibility from "./atransport.js"

class TechCATPickupResponsibility extends ATransportResponsibility {


  constructor(entry, medician) {
    super("Tech CAT Pickup Responsibility", entry, medician, entry.getBed());
  }

  doFinish() {
    entry.acknowledge(ACK.CT_PICKUP);
  }
}

export default TechCATPickupResponsibility;