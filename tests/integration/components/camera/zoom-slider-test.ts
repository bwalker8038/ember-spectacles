import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | camera/zoom-slider', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.applyConstraintsStub = sinon.stub();

    this.trackCapabilities = {
      zoom: {
        max: 7,
        min: 1,
        step: 0.1
      }
    } as MediaTrackCapabilities;

    this.trackSettings = {
      aspectRatio: 0.75,
      colorTemperature: 0,
      deviceId: "0f521e8f2169851b04218c3e05651142c1b885e7490d338085f49868ec6da43c",
      exposureCompensation: 0,
      exposureMode: "continuous",
      exposureTime: 109,
      facingMode: "environment",
      focusDistance: 0,
      focusMode: "continuous",
      frameRate: 30,
      groupId: "175f8c9bcc8a9acd423c7188b562f6646424b95706dd1861d14507736086e99a",
      height: 640,
      iso: 100,
      resizeMode: "none",
      torch: false,
      whiteBalanceMode: "continuous",
      width: 480,
      zoom: 1
    } as MediaTrackSettings;
  });

  hooks.afterEach(function () {
    sinon.reset();
  });

  test('The zoom-slider component renders', async function(assert) {
    await render(hbs`
      {{camera/zoom-slider
        trackSettings=this.trackSettings
        trackCapabilities=this.trackCapabilities
        applyConstraints=this.applyConstraintsStub
      }}
    `);

    const slider: HTMLInputElement = this.element.querySelector('.js-zoom-slider')

    assert.equal(
      slider.min,
      this.trackCapabilities.zoom.min,
      'When `trackCapabilities` is set, the input\'s `min` value is set'
    );

    assert.equal(
      slider.max,
      this.trackCapabilities.zoom.max,
      'When `trackCapabilities` is set, the input\'s `max` value is set'
    );

    assert.equal(
      slider.step,
      this.trackCapabilities.zoom.step,
      'When `trackCapabilities` is set, the input\'s `step` value is set'
    );

    assert.equal(
      slider.value,
      this.trackSettings.zoom,
      'When `trackSettings` is passed, the input\'s initial value is set'
    );
  });

  test('Zoom is updated onInput', async function(assert) {
    await render(hbs`
      {{camera/zoom-slider
        trackSettings=this.trackSettings
        trackCapabilities=this.trackCapabilities
        applyConstraints=this.applyConstraintsStub
      }}
    `);

    const slider: HTMLInputElement = this.element.querySelector('.js-zoom-slider')

    const event = new Event('input', {
      'bubbles': true,
      'cancelable': true
    });

    slider.value = '2';
    slider.dispatchEvent(event);

    assert.equal(
      this.applyConstraintsStub.calledOnce,
      true,
      'onInput, zoom-slider attempts to trigger `appyConstraints`'
    );
  });
});
