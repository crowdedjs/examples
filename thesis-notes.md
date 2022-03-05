# Thesis Overhaul Notes
The basis of these code changes boil down to this:
- All agents received the changes to their behavior trees, the least of those though being the greeter, triage, and patient. These agents have very static behaviors or are simply quite complicated and have no need to overhaul.
- Structure of New Trees: GO TO START -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH TASK FROM LIST -> TAKE TIME -> QUEUE TASKS -> RESTART
- Using shared task queues in the hospital file, each agent also has a list of tasks in their behavior trees. Behaviors are queued from different spots across the trees. With the addition of a graphic that clearly shows where each task is being queued from, this should be an improvement in clarity and simplicity from the original.

# What I've Learned About Our Codebase
- There cannot be an operation in .splice(HERE). It can accept a variable or an array value, but you cannot pull a value from an array in another file (like Hospital.sampleArray[number]) or even get a value from an operation and plug it into an existing array. This means to send behaviors back and forth, you must initialize it into the file, and then use that variable.
- Behavior must be stated outright and or must be established at the top of the file
- even getting the number and doing like testArray[tempValue] doesn't work. It must just be a number.
- There are 3,456,000 ticks total in the simulation. 1 tick per frame, 25 frames per second. Can confirm, 1,728,000 ticks is 12 hours on the dot into the simulation. (86400 x 1000 = 86400000 / 25 = 3456000)

# To Do
 - probably should make a flow chart (include in thesis) that illustrates the flow of tasks
 - three versions of the hospital: actual hospital, like the actual hospital, and the minimal viable end product
    - shouldn't be too much of an issue, i believe the json files with the location flags are really the most important things and minimally needed things (aside from the walls)
- Implement priorities / sorting based on priority to trees
- Limit rooms each agent should take tasks for
- Could the code be even DRY-er? Almost every new tree has the same structure, so couldn't it be simplified more? Probably out of scope for the timeline and purpose of this project.

# Known Bugs
- Adding an extra tech/agent to the end of the json file (rather than going through all the work to shift the id numbers down by 1 to add them in) causes them to not function. Likely due to a problem with the time they enter. Probably has to be greater or equal to the timestep of the entry above them.
- Shift change with new implementation won't delete the old agents. Sometimes patients aren't deleted either and they become an amalgamous monster.
- Ticks values used in json arrival file is odd. It is based on (actual tick value * 1000) / 25. The actual number of ticks in the simulation is 86400, with 1 tick per second.
- When all the rooms in the hospital are full, patients stop going to the waiting room and crowd the greeter nurse.

# Data Gathering
- Need to find sweet spot for number of patients to deploy, too many with current amount of medical agents, so up the current # of medical agents.
- No shift change due to bug with agent bodies not deleting
- Need to denote the exact behavior line used. All patients get an xray or ct.
- Exclude booked patient data and emergency patients --> Yes, remove booking patients entirely for now.
- Convert ticks to in-simulation time

- Need to make modifications to old implementation data gathering
- Need to get json file for improved # of agents

- 1 tech for every 2 nurses
- 1 nurse for every 4 rooms
- 1 resident for every 2 nurses
- 1 faculty doctor for every 2 residents

2 doctor (attending physician)
4 residents
8 nurses
4 tech
2 janitors?

