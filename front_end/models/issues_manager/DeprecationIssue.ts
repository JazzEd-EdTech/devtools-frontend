// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import type * as Protocol from '../../generated/protocol.js';

import {Issue, IssueCategory, IssueKind} from './Issue.js';
import type {MarkdownIssueDescription} from './MarkdownIssueDescription.js';
import {isCausedByThirdParty} from './SameSiteCookieIssue.js';


const UIStrings = {
  /**
   * @description Label for the link for User-Agent String reduction issues, that is, issues that are related to an
   * upcoming reduction of information content in the user-agent string.
   */
  userAgentReduction: 'User-Agent String Reduction',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/DeprecationIssue.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);

// TODO(crbug.com/1167717): Make this a const enum again
// eslint-disable-next-line rulesdir/const_enum
export enum IssueCode {
  NavigatorUserAgentIssue = 'DeprecationIssue::NavigatorUserAgentIssue',
}

export class DeprecationIssue extends Issue<IssueCode> {
  // TODO(crbug.com/1072335) Update types once protocol rolls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private issueDetails: any;

  // TODO(crbug.com/1072335) Update types once protocol rolls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(issueDetails: any, issuesModel: SDK.IssuesModel.IssuesModel) {
    super(IssueCode.NavigatorUserAgentIssue, issuesModel);
    this.issueDetails = issueDetails;
  }

  getCategory(): IssueCategory {
    return IssueCategory.Other;
  }

  details(): Protocol.Audits.CorsIssueDetails {
    return this.issueDetails;
  }

  getDescription(): MarkdownIssueDescription|null {
    return {
      file: 'deprecationNavigatorUserAgent.md',
      links: [{
        link: 'https://blog.chromium.org/2021/05/update-on-user-agent-string-reduction.html',
        linkTitle: i18nString(UIStrings.userAgentReduction),
      }],
    };
  }

  sources(): Iterable<Protocol.Audits.SourceCodeLocation> {
    return [this.issueDetails.location];
  }

  primaryKey(): string {
    return JSON.stringify(this.issueDetails);
  }

  getKind(): IssueKind {
    return IssueKind.BreakingChange;
  }

  isCausedByThirdParty(): boolean {
    const topFrame = SDK.FrameManager.FrameManager.instance().getTopFrame();
    return isCausedByThirdParty(topFrame, this.issueDetails.url);
  }

  static fromInspectorIssue(
      issuesModel: SDK.IssuesModel.IssuesModel,
      inspectorDetails: Protocol.Audits.InspectorIssueDetails): DeprecationIssue[] {
    // TODO(crbug.com/1072335) Update types once protocol rolls
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const corsIssueDetails = (inspectorDetails as any)['navigatorUserAgentIssueDetails'];
    if (!corsIssueDetails) {
      console.warn('Cors issue without details received.');
      return [];
    }
    return [new DeprecationIssue(corsIssueDetails, issuesModel)];
  }
}
