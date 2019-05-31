import Component from '@ember/component';
import EmberError from '@ember/error';
import { computed, action } from '@ember/object';
import { debug } from '@ember/debug';

/**
 * HoC component that defines a camera. This component will set up the media
 * stream, grab the device capabilities and settings and pass the properties to
 * sub components.
 *
 * @example ```
 *  <Camera as @constraints={model.constraints} |c|>
 *    <c.viewFinder />
 *    <c.shutter @onCapture={{action "onCaptureHandler" blob}} />
 *  </Camera>
 * ```
 */
export default class Camera extends Component {
  public tagName = '';

  /**
   * The `MediaStream` for the current device
   */
  public stream?: MediaStream;

  /**
   * The `MediaTrack` from the `MediaStream`, passed to the `ViewFinder`
   */
  public mediaTrack?: MediaStreamTrack;

  /**
   * The `MediaStreamConstraints` settings passed to `getUserMedia`
   */
  public constraints?: MediaStreamConstraints;


  /**
   * Boolean flag that determines if the `ViewFinder` has begun it's stream
   * this flag is needed due to this bug in chrome: https://crbug.com/711524
   */
  public isStreaming = false;

  /**
   * List containing the available media devices
   */
   public devices?: MediaDeviceInfo[];

  @computed('devices')
  public get cameras() {
    if (!this.devices) {
      return undefined;
    }

    return this.devices!
      .reduce((
        acc: MediaDeviceInfo[],
        device: MediaDeviceInfo
      ) => {
        if (device.kind === 'videoinput') {
          acc.push(device);
        }

        return acc;
    }, []) as MediaDeviceInfo[];
  }
  /**
   * Settings bag that contains the media device's settings
   */
  @computed('mediaTrack', 'isStreaming')
  public get trackSettings(): MediaTrackSettings | undefined {
    if (!this.isStreaming) {
      return undefined;
    }

    console.log(this.mediaTrack!.getSettings());
    return this.mediaTrack!.getSettings();
  }


  /**
   * Settings bag that containts the media device's capabilities
   */
  @computed('mediaTrack', 'isStreaming')
  public get trackCapabilities(): MediaTrackCapabilities | undefined {
    if(!this.isStreaming) {
      return undefined;
    }

    console.log('cap', this.mediaTrack!.getCapabilities());
    return this.mediaTrack!.getCapabilities();
  }


  /**
   * Get's a media media stream from a user's device and sets the internal
   * state of the component on a successful `getUserMedia` call
   *
   * @async
   * @method openMediaStream
   * @param {MediaStreamConstraints} constraints - The passed constraints
   * @return {Promise<void>} Returns an empty promise
   */
  public async openMediaStream(
    constraints: MediaStreamConstraints
  ) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const [mediaTrack] = stream.getVideoTracks();
      const devices = await navigator.mediaDevices.enumerateDevices();

      this.setProperties({ stream, mediaTrack, devices });
    } catch (err) {
      debug(err);
    }
  }

  /**
   * Set's the new constraints on the components `mediaStream` and restarts
   * the stream
   *
   * @async
   * @method updateStreamConstraints
   * @param {MediaStreamTrack} mediaTrack - the current mediaStream
   * @param {MediaStreamConstraints} constraints - the new constraints
   * that will be applied to the current stream
   *
   * @return {Promise<void>} Returns an empty promise
   */
  public async updateStreamConstraints(
    mediaTrack: MediaStreamTrack,
    constraints: MediaStreamConstraints
  ) {
    mediaTrack.stop();
    try {
      await this.openMediaStream(constraints);
    } catch (err) {
      debug(err);
    }
  }

  /**
   *
   * @param {MediaStreamTrack} mediaTrack - the current mediaTrack
   * @param {MediaTrackConstraints} newConstriants - the new set of constraints to
   * be applied to the passed mediaTrack
   */
  public async applyConstraints(
    mediaTrack: MediaStreamTrack,
    newConstriants: MediaTrackConstraints
  ) {
    try {
      await mediaTrack.applyConstraints(newConstriants);
    } catch (error) {
     debug(error) ;
    }
  }

  /**
   * Action set's up the media stream. This is fired after the component has been
   * inserted.
   *
   * @param {HTMLElement} _el - the wrapping component
   * @param {MediaStreamConstraints[]} [constraints] - the track's constraints
   *
   * @return {void}
   */
  @action
  public async onInsert(
    _el: HTMLElement,
    [constraints]: MediaStreamConstraints[]
  ) {

    if (!constraints) {
      throw new EmberError('`constraints` must be defined on the `<Camera />` component')
    }

    try {
      await this.openMediaStream(constraints);
    } catch (error) {
      debug(error);
    }
  }
};
