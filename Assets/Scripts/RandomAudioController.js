// Script for playing randomised audio clips, when the Random Internet Button is pressed calling playRandom from an InteractableHelper on the Random Internet Button

// @input Component.AudioComponent[] clips   // drag your 3 (or more) AudioComponents here

var lastIndex = -1;

function getNextIndex() {
    if (!script.clips || script.clips.length === 0) {
        return -1;
    }

    if (script.clips.length === 1) {
        return 0;
    }

    var idx;
    do {
        idx = Math.floor(Math.random() * script.clips.length);
    } while (idx === lastIndex);

    return idx;
}

script.playRandom = function (eventData) {
    if (!script.clips || script.clips.length === 0) {
        print("RandomInternetAudio: no clips assigned");
        return;
    }

    var i = getNextIndex();
    if (i < 0) {
        return;
    }

    var ac = script.clips[i];
    if (!ac) {
        return;
    }

    lastIndex = i;
    ac.play(1.0); 
};