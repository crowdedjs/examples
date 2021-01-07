class Computer {
    entries = [];

    add(entry) {
        this.entries.push(entry);
    }

    print() {
        this.entries.forEach(c=>console.log(c));
    }

    getEntry(patient) {
        //JAVA VERSION: return entries.stream().filter(c->c.patient == patient).findAny().orElse(null);
        
        //JAVASCRIPT (DOESN'T WORK): return this.entries.chain().filter(c=>c.patient == patient).some() || null;
        
        for(let i = 0; i < this.entries.length; i++)
        {
            if (this.entries[i].Patient == patient)
            {
                return this.entries[i];
            }
        }

        return "That patient is not in the system.";
    }

    }

export default Computer;