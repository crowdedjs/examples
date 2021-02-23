class AComment {

	get Text() {
		return this.text;
	}
    
	set Text(text) {
		this.text = text;
	}
    
	get Owner() {
		return this.owner;
	}
    
	set Owner(owner) {
		this.owner = owner;
	}
    
	get Audience() {
		return this.audience;
	}
    
	set Audience(audience) {
		this.audience = audience;
	}
    
	get Time() {
		return this.time;
	}
    
	set Time(time) {
		this.time = time;
	}
	
	owner; //APerson
	audience; //APerson
	time; //int
	text; //string
	
	constructor(owner, audience, time, text) {
		super();
		this.owner = owner;
		this.audience = audience;
		this.time = time;
		this.text = text;
	}
    
	get DecoratedText() {
		if(this.audience == null) {
			return this.text;
		}
		return "'" + this.text + "'";
	}
}
	
export default AComment;
