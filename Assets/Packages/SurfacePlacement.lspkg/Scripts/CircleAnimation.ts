import animate, {
  CancelSet,
} from "SpectaclesInteractionKit.lspkg/Utils/animate";

const START_SIZE = 0;
const END_SIZE = 1;

@component
export class CircleAnimation extends BaseScriptComponent {
  // Configurable colors for idle and hover states; defaults match original behavior
  @input idleColor: vec4 = new vec4(1, 1, 1, 1);
  @input hoverColor: vec4 = new vec4(1, 1, 1, 1);

  private rend = this.getSceneObject().getComponent(
    "Component.RenderMeshVisual"
  );
  private completeCancel: CancelSet = new CancelSet();

  setLoadingAmount(amount: number) {
    this.rend.mainPass.InnerCircleMask = amount;
    if (amount > 0.1) {
      this.rend.mainPass.AnimationSwitch = false;
    }
  }

  enableScanAnimation(enabled: boolean) {
    this.rend.mainPass.AnimationSwitch = enabled;
  }

  setCircleColor(color: vec4) {
    this.rend.mainPass.dotsColor = color;
    this.rend.mainPass.circleColor = color;
  }

  setLoadingColor(isIdle: boolean) {
    this.rend.mainPass.whiteColor = isIdle
      ? this.getIdleColor()
      : this.getHoverColor();
  }

  reset() {
    this.rend.mainPass.AnimationSwitch = true;
    this.rend.mainPass.Thickness = START_SIZE;
  }

  animateCircleOut(callback: () => void) {
    if (this.completeCancel) this.completeCancel.cancel();
    animate({
      easing: "ease-out-cubic",
      duration: 0.5,
      update: (t: number) => {
        this.rend.mainPass.Amount = 1;
        this.rend.mainPass.Thickness = MathUtils.lerp(START_SIZE, END_SIZE, t);
      },
      ended: callback,
      cancelSet: this.completeCancel,
    });
  }

  animateCircleIn(callback: () => void) {
    if (this.completeCancel) this.completeCancel.cancel();
    animate({
      easing: "ease-in-cubic",
      duration: 0.5,
      update: (t: number) => {
        this.rend.mainPass.Amount = 1;
        this.rend.mainPass.Thickness = MathUtils.lerp(END_SIZE, START_SIZE, t);
      },
      ended: callback,
      cancelSet: this.completeCancel,
    });
  }

  animateCircleFull(callback: () => void) {
    if (this.completeCancel) this.completeCancel.cancel();
    animate({
      easing: "linear",
      duration: 0.5,
      update: (t: number) => {
        this.rend.mainPass.Amount = 1;
        this.rend.mainPass.Thickness = this.PingPong(START_SIZE, END_SIZE, t);
      },
      ended: callback,
      cancelSet: this.completeCancel,
    });
  }

  private PingPong(min: number, max: number, t: number): number {
    const range = max - min;
    const scaledT = t * Math.PI;
    return min + Math.sin(scaledT) * range;
  }

  private getIdleColor(): vec4 {
    if (this.idleColor) {
      // if user set any non-zero value, trust it
      if (
        this.idleColor.x !== 0 ||
        this.idleColor.y !== 0 ||
        this.idleColor.z !== 0 ||
        this.idleColor.w !== 0
      ) {
        return this.idleColor;
      }
    }
    // original idle color
    return new vec4(1, 1, 1, 1);
  }

  private getHoverColor(): vec4 {
    if (this.hoverColor) {
      if (
        this.hoverColor.x !== 0 ||
        this.hoverColor.y !== 0 ||
        this.hoverColor.z !== 0 ||
        this.hoverColor.w !== 0
      ) {
        return this.hoverColor;
      }
    }
    // original hover (loading) color
    return new vec4(1, 1, 1, 1);
  }
}
