# Thesis Overhaul Notes
The basis of these code changes boil down to this:
- All agents received the changes to their behavior trees, the least of those though being the greeter, triage, and patient. These agents have very static behaviors or are simply quite complicated and have no need to overhaul.
- Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH TASK FROM LIST -> TAKE TIME -> QUEUE TASKS -> RESTART
- Using shared task queues in the hospital file, each agent also has a list of tasks in their behavior trees. Behaviors are queued from different spots across the trees. With the addition of a graphic that clearly shows where each task is being queued from, this should be an improvement in clarity and simplicity from the original.

# What I've Learned About Our Codebase
- There cannot be an operation in .splice(HERE). It can accept a variable or an array value, but you cannot pull a value from an array in another file (like Hospital.sampleArray[number]) or even get a value from an operation and plug it into an existing array. This means to send behaviors back and forth, you must initialize it into the file, and then use that variable.
- Behavior must be stated outright and or must be established at the top of the file
- even getting the number and doing like testArray[tempValue] doesn't work. It must just be a number.

# To Do
 - probably should make a flow chart (include in thesis) that illustrates the flow of tasks
 - three versions of the hospital: actual hospital, like the actual hospital, and the minimal viable end product
    - shouldn't be too much of an issue, i believe the json files with the location flags are really the most important things and minimally needed things (aside from the walls)
- Implement priorities / sorting based on priority to trees
- Limit rooms each agent should take tasks for
- Could the code be even DRY-er? Almost every new tree has the same structure, so couldn't it be simplified more? Probably out of scope for the timeline and purpose of this project.

# Bugs
- Adding an extra tech to the end of the json file (rather than going through all the work to shift the id numbers down by 1 to add them in) causes them to not function. Likely due to a problem with the time they enter. Probably has to be greater or equal to the timestep of the entry above them.
- Shift change with new implementation won't delete the old agents.
- Each tick is about 100 ms? I still don't think that the fps is locked at 25 (or that there is a tick per frame). I will need to record data in ticks because I am greatly unsure about this. 

