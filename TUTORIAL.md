# Summary
This is a javascript browser-based simulation. The simulation has 24 in-simulation hours, a 3D hospital setup, and lists of agents.

This is the most important file in the simulation: `examples\src\index.js`. This is where the boot function is called and everything is initialized. This includes hospital boundaries, location flags, arrival files for agents, and a table graphic (which is unused at the moment).

The Hospital file (`examples\src\support\hospital.js`) is like a centralized hub for information in the simulation. You can use it and access it from any file in the codebase. It allows for storing such data as shift change data, testing data, etc.

Each agent in the simulation is made up of two things. They are an agent in that they have locational data and the like (make sure you understand object inheritance), but attached to them is also a behavior tree. For this project we are using this behavior tree module: https://github.com/aequasi/fluent-behavior-tree, I recommend you familiarize yourself with it. Behavior trees and agent files can be found in `src/people`, other important files can be found in `src/support`. Specific behavior files can be found in the `src/behavior` folder, although most agents currently don't use these files.

These agents are passed in through `examples\src\assets\arrivals`, where they are then initialized a behavior tree based on their overall type (patient agent vs medical agent), class (Nurse, Tech, etc.) and subtypes (Resident, Tech, CT, XRay, etc.). These behavior trees lay out the general task structure of an agent. Agents are also color coded: `src\color-function.js`.

Moving away from each agent having individual logic to determine their task, they instead assign tasks to each other. Most but not all agents do this, and as long as these tasks are documented it should not be too bad to follow them back and forth. Flowchart for task assigning: `examples\task_flowchart`. Each task also has a set amount of time it takes to finish it.

Rooms are also objects of their own with their own data and statuses (such as needing to be sanitized by the janitorial agent).

New Arrival lists must be added in multiple places:
- `src\assets\arrivals`
- `src\assets\index.js`
- `src\index.js`

New hospital layouts must be added in multiple places: 
- `src\assets\locations`
- `src\assets\objs`
- `src\assets\index.js`
- `src\simulations.js`
- `src\index.js`

## Behavior Tree Overhaul Notes
Moving away from each agent having individual logic to determine their task, they instead assign tasks to each other. Most but not all agents do this, and as long as these tasks are documented it should not be too bad to follow them back and forth. Flowchart for task assigning: `examples\task_flowchart`. Each task also has a set amount of time it takes to finish it.

STRUCTURE OF TREES: TESTING -> GO TO START -> QUEUE STORED TASKS -> GET A TASK -> GO TO THE TASK -> ACCOMPLISH THE TASK FROM *LIST OF TASKS* -> TAKE TIME -> RESTART

- Using shared task queues in the hospital file, each agent also has a list of tasks in their behavior trees. Behaviors are queued from different spots across the trees. With the addition of a graphic that clearly shows where each task is being queued from, this should be an improvement in clarity and simplicity from the original.
- Anyone can put tasks in other lists, but they should ONLY pull from THEIR OWN!
- Greeter Nurse, Triage Nurse, and Patients don't need the new system because their trees are straightforward, relatively optimized, and have to run nearly every node to completion before restarting.
- Tasks are queued in their own do node because queuing them where they were created caused timing issues (agents were arriving to do follow up things before the task that queued it was even complete).
- Make sure tasks are given times to complete them. (taskTime variable)

## Instructions to Use
Make sure you have Node and that it is up to date.

Recommend using Visual Studio Code. Open the Terminal and use `npm start`, then use the link it provides once it boots up. This will likely be **localhost:3000**. Any changes you make in the code now will refresh your page and be reflected there. Make sure you're utilizing the browser console for various testing outputs. A full run of the simulation on a desktop computer takes around 20ish minutes; laptop computers run the simulation much slower.

If your changes aren't being reflected, try clearing your browser cache or the cache in VS Code.

Dr. Ricks and I have been using Github (https://github.com/crowdedjs/examples) for this project. We have two branches, a main branch and a dev branch. Make your pushes to the dev branch and always confirm with him before merging it with main. At which point you can delete your dev branch and make a new one. Updating the main branch will not update the overall website though!

If you need to use local changes to node_modules, you will need to uncomment lines in `config\vite.config.js`. In my experience, I've had to do this a few times for certain 'scoring' output I wanted from `node_modules\@crowdedjs\crowd-setup\index.js`.

## Links
- Old Implementation: https://er-old.ricks.io/
- New/Most Recent Implementation: https://er-new.ricks.io/
- Github page for Javascript port of Recast & Detour: https://github.com/ricksteam/recastdetourjs
- Github page for behavior tree module: https://github.com/aequasi/fluent-behavior-tree
- Github page for this project: https://github.com/crowdedjs/examples

## Random Tidbits
- Sequence seems to loop pretty reliably as far as having agents have an OVERALL looping behavior tree.
- Splicing is frustrating. There cannot be an operation in .splice(HERE). It can accept a variable or an array value, but you cannot pull a value from an array in another file (like Hospital.sampleArray[number]) or even get a value from an operation and plug it into an existing array. This means to send behaviors back and forth, you must initialize it into the file, and then use that variable. Behavior must be stated outright and or must be established at the top of the file. Even getting the number and doing like testArray[tempValue] doesn't work. It must just be a number.


# To Do List
- Implement priority queuing / sorting based on emergency, priority, and time a task has been waiting (CT / XRay tasks should probably receive high priority, as it is a blocker currently)
    - What metric should be used to sort? 
        - Make a big list of the queable tasks, then consult with Dr. Zeger to figure out what the priority of each task should be. Should also approach him more generally to see if there are more big ticket tasks or considerations on what tasks take priority.
        - Will need to go through and make sure the 'severity' value of each created task is this integer metric (rather than patient severity)
        - Going to CT and XRay would be a high priority task to reduce blocker and length of stay
        - Using patient severity would cause ESI4 patients to sit idle nearly indefinitely while a stream of ESI3 patients are helped first; a solution to this would be implementing the feature of assigning groups of rooms to certain staff that way there is always someone available.
        - A janitor's sorting should probably be based on the availability of the type of room to sanitize. If there are very few C rooms left, that should be a bigger priority. A rooms would also be the most important.
    - Should implement a function to upgrade the importance value used for sorting based on how long a task has been in the list
    - Prototype sorting do node in nurse.js, sorting algorithm is in hospital.js 
- Implement entryTime in task.js (always had trouble figuring out how to get access to the current simulation time/tick)
- Fully implement (use tasks rather than old code) and bug fix shift changes (agent models aren't getting deleted). Make sure you go through arrivalHospitalFull.js and make sure new medical agents arrivals are correct. Recommend getting Dr. Ricks's help. Shift changes should *officially* be: 0700 - 1500; 1500 - 2200; 2200 - 0700. They are currently 0600 - 1800 (first 12 hours) and (second 12 hours) 1800 - 0600.
- Limit rooms each agent should take tasks for (Dr. Zeger from UNMC says most medical agents have batches of rooms close together, might also be more computer checkpoints they could go to rather than heading all the way back to the one "home" location) (nurses zone 4 rooms, techs zone 8 rooms)
- Make sure patients stop getting pushed out of their rooms. Utilizing GO_INTO_ROOM patient-temp-state is probably the solution, but it had a few errors I didn't have time to resolve (like the patient trying to go back to their original room if given this state when they go to CT/XRay)
- Fix pathfinding issues in regards to agents being in the way. Workaround in behavior trees might not be worth it, might need to make edits in Recast & Detour module instead, which would require Dr. Ricks's help.
- Pharmacist and Attending do not have behaviors.
- Try to sync the simulation time to real life time. Use taskTime variable for this for tasks, but for travelling you might need to alter agent velocities or the simulation timer. Will need to get data from UNMC for how long each task should reasonably take.
- Previous take-time behavior (examples\src\behavior\take-time.js) had ranges with the task being randomly generated between them, should try to reimplement that. Also just a heads up, I made take-time into individual behaviors because when I spliced that file in it hardly ever worked and I spent a lot of tries and time trying to debug it.
- Implement COMMENTS, which were dialogue thought bubbles from the old java version of the simulation.
- Add triage room functionality (not used if large availability of beds)
- Different ESIs go to different rooms (4s and 5s seen elsewhere, same with 3s)
- Add support for the other animations of agents. (Not doing the walking animation all the time.)
- Create a better way for generating arrival files or making simple edits. Appending this as an end-user ability would also be incredible in regards to providing it to UNMC researchers. Notes from previous talk with Dr. Ricks on this topic:
    - https://github.com/ricksteam/ED-ArrivalTimeGenerator
    - https://github.com/ricksteam/crowds2FrontEnd/blob/master/src/assets/Baker.js
    - "Copy lines 79 through 142 into a .js file and run it using node. There are some variables you will need to set at the top of your file, for example you need to set self.arrivals.patientArrivals to be an array of arrivals per hour. This file can create a lot of things, not just arrivals. The function you want to look at is bakeArrivals()"

- There seems to be a lot of deprecated code(?), for example: examples\public\arrivals & examples\public\locations & examples\public\objs & examples\src\arrivals (what is public folder for?)
- Could the code be even DRY-er; almost every new tree has the same structure, so could it be simplified more?


# Known Bugs
- Adding an extra tech/agent to the end of the json file (rather than going through all the work to shift the id numbers down by 1 to add them in) causes them to not function. Likely due to a problem with the time they enter. Probably has to be greater or equal to the timestep of the entry above them.
- Shift change with new implementation won't delete the old agents. Sometimes patients aren't deleted either and they become an amalgamous monster.
- Ticks values used in json arrival file is odd. It is based on (actual tick value * 1000) / 25. The actual number of ticks in the simulation is 86400, with 1 tick per second.
- Traffic jams
- Agent models not getting deleted properly in general
- If there is an issue with Task Queuing, the simulation will simply freeze and there will be no error text. Check spelling and the like.
- Use distanceTo and distanceToSquared functions interchangeably. My desktop can use distanceToSquared, but my laptop will error out if I do not use distanceTo.