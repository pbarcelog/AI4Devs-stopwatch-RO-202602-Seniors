# Prompts used for Timer and Countdown app

## Prompt (implementation instructions)

Here you have the detailed instructions for coding a simple webapp. Before editing, analyse your implementation plan, identify any ambiguities and, if any, make decisions for a final implementation preserving the global objectives.

# Objective: develop a small web app that implements both a stopwatch (counts upward from 00:00:00) and a countdown (counts downward from a user-defined starting time).

# Constrains: 
1. base the implementation on the files present in the project, specially index.html and script.js, 
2. Create any other additional files you consider necessary, such as styles.css, test files and helper modules
3. Create or edit a prompts.md file to save this prompt in the new file or, if it already exists, at the end of the existing content
4. use software engineering best practices, such as SOLID and exception/error handling

# Development process:
1. use TDD:
- write tests before implementation
- run tests during development
- ensure the implementation passes the tests
2. Minimum tests are:
- time formatting/parsing
- stopwatch and countdown state transitions, completion and reset
- DOM behaviour for the main buttons and editable countdown display
3. Habilitate any necessary setup and/or configuration needed to run the tests locally
4. Replace the contents of Readme.md with concise instructions to run the app locally in a browser 

# Requirements:
1. landing view: create an attractive landing view titled 'Timer and Countdown'
2. the landing view must let the user choose between stopwatch and countdown
3. stopwatch view:
- a main time display initialized at 00:00:00
- milliseconds displayed as a smaller value associated with the main display, but only after the stopwatch has been started
- a primary button that initially says 'Start', that changes to 'Pause' when pressed, which then pauses the progress of the time count when pressed and changes back to 'Start'
- another button to 'Reset', that takes the countdown back to 00:00:00 when pressed, hidding the milliseconds
4. countdown view:
- a main time display initialized by default to 00:00:00
- milliseconds displayed as a smaller value, but only after the countdown has been started or paused
- hours, minutes and seconds are editable, to set the desired time starting point, not milliseconds
- a primary button that initially says 'Start' and, when pressed starts the countdown and changes to 'Pause', which, when pressed, stops the countdown and changes back to 'Start', allowing o retake the countdown
- a secondary button called 'Reset' which, when pressed, stops the countdown and returns the countdown to 00:00:00
- when the countdown reaches 0 it must stop and don't go into negative values
- editing rules: editing is only allowed when the countdown is idle or paused, not actively running
5. General: 
- handle cleanly repeated button presses, invalid countdown values, starting from 0 in countdown mode
- control that only valid time formats can be introduced when setting the objetive countdown value

# UX:
1. Make the two modes visually consistent
2. Use res/stopwatch.png as a visual reference to contrast your results
3. You may consult https://www.online-stopwatch.com/ only as inspiration for general appearance, but do not copy its countdown editing interaction if it conflicts with these requirements 

# Local execution: set up a simple local development server to run the app on a local port for testing
