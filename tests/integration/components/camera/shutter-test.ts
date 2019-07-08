import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const ImageCaptureOld = ImageCapture;

module('Integration | Component | camera/shutter', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    class ImageCaptureStub {
      takePhoto = sinon.stub();
    }

    window.ImageCapture = ImageCaptureStub;

    this.getVideoTrackStub = sinon.stub();
    this.onCaptureImageStub = sinon.stub();

    this.stream = {
      active: true,
      id: "{1820429d-411a-8348-b200-c6c9b61373af}",
      onaddtrack: null,
      onremovetrack: null,
      getVideoTracks: this.getVideoTrackStub
    } as MediaStream;

    const frame = {
      enabled: true,
      id: "{73697aab-44b9-e54a-8ebe-b3dc3f528be9}",
      kind: "video",
      label: "FaceTime HD Camera",
      muted: false,
      onended: null,
      onmute: null,
      onunmute: null,
      readyState: "live"
    } as MediaStreamTrack;

    this.getVideoTrackStub
      .returns([frame]);
  });

  hooks.afterEach(function () {
    window.ImageCapture = ImageCaptureOld;
    sinon.reset();
  });

  test('The shutter button function properly', async function(assert) {
    this.setProperties({
      stream: this.stream,
      onCaptureImage: this.onCaptureImageStub
    });

    await render(hbs`
      {{#camera/shutter
          stream=this.stream
          onCaptureImage=onCaptureImage
      }}
        take a photo
      {{/camera/shutter}}
    `);

    const button: HTMLButtonElement = this.element.querySelector('.js-shutter-button');

    await click(button);

    assert.equal(
      true,
      this.getVideoTrackStub.calledOnce,
      'The component attempts to call `getVideoTracks` on click');

    assert.equal(
      true,
      this.onCaptureImageStub.calledOnce,
      'The component attempts to call `onCaptureImage` on click'
    )
  });
});
