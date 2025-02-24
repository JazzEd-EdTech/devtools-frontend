// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as Root from '../../../../../../front_end/core/root/root.js';
import * as PanelFeedback from '../../../../../../front_end/ui/components/panel_feedback/panel_feedback.js';
import * as Coordinator from '../../../../../../front_end/ui/components/render_coordinator/render_coordinator.js';
import {assertElement, assertShadowRoot, dispatchClickEvent, renderElementIntoDOM} from '../../../helpers/DOMHelpers.js';

const coordinator = Coordinator.RenderCoordinator.RenderCoordinator.instance();

describe('Preview toggle', () => {
  it('calls out correctly to enable experiment', async () => {
    const isEnabledStub = sinon.stub(Root.Runtime.experiments, 'isEnabled');
    isEnabledStub.callsFake(() => false);
    const setEnabledStub = sinon.stub(Root.Runtime.experiments, 'setEnabled');
    setEnabledStub.callsFake(() => {});
    const spy = sinon.spy();

    const component = new PanelFeedback.PreviewToggle.PreviewToggle();
    component.data = {
      name: 'toggle name',
      helperText: 'more about this toggle',
      feedbackURL: 'https://feedbackurl.com',
      experiment: 'testExperiment' as Root.Runtime.ExperimentName,
      onChangeCallback: spy,
    };

    renderElementIntoDOM(component);
    await coordinator.done();

    assertShadowRoot(component.shadowRoot);
    const input = component.shadowRoot.querySelector('input');
    assertElement(input, HTMLElement);
    dispatchClickEvent(input);
    assert.strictEqual(setEnabledStub.callCount, 1);
    assert.isTrue(
        setEnabledStub.firstCall.calledWith('testExperiment', true),
        'experiments.setEnabled was not called with the correct experiment');
    assert.strictEqual(spy.callCount, 1);
    assert.strictEqual(spy.firstCall.firstArg, true);
  });

  it('calls out correctly to disable experiment', async () => {
    const isEnabledStub = sinon.stub(Root.Runtime.experiments, 'isEnabled');
    isEnabledStub.callsFake(() => true);
    const setEnabledStub = sinon.stub(Root.Runtime.experiments, 'setEnabled');
    setEnabledStub.callsFake(() => {});
    const spy = sinon.spy();

    const component = new PanelFeedback.PreviewToggle.PreviewToggle();
    component.data = {
      name: 'toggle name',
      helperText: 'more about this toggle',
      feedbackURL: 'https://feedbackurl.com',
      experiment: 'testExperiment' as Root.Runtime.ExperimentName,
      onChangeCallback: spy,
    };

    renderElementIntoDOM(component);
    await coordinator.done();

    assertShadowRoot(component.shadowRoot);
    const input = component.shadowRoot.querySelector('input');
    assertElement(input, HTMLElement);
    dispatchClickEvent(input);
    assert.strictEqual(setEnabledStub.callCount, 1);
    assert.isTrue(
        setEnabledStub.firstCall.calledWith('testExperiment', false),
        'experiments.setEnabled was not called with the correct experiment');
    assert.strictEqual(spy.callCount, 1);
    assert.strictEqual(spy.firstCall.firstArg, false);
  });
});
