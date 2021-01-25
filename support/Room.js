import LocationStatus from "./location-status.js"

class Room {

	constructor(location, roomType, name) {
    this.name = name;
    this.location = location;
    this.roomType = roomType;
    this.locationStatus = LocationStatus.NONE;
    this.locationStatusOwner = null;		
	}

	

}

export default Room;