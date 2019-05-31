import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { debug } from '@ember/debug';

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
   * Function passed from the `<Camera />` component that applies a new
   * `MediaTrackConstraints` object to the current `MediaStreamTrack`
   */
  public updateStreamConstraints?: (
    mediaTrack: MediaStreamTrack,
    constraints: MediaTrackConstraints
  ) => Promise<void>;

  @action
  public async toggleSensor() {
    const [availableDevices] = this.sensors!
      .filter(({ deviceId }) => this.trackSettings!.deviceId !== deviceId);

    const { deviceId } = this.sensors;

    const constraints = {
      deviceId: { exact: deviceId }
    };

    try {
      await tryInvoke(this, 'updateStreamConstraints', [constraints]);
    } catch (error) {
      debug(error);
    }
  }
};

