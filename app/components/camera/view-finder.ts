import Component from '@ember/component';
import { debug } from '@ember/debug';
import { action } from '@ember/object';
import { run } from '@ember/runloop';

/**
 * Component defines the camera's "view-finder" as a `HTMLVideoElement`
 */
export default class CameraViewFinder extends Component {
  public tagName = '';

  /**
   * The `MediaStream` for the current device
   */
  public stream?: MediaStream;

  /**
   * Boolean flag that determines if the `ViewFinder` has begun it's stream
   * this flag is needed due to this bug in chrome: https://crbug.com/711524
   */
  public isStreaming?: Boolean;

  /**
   * Action set's up the media stream. This is fired after the component has been
   * inserted.
   *
   * @param {HTMLVideoElement} element - the video element
   *
   * @return {void}
   */
  @action
  public async onInsert(
    element: HTMLVideoElement
  ) {
    try {
      await element.play();
      // set the stream after 100ms because of this bug: https://crbug.com/711524
      run.later(() => this.set('isStreaming', true), 100);
    } catch (error) {
      debug(error);
    }
  }
};
