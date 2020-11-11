


/**
 * Created by bricks on 6/19/2018.
 */

 //import { NamedModulesPlugin } from "webpack";
import Vector3 from "./Vector3.js"

class ABehavior {

    index;
    location;
    agents;
    positions;
    msec;


    constructor(myIndex) {
        this.index = myIndex;
    }

    update(agents, positions, msec) {
        //Do nothing since this is the default "none" behavior.

        let idx = agents[this.index].idx;
        let position = positions.find(a=>a.id == this.index);
        if(!position || position.length == 0) return null; //Most likely our first tick and the simulation hasn't given us an official position yet
        let x = position.x;
        let y = position.y;
        let z = position.z;

        this.location = new Vector3(x, y, z);
        this.agents = agents;
        this.positions = positions;
        this.msec = msec;

        return this.checkEndOfSimulation();

    }


}
export default ABehavior;