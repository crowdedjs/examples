import AThing from "./athing.js"

class ARoom extends AThing {
    constructor(location, locationType, name) {
        super(location);
        this.locationType = locationType;
		this.name = name;
        this.locationStatus = "NONE";
        this.locationStatusOwner = null;
    }

    locationType;
    name;
    locationStatus;
    locationStatusOwner;

	get LocationStatus() {
		return this.locationStatus;
	}

	set LocationStatus(locationStatus) {
		this.locationStatus = locationStatus;
	}

	get LocationStatusOwner() {
		return this.locationStatusOwner;
	}

	set LocationStatusOwner(locationStatusOwner) {
		this.locationStatusOwner = locationStatusOwner;
	}

	get LocationType() {
		return this.locationType;
	}

	set LocationType(locationType) {
		this.locationType = locationType;
	}

	get Name() {
		return this.name;
	}

	set Name(name) {
		this.name = name;
	}
	
    getLocationStatusOwnerAsString() {
		if(locationStatusOwner == null) {
			return "null";
		}
		return "" + locationStatusOwner.getIdx();
	}
}

export default ARoom;
