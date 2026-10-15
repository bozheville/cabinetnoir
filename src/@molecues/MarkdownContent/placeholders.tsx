import React from 'react';

import GlossaryTerm from '@molecues/GlossaryTerm';
import { registerPlaceholder } from './registry';

// Live pieces that markdown can embed. Each entry maps a placeholder type
// to the component rendering it; texts come from the i18n JSON.
registerPlaceholder('term', (id) => <GlossaryTerm id={id} />);
