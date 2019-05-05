import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Component | camera/view-finder', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.playStub = sinon.stub();
    this.videoEl = document.createElement('video');

    this.videoEl.play = this.playStub;
  });

  hooks.afterEach(function () {
    sinon.reset();
  });

  test(
    '<ViewFinder /> set it\'s properties when `onInsert` is called',
    async function(assert) {
      const component = this.owner.lookup('component:camera/view-finder');

      await component.onInsert(this.videoEl);

      assert.equal(
        this.playStub.calledOnce,
        true,
        '`onInsert` attempts to call `play` on the passed video element'
      );

      assert.equal(
        component.isStreaming,
        true,
        '`onInsert` sets `isStreaming` to `true`'
      );
    }
  );
});
