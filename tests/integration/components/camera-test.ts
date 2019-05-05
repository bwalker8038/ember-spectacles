import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | camera', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.getUserMediaStub = sinon.stub();
    this.getVideoTracksStub = sinon.stub();

    this.getUserMediaStub
      .returns(new Promise((resolve) =>
        resolve({
          active: true,
          id: "nyiD4WMdtmrXpSA7hV9DKG9gINFHIG701gRP",
          onactive: null,
          onaddtrack: null,
          oninactive: null,
          onremovetrack: null,
          getVideoTracks: this.getVideoTracksStub
        })
      ));

      this.getVideoTracksStub
        .returns([{
          contentHint: "",
          enabled: true,
          id: "12331b84-23f0-478a-8963-cd7a00ce5b0d",
          kind: "video",
          label: "FaceTime HD Camera",
          muted: false,
          onended: null,
          onmute: null,
          onunmute: null,
          readyState: "live"
        }]);
  });

  hooks.afterEach(function () {
    sinon.reset();
  });

  test(
    'The <Camera /> component renders',
    async function(assert) {
      navigator.mediaDevices.getUserMedia = this.getUserMediaStub;
      const constraints = { video: { facingMode: 'user' }} as MediaStreamConstraints;

      this.set('constraints', constraints);

      await render(hbs`
        <Camera @constraints={{constraints}} />
      `);

      assert.equal(
        this.getUserMediaStub.calledOnce,
        true,
        'When <Camera /> is mounted, it attempts to call `getUserMedia`'
      );

      assert.equal(
        this.getVideoTracksStub.calledOnce,
        true,
        'When <Camera /> is mounted, it attempts to call `getVideoTracks`'
      );
  });
});
