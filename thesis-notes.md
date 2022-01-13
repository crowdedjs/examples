# Thesis Overhaul Notes
The basis of these code changes boil down to this:
- The roaming and spontaneous agents will probably receive the bulk of these changes. The agents with set behaviors that don't move probably will recieve minimal changes (greeter, xray, ct). The patient will likely receive little to no changes.
- Every other agent will likely have a queue of actions they pull from from the hospital computer. It might be worth also limiting the agents to a couple rooms, like Dr. Zeger suggested and also having "rover nurses".
- Basically implement a priority queue + behavior queue from the computer
- Will need to pass the information of what behavior they should perform and its details. The behaviors themselves will need to be already instantiated so they work.
- To do this, will probably just need a lot of behaviors that check if it is in the queue, and if it is not then go to the next behavior.

# What I've Learned About Our Codebase
- There cannot be an operation in .splice(HERE). It can accept a variable or an array value, but you cannot pull a value from an array in another file (like Hospital.sampleArray[number]) or even get a value from an operation and plug it into an existing array. This means to send behaviors back and forth, you must initialize it into the file, and then use that variable.
- Behavior must be stated outright and or must be established at the top of the file
- even getting the number and doing like testArray[tempValue] doesn't work. It must just be a number.

# Questions
- the arrays should probably be sorted every so often (by importance and time)?
- probably should make a flow chart (could include it in thesis as well) that illustrates the flow of tasks
 greeter --assigns--> triage --assigns--> nurse / tech? / ? -->

 - need to figure out what tasks require agents to actually go to location (need to pass in null otherwise)
 - need to set up transport behaviors

# To Do
 - three versions of the hospital: actual hospital, like the actual hospital, and the minimal viable end product
    - shouldn't be too much of an issue, i believe the json files with the location flags are really the most important things and minimally needed things (aside from the walls)

