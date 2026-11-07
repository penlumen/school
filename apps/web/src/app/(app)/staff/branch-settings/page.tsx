'use client';

import {SettingsShell} from '@/components/app/settings-shell';
import {BranchGeneralTab} from '@/components/app/branch-general-tab';
import {GradingTab} from '@/components/app/grading-tab';
import {AffectiveTab} from '@/components/app/affective-tab';

export default function BranchSettingsPage() {
    return (
        <SettingsShell
            title='Branch Settings'
            description='Manage your branch details, grading and report card traits'
            tabs={[
                {value: 'general', label: 'General', content: <BranchGeneralTab/>},
                {value: 'grading', label: 'Grading', content: <GradingTab/>},
                {value: 'affective', label: 'Affective domain', content: <AffectiveTab/>},
            ]}
        />
    );
}
