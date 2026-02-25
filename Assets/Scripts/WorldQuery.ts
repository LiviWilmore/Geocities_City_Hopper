
// An adapted WorldQuery script with additional functionality for blocking interactions while the Random Internet Button is being pressed.

// Assets/NewWorldQuery.ts

const WorldQueryModule = require("LensStudio:WorldQueryModule");
const SIK = require("SpectaclesInteractionKit.lspkg/SIK").SIK;
const InteractorTriggerType =
    require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor")
        .InteractorTriggerType;

const EPSILON = 0.01;

@component
export class NewScript extends BaseScriptComponent {

    private primaryInteractor: any;
    private hitTestSession: HitTestSession;

    @input
    indexToSpawn: number = 0;            

    @input
    targetObject: SceneObject;           

    @input
    objectsToSpawn: SceneObject[];       

    @input
    filterEnabled: boolean = true;

   
    @input("Component.InteractionComponent[]")
    blockingInteractions: any[] = [];

    
    @input("Component.AudioComponent")
    placeStickerAudio: any;

   
    private activeBlockers: number = 0;

  
    @input
    placeComputerObject: SceneObject;

 
    private lastPcPos: vec3 | null = null;
    private pcMovingFrames: number = 0;

    
    private spawnedStickers: SceneObject[] = [];

   

    onAwake() {
        this.hitTestSession = this.createHitTestSession(this.filterEnabled);

        if (!this.targetObject) {
            print("NewWorldQuery: Please set Target Object input");
            return;
        }

        this.targetObject.enabled = false;

    
        this.indexToSpawn = this.clampIndex(this.indexToSpawn);
        this.updatePreview();

        
        this.setupBlockingInteractions();

        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }


    private setupBlockingInteractions(): void {
        if (!this.blockingInteractions || this.blockingInteractions.length === 0) {
            return;
        }

        for (let i = 0; i < this.blockingInteractions.length; i++) {
            const ic = this.blockingInteractions[i];
            if (!ic) { continue; }

            ic.onSelectStart.add(() => {
                this.activeBlockers++;
            });

            ic.onSelectEnd.add(() => {
                this.activeBlockers = Math.max(0, this.activeBlockers - 1);
            });
        }
    }

   
    private updatePlaceComputerMoving(): void {
        if (!this.placeComputerObject) {
            return;
        }

        const currentPos = this.placeComputerObject
            .getTransform()
            .getWorldPosition();

        if (this.lastPcPos === null) {
            this.lastPcPos = currentPos;
            this.pcMovingFrames = 0;
            return;
        }

        const dist = currentPos.distance(this.lastPcPos);
        this.lastPcPos = currentPos;

        const THRESHOLD = 0.0005; 

        if (dist > THRESHOLD) {

            this.pcMovingFrames = 3;
        } else if (this.pcMovingFrames > 0) {
            this.pcMovingFrames--;
        }
    }

   
    private get isBlocked(): boolean {
        const hasInteractionBlock = this.activeBlockers > 0;
        const isComputerMoving = this.pcMovingFrames > 0;
        return hasInteractionBlock || isComputerMoving;
    }

    

    public selectValue0(): void { this.setSelectedIndex(0); }
    public selectValue1(): void { this.setSelectedIndex(1); }
    public selectValue2(): void { this.setSelectedIndex(2); }
    public selectValue3(): void { this.setSelectedIndex(3); }
    public selectValue4(): void { this.setSelectedIndex(4); }
    public selectValue5(): void { this.setSelectedIndex(5); }

    
    public resetStickers(): void {
        
        for (let i = 0; i < this.spawnedStickers.length; i++) {
            const obj = this.spawnedStickers[i];
            if (obj) {
                obj.destroy();
            }
        }
        this.spawnedStickers = [];

        if (this.targetObject) {
            this.targetObject.enabled = false;
        }
    }


    public setSelectedIndex(index: number): void {
        this.indexToSpawn = this.clampIndex(index);
        this.updatePreview();
    }

    private clampIndex(i: number): number {
        if (!this.objectsToSpawn || this.objectsToSpawn.length === 0) {
            return 0;
        }
        let idx = Math.floor(i);
        if (idx < 0) idx = 0;
        if (idx >= this.objectsToSpawn.length) idx = this.objectsToSpawn.length - 1;
        return idx;
    }

    private updatePreview(): void {
        if (!this.objectsToSpawn) {
            return;
        }
        for (let i = 0; i < this.objectsToSpawn.length; i++) {
            this.objectsToSpawn[i].enabled = (i === this.indexToSpawn);
        }
    }


    private createHitTestSession(filterEnabled: boolean) {
        const options = HitTestSessionOptions.create();
        options.filter = filterEnabled;
        return WorldQueryModule.createHitTestSessionWithOptions(options);
    }

    private onHitTestResult(results: WorldQueryHitTestResult | null) {
        if (this.isBlocked) {
            this.targetObject.enabled = false;
            return;
        }

        if (results === null) {
            this.targetObject.enabled = false;
            return;
        }

        this.targetObject.enabled = true;

        const hitPosition = results.position;
        const hitNormal = results.normal;

        let lookDirection: vec3;
        if (1 - Math.abs(hitNormal.normalize().dot(vec3.up())) < EPSILON) {
            lookDirection = vec3.forward();
        } else {
            lookDirection = hitNormal.cross(vec3.up());
        }

        const toRotation = quat.lookAt(lookDirection, hitNormal);

        this.targetObject.getTransform().setWorldPosition(hitPosition);
        this.targetObject.getTransform().setWorldRotation(toRotation);

        if (
            this.primaryInteractor &&
            this.primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
            this.primaryInteractor.currentTrigger === InteractorTriggerType.None
        ) {
            if (this.isBlocked) {
                return;
            }

            const idx = this.clampIndex(this.indexToSpawn);
            const source = this.objectsToSpawn && this.objectsToSpawn[idx];

            if (!source) {
                print("NewWorldQuery: objectsToSpawn has no entry at index " + idx);
                return;
            }

            const parent = source.getParent();
            const newObject = parent.copyWholeHierarchy(source);
            newObject.setParentPreserveWorldTransform(null);

            this.spawnedStickers.push(newObject);

            if (this.placeStickerAudio && idx !== 1) {
                this.placeStickerAudio.play(1.0);
            }
        }
    }

    private onUpdate() {
        this.updatePlaceComputerMoving();

        this.primaryInteractor = SIK.InteractionManager.getTargetingInteractors().shift();

        if (
            this.primaryInteractor &&
            this.primaryInteractor.isActive() &&
            this.primaryInteractor.isTargeting()
        ) {
            if (this.isBlocked) {
                this.targetObject.enabled = false;
                return;
            }

            const rayStartOffset = new vec3(
                this.primaryInteractor.startPoint.x,
                this.primaryInteractor.startPoint.y,
                this.primaryInteractor.startPoint.z + 30
            );
            const rayStart = rayStartOffset;
            const rayEnd = this.primaryInteractor.endPoint;

            this.hitTestSession.hitTest(rayStart, rayEnd, this.onHitTestResult.bind(this));
        } else {
            this.targetObject.enabled = false;
        }
    }
}
