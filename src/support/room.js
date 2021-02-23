import LocationStatus from "./location-status.js"

class Room {

    constructor(location, roomType, name) {
        this.name = name;
        this.location = location;
        this.roomType = roomType;
        this.locationStatus = LocationStatus.NONE;
        this.locationStatusOwner = null;
    }
    getName(){
        return this.name;
    }
    setName(name){
        this.name = name;
    }
    getLocation(){
        return this.location;
    }
    setLocation(location){
        this.location = location;
    }
    getRoomType(){
        return this.roomType;
    }
    setRoomType(type){
        this.roomType = type;
    }
    getLocationStatus(){
        return this.locationStatus;
    }
    setLocationStatus(status){
        this.locationStatus = status;
    }
    getLocationStatusOwner(){
        return this.locationStatusOwner;
    }
    setLocationStatusOwner(owner){
        this.locationStatusOwner = owner
    }



}

export default Room;
