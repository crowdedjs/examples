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
- Should probably have some sort of format/object for what goes in the ToDo arrays:
{taskname/ID/#, importance/severity, timestep it was entered?, potential patient it concerns, potential location?}
- the arrays should probably be sorted every so often (by importance and time)?

