// Script for controlling the opening menu, 
// Hiding the main content unter after a timer

// @input SceneObject menuUI               // Parent of your title/menu UI
// @input SceneObject mainContent          // Root of the main experience to enable after menu

// @input float menuTimeout = 0.0          // Seconds; 0 or negative = no auto-timeout

var menuVisible = false;
var menuTimerEvent = null;



// Show the menu UI and gate the main content
function showMenu() {
    // Show menu
    if (script.menuUI) {
        script.menuUI.enabled = true;
    }

    // Disable / gate main content while menu is visible
    if (script.mainContent) {
        script.mainContent.enabled = false;
    }

    menuVisible = true;

    // Auto-close the menu after some time
    if (script.menuTimeout > 0) {
        menuTimerEvent = script.createEvent("DelayedCallbackEvent");
        menuTimerEvent.bind(function () {
            dismissMenu();
        });
        menuTimerEvent.reset(script.menuTimeout);
    }
}

// Hide the menu and start the main experience
function dismissMenu() {
    if (!menuVisible) {
        return;
    }

    // Hide the menu UI
    if (script.menuUI) {
        script.menuUI.enabled = false;
    }

    menuVisible = false;

    // Cancel timeout
    if (menuTimerEvent) {
        menuTimerEvent.enabled = false;
        menuTimerEvent = null;
    }

    // Enable main content / game / experience
    if (script.mainContent) {
        script.mainContent.enabled = true;
    }
}

// Wire up the close button interaction
if (script.closeButtonInteraction) {
    // Initialize cached scale once
    initCloseButtonScale();

    // Use InteractionComponent's onTap event (works with mouse/touch)
    script.closeButtonInteraction.onTap.add(function (eventData) {
        // Play the press-scale feedback first
        playCloseButtonPressFeedback();

        // Then dismiss the menu as before
        if (menuVisible) {
            dismissMenu();
        }
    });
} else {
    print("OpeningMenuController: closeButtonInteraction is not set.");
}

// Show the menu when the lens starts
var onStart = script.createEvent("OnStartEvent");
onStart.bind(function (eventData) {
    showMenu();
});
