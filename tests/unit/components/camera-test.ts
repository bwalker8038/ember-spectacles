import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Component | camera', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.getUserMediaStub = sinon.stub();
    this.getVideoTracksStub = sinon.stub();
    this.getSettingsStub = sinon.stub();
    this.getCapabilitiesStub = sinon.stub();
    this.stopStub = sinon.stub();

    this.mediaTrackSettings = {
      deviceId: "nyiD4WMdtmrXpSA7hV9DKG9gINFHIG701gRP"
    };

    this.mediaTrackCapabilities = {
      deviceId: "nyiD4WMdtmrXpSA7hV9DKG9gINFHIG701gRP"
    };

    this.mediaDevice = {
      id: "nyiD4WMdtmrXpSA7hV9DKG9gINFHIG701gRP",
      getVideoTracks: this.getVideoTracksStub
    };

    this.mediaTrack = {
      id: "12331b84-23f0-478a-8963-cd7a00ce5b0d",
      getSettings: this.getSettingsStub,
      getCapabilities: this.getCapabilitiesStub,
      stop: this.stopStub
    };



    this.getUserMediaStub
      .returns(new Promise((resolve) =>
        resolve(this.mediaDevice)
      ));

    this.getVideoTracksStub
      .returns([this.mediaTrack]);

    this.getSettingsStub
      .returns(this.mediaTrackSettings);

    this.getCapabilitiesStub
      .returns(this.mediaTrackCapabilities);
  });

  hooks.afterEach(function () {
    sinon.reset();
  });

  test(
    '<Camera /> properties are set when `openMediaStream` is called and `isStreaming` is `true`',
    async function(assert) {
      navigator.mediaDevices.getUserMedia = this.getUserMediaStub;

      const component = this.owner.lookup('component:camera');

      const constraints = {
        video: { facingMode: 'user' }
      } as MediaStreamConstraints

      component.set('isStreaming', true);
      await component.openMediaStream(constraints);

      assert.equal(
        component.stream.id,
        this.mediaDevice.id,
        'When `openMediaStream` is invoked, `stream` is set'
      );

      assert.equal(
        component.mediaTrack.id,
        this.mediaTrack.id,
        'When `openMediaStream` is invoked, `mediaTrack` is set'
      );

      assert.equal(
        component.mediaTrack.id,
        this.mediaTrack.id,
        'When `openMediaStream` is invoked, `mediaTrack` is set'
      );

      assert.equal(
        component.trackSettings.deviceId,
        this.mediaTrackSettings.deviceId,
        'When `openMediaStream` is invoked, `trackSettings` is set'
      );

      assert.equal(
        component.trackCapabilities.deviceId,
        this.mediaTrackCapabilities.deviceId,
        'When `openMediaStream` is invoked, `trackCapabilities` is set'
      );
  });

  test(
    '<Camera /> properties are not set when `openMediaStream` is called and `isStreaming` is `false`',
    async function(assert) {
      navigator.mediaDevices.getUserMedia = this.getUserMediaStub;

      const component = this.owner.lookup('component:camera');

      const constraints = {
        video: { facingMode: 'user' }
      } as MediaStreamConstraints

      component.set('isStreaming', false);
      await component.openMediaStream(constraints);

      assert.equal(
        component.trackSettings,
        undefined,
        'When `openMediaStream` is invoked, `trackSettings` is `undefined`'
      );

      assert.equal(
        component.trackCapabilities,
        undefined,
        'When `openMediaStream` is invoked, `trackCapabilities` is `undefined`'
      );
  });

  test(
    '`updateStreamConstraints` invokes correctly',
    async function(assert) {
      navigator.mediaDevices.getUserMedia = this.getUserMediaStub;

      const component = this.owner.lookup('component:camera');

      const constraints = {
        video: { facingMode: 'user' }
      } as MediaStreamConstraints

      const openMediaStreamStub = sinon.stub();
      component.openMediaStream = openMediaStreamStub;

      await component.updateStreamConstraints(
        this.mediaTrack as MediaStreamTrack,
        constraints
      );

      assert.equal(
        openMediaStreamStub.calledOnce,
        true,
        'When `updateStreamConstraints` is invoked, `openMediaStream` is called'
      );

      assert.equal(
        this.stopStub.calledOnce,
        true,
        'When `updateStreamConstraints` is invoked, it attempts to stop the stream'
      );
  });
});
