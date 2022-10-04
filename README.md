# Drum Machine

A drum machine I have created while going through the _Front End Development Libraries_ challenges and lessons at https://www.freecodecamp.org

## [Front End Development Certificaton Projects](https://github.com/Squibs/freeCodeCamp#freecodecamp) (Go Back to My freeCodeCamp Repository)

<a href="https://drum-machine.squibs.vercel.app/" tart="_blank"><img src="project documents/screenshot-drum-machine.png" height="400" alt="Screnshot of my Drum Machine app / website"/></a>

### [Drum Machine](https://drum-machine.squibs.vercel.app/) (Click to view functional site)

<em>Completed October 4, 2022</em>

The final _Front End Development Library_ project I completed while going through the lessons and challenges on [freeCodeCamp](https://www.freecodecamp.org/). For this project I created a drum machine.

As with the rest of the other freeCodeCamp projects or challenges I was presented with several _user stories_ that I had to meet in order to consider this project complete. These _user stories_ did change how I would have tackled this project myself, but I feel it is good practice to accommodate to various demands or requests that help shape the project when it is finished.

Some of these _user stories_ being:

- Being able to have the keyboard correspond to each individual drum pad.
- At least 9 clickable drum pad elements, with the inner text being related to that of the keyboard keys that trigger them.
- Having a string of text be displayed, depending on the action the user takes, inside of a 'display'.

I went a bit further and followed their example project, adding in a sound bank button as well as a volume slider, and adding in additional features of my own. I included a pitch and pan slider (or knob depending on screen size), to change how the sound is being played.

This project once again reminded me of just how much extra effort has to go into one specific thing, iOS Safari, just to get everything working correctly. I really wanted this project to work correctly across all sorts of devices, and iOS in general just would not cooperate with me. Many of the issues I ran into had to do with iOS on this project. Sounds would not play correctly, only one sound at a time would play, or the triggered audio would just no longer play at all. All of these issues only happened on iOS, and I spent a while trying to come up with my own solution. In the end I had to rely on **Howler.JS**, and suddenly my iOS issues were somewhat gone.

---

Created using my own [Gatsby Starter](https://github.com/Squibs/gatsby-boilerplate#gatsby-boilerplate)

[Certificate](https://www.freecodecamp.org/certification/squibs/front-end-development-libraries) I recieved upon completing this final _Front End Development Library_ project on freeCodeCamp.

Both kits from [KB6](https://samples.kb6.de/downloads.php):

- Drum kit 1 is Korg MR-16
- Drum kit 2 is Nintendo NES

General Layout:

| Tom 1   | Tom 2      | Cymbal 1 | Cymbal 2  |
| ------- | ---------- | -------- | --------- |
| Hihat   | Open Hihat | Ride     | Sidestick |
| Snare 1 | Snare 2    | Kick 1   | Kick 2    |
