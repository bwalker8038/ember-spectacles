import Component from '@ember/component';
import { debug } from '@ember/debug';
import { action } from '@ember/object';

export default class CameraViewFinder extends Component {
  public tagName = ''

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
      this.set('isStreaming', true);
    } catch (error) {
      debug(error);
    }
  }
};
