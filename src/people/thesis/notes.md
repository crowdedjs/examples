# Thesis Overhaul Notes
The basis of these code changes boil down to this:
- The agents should have an initial behavior (or two), probably dictating that they go
to their assigned place and wait for an event. This needs to be retained as the device
to give them new behaviors comes from each agent they interact with not an overseer.
- The patient goes to the front desk, and should be given a new behavior, to go to the waiting room or to follow the triage nurse.