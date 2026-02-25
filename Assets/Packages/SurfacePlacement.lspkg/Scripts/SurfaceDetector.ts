import animate, {
  CancelSet,
} from "SpectaclesInteractionKit.lspkg/Utils/animate";

import { CircleAnimation } from "../Scripts/CircleAnimation";
import { HandHintsController } from "./HandHintsController";
import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

@component
export class SurfaceDetector extends BaseScriptComponent {
  @input
  circleAnim: CircleAnimation;

  @input
  hintAnchor: SceneObject;

  @allowUndefined
  @input
  confirmText: Text;

  // Global toggle to control whether any confirm text is shown/updated
  // Default = false so "Pinch to Confirm" style text is disabled everywhere
  @input
  showConfirmText: boolean = false;

  // Optional configurable texts; when empty, built-in defaults are used
  @input idleText: string; // text shown when idle (no hover), based on device
  @input hoverText: string; // text shown on hover/drag
  @input mobileConfirmText: string; // confirm text when mobile is connected
  @input spectaclesConfirmText: string; // confirm text when only Spectacles are used

  protected cameraTransform: Transform =
    WorldCameraFinderProvider.getInstance().getTransform();
  protected hitTestSession = null;
  protected onCompleteCallback = null;
  protected onAnimCompleteCallback = null;
  protected trans = this.getSceneObject().getTransform();

  private updateEvent = null;
  private worldQueryModule = null;

  private visualParentTrans = this.getSceneObject().getChild(0).getTransform();
  private animCancel: CancelSet = new CancelSet();

  private iconTrans = null;

  protected mobileConnected = false;

  protected isCalibrationRunning = false;

  protected handHintController: HandHintsController = null;

  onAwake() {
    this.visualParentTrans.setLocalScale(vec3.zero());
    this.iconTrans = this.circleAnim.getSceneObject().getTransform();

    // If confirm text is disabled, make sure any existing text is cleared once
    if (this.confirmText != null && !this.showConfirmText) {
      this.confirmText.text = "";
    }
  }

  init(handHints: HandHintsController) {
    this.handHintController = handHints;
    this.onMobileConnnectionStateChange(this.isMobileConnected());
  }

  onDestroy() {
    print("SurfaceDetector destroyed");
    if (this.hitTestSession != null) {
      this.hitTestSession.stop();
      this.hitTestSession = null;
    }
    if (this.updateEvent != null) {
      this.removeEvent(this.updateEvent);
      this.updateEvent = null;
    }
    if (this.animCancel) this.animCancel.cancel();
  }

  startSurfaceCalibration(callback: (pos: vec3, rot: quat) => void): void {
    this.isCalibrationRunning = true;
    this.circleAnim.reset();
    this.animateVisuals(true, null);
    this.onCompleteCallback = callback;
    this.updateEvent = this.createEvent("UpdateEvent");
    this.updateEvent.bind(this.update.bind(this));
  }

  onHoverEnter() {
    // change instruction text while hovering / dragging
    if (this.confirmText != null && this.showConfirmText) {
      this.confirmText.text = this.getHoverText();
    }
  }

  onHoverExit() {
    // change instruction text back to idle while calibration is running
    if (
      this.confirmText != null &&
      this.isCalibrationRunning &&
      this.showConfirmText
    ) {
      this.confirmText.text = this.getIdleText(this.isMobileConnected());
    }
  }

  onInteractionCanceled() {}

  onInteractionStart() {}

  onInteractionEnd() {}

  protected isLookingAtCalibrationIcon() {
    var camComp = this.cameraTransform.getSceneObject().getComponent("Camera");
    return camComp.isSphereVisible(this.iconTrans.getWorldPosition(), 10);
  }

  protected animateVisuals(animateIn: boolean, callback: () => void) {
    if (this.animCancel) this.animCancel.cancel();
    var start = animateIn ? vec3.zero() : vec3.one();
    var end = animateIn ? vec3.one() : vec3.zero();
    const easingType = animateIn
      ? ("ease-out-cubic" as "ease-out-cubic")
      : ("ease-in-cubic" as "ease-in-cubic");
    animate({
      easing: easingType,
      duration: 0.5,
      update: (t: number) => {
        this.visualParentTrans.setLocalScale(vec3.lerp(start, end, t));
      },
      ended: callback,
      cancelSet: this.animCancel,
    });
  }

  protected startHitTestSession() {
    try {
      this.worldQueryModule =
        require("LensStudio:WorldQueryModule") as WorldQueryModule;
      const options = HitTestSessionOptions.create();
      options.filter = true;
      this.hitTestSession =
        this.worldQueryModule.createHitTestSessionWithOptions(options);
      this.hitTestSession.start();
    } catch (e) {
      print("Hit test error: " + e);
    }
  }

  protected onMobileConnnectionStateChange(isConnected: boolean) {
    // change instruction text based on connection state
    if (this.confirmText != null && this.showConfirmText) {
      this.confirmText.text = this.getIdleText(isConnected);
    }
  }

  protected isMobileConnected() {
    return SIK.MobileInputData.isAvailable();
  }

  protected update() {
    var isMobileAvailable = SIK.MobileInputData.isAvailable();
    if (this.mobileConnected != isMobileAvailable) {
      this.mobileConnected = isMobileAvailable;
      this.onMobileConnnectionStateChange(this.mobileConnected);
    }
  }

  protected onCalibrationComplete(callback: () => void) {
    this.isCalibrationRunning = false;
    print("Calibration complete..");
    //remove events
    this.removeEvent(this.updateEvent);
    this.updateEvent = null;
    //delay stop hit test session
    var delay = this.createEvent("DelayedCallbackEvent");
    delay.bind(() => {
      if (this.hitTestSession != null) {
        print("Stopping hit test session...");
        this.hitTestSession.stop();
        this.hitTestSession = null;
      }
    });
    delay.reset(0.1);
    //play audio
    this.getSceneObject()
      .getParent()
      .getComponent("Component.AudioComponent")
      .play(1);

    //animate circle
    this.onAnimCompleteCallback = callback;
    this.circleAnim.animateCircleIn(() => {
      this.animateVisuals(false, this.onAnimCompleteCallback());
    });
  }

  // Helpers for configurable text with sensible defaults

  private getHoverText(): string {
    if (this.hoverText != null && this.hoverText.length > 0) {
      return this.hoverText;
    }
    // original default
    return "Drag to Move";
  }

  private getMobileConfirmText(): string {
    if (this.mobileConfirmText != null && this.mobileConfirmText.length > 0) {
      return this.mobileConfirmText;
    }
    // original default
    return "Tap to Confirm";
  }

  private getSpectaclesConfirmText(): string {
    if (
      this.spectaclesConfirmText != null &&
      this.spectaclesConfirmText.length > 0
    ) {
      return this.spectaclesConfirmText;
    }
    // original default
    return "Pinch to Confirm";
  }

  private getIdleText(isConnected: boolean): string {
    return isConnected
      ? this.getMobileConfirmText()
      : this.getSpectaclesConfirmText();
  }
}
