# Thesis Overhaul Notes
The basis of these code changes boil down to this:
- The agents should have an initial behavior (or two), probably dictating that they go
to their assigned place and wait for an event. This needs to be retained as the device
to give them new behaviors comes from each agent they interact with not an overseer.
- The patient goes to the front desk, and should be given a new behavior, to go to the waiting room or to follow the triage nurse.
- The greeter nurse's behaviors will likely remain somewhat unchanged. The greeter's behaviors are always constant and aside from shift changes, I think the greeter nurse will be a lynchpin in the system. The greeter will dole out the first few behaviors to the patient and the triage nurse.

# What I've Learned About Our Codebase
- There cannot be an operation in .splice(HERE). It can accept a variable or an array value, but you cannot pull a value from an array in another file (like Hospital.sampleArray[number]) or even get a value from an operation and plug it into an existing array. This means to send behaviors back and forth, you must initialize it into the file, and then use that variable.
- Behavior must be stated outright and or must be established at the top of the file
- even getting the number and doing like testArray[tempValue] doesn't work. It must just be a number.

# Questions
- How should I instantiate the behaviors?
    1. At the top of the agent's behavior tree file
    2. At the moment it is being passed from one agent to another (e.g. the greeter nurse instantiates a GoToLazy behavior then passes it to the patient)
    3. Instantiate all possible behaviors and put them in hospital.js, and reference the behavior in the behaviors list that needs to be pushed into the agent to do list from there
    4. Use responsibilities?

