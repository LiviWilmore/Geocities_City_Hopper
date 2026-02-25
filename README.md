                                                                                    
 ▗▄          ▗▄  ▝   ▗   ▝               ▗▄  ▝   ▗          ▗  ▖                    
▗▘ ▘ ▄▖  ▄▖ ▗▘ ▘▗▄  ▗▟▄ ▗▄   ▄▖  ▄▖     ▗▘ ▘▗▄  ▗▟▄ ▗ ▗     ▐  ▌ ▄▖ ▗▄▖ ▗▄▖  ▄▖  ▖▄ 
▐ ▗▖▐▘▐ ▐▘▜ ▐    ▐   ▐   ▐  ▐▘▐ ▐ ▝     ▐    ▐   ▐  ▝▖▞     ▐▄▄▌▐▘▜ ▐▘▜ ▐▘▜ ▐▘▐  ▛ ▘
▐  ▌▐▀▀ ▐ ▐ ▐    ▐   ▐   ▐  ▐▀▀  ▀▚     ▐    ▐   ▐   ▙▌     ▐  ▌▐ ▐ ▐ ▐ ▐ ▐ ▐▀▀  ▌  
 ▚▄▘▝▙▞ ▝▙▛  ▚▄▘▗▟▄  ▝▄ ▗▟▄ ▝▙▞ ▝▄▞      ▚▄▘▗▟▄  ▝▄  ▜      ▐  ▌▝▙▛ ▐▙▛ ▐▙▛ ▝▙▞  ▌  
                                                     ▞              ▐   ▐           
                                                    ▝▘              ▝   ▝           
GEOCITIES CITY HOPPER!
Created by Livi Wilmore
February 2026

Welcome to Geocities: City Hopper, a Spectacles Lens allowing users to jump back in time and explore archived GeoCities website, archived by Restorativland while reflecting on online nostalgia, and what it means to have a home online. Users can also customise their surroundings with stickers of retro images, inspired by the different neighbourhoods of Geocities. Enjoy!

---Running---

Created and tested in;
Lens Studio: 5.15.3 (Latest Spectacles Capable Build as of 25/02/2026)
Spectacles OS: 5.58

This Lens is for Spectacles and uses an experimental feature (WebView) so needs to have 'Allow Experimental Feature' on;

In Project Settings → General → API Settings:
✔ Allow Experimental API – ON (required for WebView)

In Project Settings → Platform Settings → Spectacles:
✔ Made for Spectacles – ON

---Dependancies---

All dependency packages are packaged within the project, but incase of error, from the Asset Store
Download:
✔SpectaclesInteractionKit.lspkg
✔LSTween.lspkg
✔SpectaclesUIKit.lspkg
✔InteractableHelper.lspkg
✔SurfacePlacement.lspkg
✔WebView.lspkg
✔WorldQueryHit.lspkg
✔Sparkles Material.lspkg


---Instructions---
Hoping the inbuilt instructions are clear but here is an overview!

➤From inside Lens Studio, connect spectacles and click Preview Lens.

➤Wait 10 seconds and read initial splash screen

➤You will see a "pop up" which you can close by pressing the [x] once you've read it (You can pinch and reposition if any text is cut off during initial calibration.

   -Web Browser-

➤Drag and place the circle UI onto a flat surface and pinch to place - a computer will appear.
➤You can reset the position by pressing "Reset" under the small computer graphic to the right
➤Once placed, Pinch the "Random Cool Website" Button above the Computer to visit a random archived geocities website!
   NOTE:
   Some websites may play music, have images missing, or be heavy to browse, causing spectacles to 
   overheat faster than normal lens's.
➤You can click through inner-website hyper links by pinching on them, and scroll down/ up the website by pinching and dragging anywhere without a button
➤You can press the "Random Cool Website" Button as many times as you like and keep exploring!


  -Sticker Sheet-

➤You will also see a sticker sheet labeled "Neighbourhood Stickers!", you can drag and reposition this by pinching and dragging anywhere on the sheet that isn't a sticker
➤ Pinch on a sticker to select it, and then position the stickers on any surfaces around you.
➤ You can place as many stickers as you like, change designs by pressing on a different sticker, and layer them up!
➤ To delete all the stickers you have placed pinch the delete button to the left of the sticker sheet
➤ To deselect a sticker (so no sticker is attached to your cursor whilst navigating other areas of the lens) pinch the deselect button to the left of the sticker sheet.

---Scripts---

Brief overview of the custom scripts in the lens:

➤OpeningMenuController
  Script for controlling the opening splash screen, Hiding the main content until after a timer.

➤RandomAudioController
  Script for playing randomised audio clips, when the Random Internet Button is pressed calling playRandom from an InteractableHelper on the Random Internet Button

➤RandomURLController
  Script to randomly select and visit a URL from a list hosted within the script via the WebView script on the WebPlane from an InteractableHelper on the Random Internet Button

➤ResetStickerBridge
  Bridge script so InteractableHelper can call into the WorldQuery TypeScript component to reset via a created resetSticker function

➤WorldQueryBridge
  Bridge script for InteractableHelper to connect to WorldQuery and select a value (sticker) from WorldQuery

➤WorldQuery
  An adapted WorldQuery script with additional functionality for blocking interactions while the Random Internet Button is being pressed.
