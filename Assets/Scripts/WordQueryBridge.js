// Bridge script for InteractableHelper to Select form WorldQuery


// @input Component.ScriptComponent worldQueryScript

// These functions are what Interactable Helper will call.
// Each one just forwards to NewWorldQuery.setSelectedIndex(N).

script.selectValue0 = function(eventData) {
    print("WorldQuerySelectCallbacks: selectValue0");
    if (script.worldQueryScript && script.worldQueryScript.setSelectedIndex) {
        script.worldQueryScript.setSelectedIndex(0);
    } else {
        print("WorldQuerySelectCallbacks: worldQueryScript or setSelectedIndex missing");
    }
};

script.selectValue1 = function(eventData) {
    print("WorldQuerySelectCallbacks: selectValue1");
    if (script.worldQueryScript && script.worldQueryScript.setSelectedIndex) {
        script.worldQueryScript.setSelectedIndex(1);
    } else {
        print("WorldQuerySelectCallbacks: worldQueryScript or setSelectedIndex missing");
    }
};

script.selectValue2 = function(eventData) {
    print("WorldQuerySelectCallbacks: selectValue2");
    if (script.worldQueryScript && script.worldQueryScript.setSelectedIndex) {
        script.worldQueryScript.setSelectedIndex(2);
    } else {
        print("WorldQuerySelectCallbacks: worldQueryScript or setSelectedIndex missing");
    }
};

script.selectValue3 = function(eventData) {
    print("WorldQuerySelectCallbacks: selectValue3");
    if (script.worldQueryScript && script.worldQueryScript.setSelectedIndex) {
        script.worldQueryScript.setSelectedIndex(3);
    } else {
        print("WorldQuerySelectCallbacks: worldQueryScript or setSelectedIndex missing");
    }
};

script.selectValue4 = function(eventData) {
    print("WorldQuerySelectCallbacks: selectValue4");
    if (script.worldQueryScript && script.worldQueryScript.setSelectedIndex) {
        script.worldQueryScript.setSelectedIndex(4);
    } else {
        print("WorldQuerySelectCallbacks: worldQueryScript or setSelectedIndex missing");
    }
};

script.selectValue5 = function(eventData) {
    print("WorldQuerySelectCallbacks: selectValue5");
    if (script.worldQueryScript && script.worldQueryScript.setSelectedIndex) {
        script.worldQueryScript.setSelectedIndex(5);
    } else {
        print("WorldQuerySelectCallbacks: worldQueryScript or setSelectedIndex missing");
    }
};

script.selectValue6 = function(eventData) {
    print("WorldQuerySelectCallbacks: selectValue6");
    if (script.worldQueryScript && script.worldQueryScript.setSelectedIndex) {
        script.worldQueryScript.setSelectedIndex(6);
    } else {
        print("WorldQuerySelectCallbacks: worldQueryScript or setSelectedIndex missing");
    }
};
