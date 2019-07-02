import Component from '@ember/component';
import { action } from '@ember/object';
import { debug } from '@ember/debug';
import { tryInvoke } from '@ember/utils';
import { reads } from '@ember/object/computed';

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
   * TODO: Fix the type here
   */
  @reads('trackCapabilities.zoom')
  public zoomCapabilities: any;

  /**
   * Getter that exposes the  current `zoom` value from the currently playing track
   * TODO: Fix the type here
   */
  @reads('trackSettings.zoom')
  public zoomSetting?: any;

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
