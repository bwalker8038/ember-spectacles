import Component from '@ember/component';
import { action } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { debug } from 'util';

/**
 * Component defines the shutter button that captures an image  from the
 * current media stream
 */
export default class CameraShutter extends Component {
  public tagName = '';

  /**
   * CB Function passed from the parent component that fires when an imageBlog
   *  was successfully captured
   */
  public onCaptureImage?<T>(blob: Blob): T;


  /**
   * Action capture's an image as a blog from the currnet stream context
   *
   * @async
   * @param {MediaStream} stream - the current media stream
   *
   * @return {Promise<void>}
   */
  @action
  public async captureImage(stream: MediaStream) {
    const [frame] = stream.getVideoTracks();
    const imageCapture = new ImageCapture(frame);

    try {
      const imageBlob: Blob = await imageCapture.takePhoto();
      return tryInvoke(this, 'onCaptureImage', [imageBlob]);
    } catch(error) {
      return debug(error);
    }
  }
};
