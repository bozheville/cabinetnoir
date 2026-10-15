import React from 'react';

import GlossaryTerm from '@molecues/GlossaryTerm';
import WorkedExample from '@molecues/WorkedExample';
import TryInToolButton from '@molecues/TryInToolButton';
import ControlName from '@molecues/ControlName';
import ChallengeLinkButton from '@molecues/ChallengeLinkButton';
import HistoryTimeline from '@molecues/HistoryTimeline';
import { registerPlaceholder } from './registry';

// Live pieces that markdown can embed. Each entry maps a placeholder type
// to the component rendering it; texts come from the i18n JSON.
registerPlaceholder('term', (id) => <GlossaryTerm id={id} />);
registerPlaceholder('example', (id) => <WorkedExample id={id} />);
registerPlaceholder('try', (id) => <TryInToolButton exampleId={id} />);
registerPlaceholder('control', (id) => <ControlName id={id} />);
registerPlaceholder('timeline', (cipher) => <HistoryTimeline cipher={cipher} />);
registerPlaceholder('challenge', (id) => <ChallengeLinkButton challengeId={id} />);
