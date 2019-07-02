import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { debug } from '@ember/debug';
import { and, gte } from '@ember/object/computed';

export default class CameraSensorToggle extends Component {
  public tagName = '';

  /**
   * A list of available camera sensors
   */
  public sensors?: MediaDeviceInfo[];

  /**
   * Media Track Settings bag
   */
  public trackSettings?: MediaTrackSettings;

  /**
   * current selected sensor index
   */
  public sensorIndex = 0;

  /**
   * Function passed from the `<Camera />` component that applies a new
   * `MediaTrackConstraints` object to the current `MediaStreamTrack`
   */
  public updateStreamConstraints?: (
    mediaTrack: MediaStreamTrack,
    constraints: MediaTrackConstraints
  ) => Promise<void>;

  /**
   * If the number of sensors is two or more, show the toggle
   */
  @gte('sensors.length', 2)
  public hasEnoughSensors?: Boolean;

  @and('hasEnoughSensors', 'trackSettings')
  public showToggle?: Boolean;

  /**
   * Getter exposes the currently selected sensor
   */
  @computed('sensors', 'sensorIndex')
  public get currentSensor() {
    return this.sensors![this.sensorIndex];
  }

  /**
   * Action toggles the current selected sensor
   *
   * @async
   * @method toggleSensor
   *
   * @return {Promise<void>}
   */
  @action
  public async toggleSensor() {
    if (this.sensorIndex < this.sensors!.length) {
      this.incrementProperty('sensorIndex');
    } else {
      this.sensorIndex = 0;
    }

    const { deviceId } = this.currentSensor;

    const constraints = {
      deviceId: { exact: deviceId }
    };

    try {
      await tryInvoke(this, 'updateStreamConstraints', [constraints]);
    } catch (error) {
      debug(error);
    }
  }

  /**
   * Action sets up the initial state of the component `onInsert`
   *
   * @async
   * @method onInsert
   * @param {HTMLElement} _el - the mounted element
   * @param {MediaDeviceInfo[]} sensors
   *
   * @return {void}
   */
  @action
  public onInsert(
    _el: HTMLElement,
    [sensors]: [MediaDeviceInfo[]]
) {
    sensors
      .forEach(({deviceId}, idx) => {
        if (this.trackSettings!.deviceId === deviceId) {
          this.sensorIndex = idx;
        } else {
          return;
        }
      });
  }
};

