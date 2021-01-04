
/**
 * Created by bricksphd on 6/19/2018.
 */
class Vector3 {

    static Zero = new Vector3(0, 0, 0);

    x = 0;
    y = 0;
    z = 0;

    /**
     * Take an object with x,y, and z parameters and return a new Vector3 instance
     * @param {Vector3-like} object 
     */
    static fromObject(object){
        return new Vector3(object.x, object.y, object.z || 0);
    }

    constructor(x, y, z) {
        if (y!== 0 && z!== 0 && (!y || !z)) {
            this.x = x[0];
            this.y = x[1];
            this.z = x[2];
        }
        else {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    clone(){
        return new Vector3(this.x, this.y, this.z);
    }

    asArray() {
        return  [this.x, this.y, this.z];
    }
    toString() {
        return "" + this.x + "," + this.y + "," + this.z;
    }

    static subtract(end, start) {
        return new Vector3(end.x - start.x, end.y - start.y, end.z - start.z);
    }

    normalize() {
        let length = length();

        this.x /= length;
        this.y /= length;
        this.z /= length;

        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    scale(f) {
        this.x *= f;
        this.y *= f;
        this.z *= f;

        return this;
    }

    scaleXZ(f) {
        this.x *= f;
        this.z *= f;
        return this;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;

        return this;
    }
    equals(other){
        if(!other) return false;
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }
    distanceTo(other){
        if(!other) throw new Exception("distanceTo requires a valid Vector3 object as a parameter");
        return this.subtract(this, other).length();
    }
}

export default Vector3;
