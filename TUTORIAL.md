# Introduction
examples\src\index.js

Flowchart for task assigning: examples\task_flowchart

# Thesis Overhaul Notes
- Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH TASK FROM LIST -> TAKE TIME -> QUEUE TASKS -> RESTART
- Using shared task queues in the hospital file, each agent also has a list of tasks in their behavior trees. Behaviors are queued from different spots across the trees. With the addition of a graphic that clearly shows where each task is being queued from, this should be an improvement in clarity and simplicity from the original.

# Random Tidbits
- There cannot be an operation in .splice(HERE). It can accept a variable or an array value, but you cannot pull a value from an array in another file (like Hospital.sampleArray[number]) or even get a value from an operation and plug it into an existing array. This means to send behaviors back and forth, you must initialize it into the file, and then use that variable.
- Behavior must be stated outright and or must be established at the top of the file
- even getting the number and doing like testArray[tempValue] doesn't work. It must just be a number.

# To Do List
- Bug fix shift changes (agent models aren't getting deleted). Make sure you go through arrivalHospitalFull.js and make sure new medical agents arrivals are correct. Recommend getting Dr. Ricks's help.
- Implement priorities / sorting based on priority to trees
- Limit rooms each agent should take tasks for
- Could the code be even DRY-er? Almost every new tree has the same structure, so couldn't it be simplified more? Probably out of scope for the timeline and purpose of this project.
- There seems to be a lot of deprecated code(?), for example: examples\public\arrivals & examples\public\locations & examples\public\objs & examples\src\arrivals
- Make sure patients stop getting pushed out of their rooms. Fix pathfinding issues in regards to agents being in the way.


# Known Bugs
- Adding an extra tech/agent to the end of the json file (rather than going through all the work to shift the id numbers down by 1 to add them in) causes them to not function. Likely due to a problem with the time they enter. Probably has to be greater or equal to the timestep of the entry above them.
- Shift change with new implementation won't delete the old agents. Sometimes patients aren't deleted either and they become an amalgamous monster.
- Ticks values used in json arrival file is odd. It is based on (actual tick value * 1000) / 25. The actual number of ticks in the simulation is 86400, with 1 tick per second.
- When all the rooms in the hospital are full, patients stop going to the waiting room and crowd the greeter nurse.