// Bridge script so InteractableHelper can call into the WorldQuery TypeScript component to reset via a created resetSticker function

// @input Component.ScriptComponent newWorldQueryScript

script.resetStickers = function(eventData) {
    if (!script.newWorldQueryScript) {
        print("ResetStickersCallback: newWorldQueryScript input is not set.");
        return;
    }

    var api = script.newWorldQueryScript;
    if (!api) {
        print("ResetStickersCallback: newWorldQueryScript.api is missing.");
        return;
    }

    if (typeof api.resetStickers !== "function") {
        print("ResetStickersCallback: api.resetStickers is not a function.");
        return;
    }

    api.resetStickers();
};