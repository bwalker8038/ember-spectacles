import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { debug } from '@ember/debug';
import { tryInvoke } from '@ember/utils';

/**
 * Component defines the zoom slider control
 */
export default class CameraZoomSlider extends Component {
  public tagName = '';

  /**
   * Function passed from the `<Camera />` component that applies a new
   * `MediaTrackConstraints` object to the current `MediaStreamTrack`
   */
  public applyConstraints?: (
    mediaTrack: MediaStreamTrack,
    newConstriants: MediaTrackConstraints
  ) => Promise<void>;

  /**
   * The current `MediaTrack`'s settings bag
   */
  public trackSettings?: MediaTrackSettings;

  /**
   * The current `MediaTrack`'s capabilities bag
   */
  public trackCapabilities?: MediaTrackCapabilities;


  /**
   * Getter that exposed the `zoom` object from the capabilities bag
   */
  @computed('trackCapabilities')
  public get zoomCapabilities() {
    if (!this.trackCapabilities) {
      return undefined;
    }

    console.log(this.trackCapabilities);
    return this.trackCapabilities.zoom;
  }

  /**
   * Getter that exposes the  current `zoom` value from the currently playing track
   */
  @computed('trackSettings')
  public get zoomSetting() {
    if (!this.trackSettings) {
      return undefined;
    }
    console.log('settings', this.trackSettings);
    return this.trackSettings.zoom;
  }

  /**
   * Action applies the selected zoom level against the current
   * `MediaStreamTrack`'s constraints
   *
   * @async
   * @method applyZoom
   * @param {string} value - the currernt zoom level
   *
   * @return {Promise<void>}
   */
  @action
  public async applyZoom(
    value: string
 ) {
    const zoom = parseInt(value, 10);
    const constraints = {
      advanced: [{
        zoom
      }]
    } as unknown as MediaTrackConstraints;

    try {
      await tryInvoke(this, 'applyConstraints', [constraints]);
    } catch (error) {
      debug(error);
    }
  }
};
