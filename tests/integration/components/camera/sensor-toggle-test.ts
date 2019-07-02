import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | camera/sensor-toggle', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.updateStreamConstraintsStub = sinon.stub();

    this.trackSettings = {
      aspectRatio: 0.75,
      colorTemperature: 0,
      deviceId: "abc123",
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

  test('The sensor toggle component renders', async function (assert) {
    const sensors = [
      { deviceId: "abc123" },
      { deviceId: "def456" },
      { deviceId: "hij789" },
    ];

    this.setProperties({ sensors });

    await render(hbs`
      {{camera/sensor-toggle
        sensors=this.sensors
        trackSettings=this.trackSettings
        updateStreamConstraints=this.updateStreamConstraintsStub
      }}
    `);

    const toggle: HTMLButtonElement = this.element.querySelector('.js-toggle-sensor');

    assert.equal(
      toggle.className === 'js-toggle-sensor',
      true,
      'When 2 or more sensors are passed, the toggle renders'
    );

    await click(toggle);

    assert.equal(
      this.updateStreamConstraintsStub.calledOnce,
      true,
      'onClick, sensor-toggle attempts to trigger `updateStreamConstraints`'
    );

  });

  test('The sensor toggle component does not render when a single sensor is passed', async function (assert) {
    const sensors = [
      { deviceId: "abc123" },
    ];

    this.setProperties({ sensors });

    await render(hbs`
      {{camera/sensor-toggle
        sensors=this.sensors
        trackSettings=this.trackSettings
        updateStreamConstraints=this.updateStreamConstraintsStub
      }}
    `);

    const toggle: HTMLButtonElement = this.element.querySelector('.js-toggle-sensor');

    assert.equal(
      toggle === null,
      true,
      'When 1 sensor is passed, the toggle does not renders'
    );
  });
});
