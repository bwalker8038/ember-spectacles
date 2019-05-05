import Component from '@ember/component';
import { debug } from '@ember/debug';

export default class CameraViewFinder extends Component {
  public tagName = 'video'

  public attributeBindings = ['stream:srcObject'];

  public stream?: MediaStream;

  public isStreaming?: Boolean;

  /**
   * @override
   */
  public async didInsertElement() {
    this._super(...arguments);

    try {
      await (this.element as HTMLVideoElement).play();
      this.set('isStreaming', true);
    } catch (error) {
      debug(error);
    }
  }
};
