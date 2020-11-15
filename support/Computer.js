class Computer {
    entries = [];

    add(entry) {
        entries.add(entry);
    }

    print() {
        this.entries.forEach(c=>console.log(c));
    }

    getEntry(patient) {
        //return entries.stream().filter(c->c.patient == patient).findAny().orElse(null);
        // check this line
        return this.entries.chain().filter(c=>c.patient == patient).some() || null;
        

    }

}