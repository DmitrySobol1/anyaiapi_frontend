import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { Onboarding } from '@/pages/Onboarding/Onboarding';
import { EnterPage } from '@/pages/EnterPage/EnterPage';
import { ListAiModels } from '@/pages/ListAiModels/ListAiModels';
import { MyAccountPage } from '@/pages/MyAccount/MyAccount';
import { RqstHistory } from '@/pages/MyAccount/RqstHistory';
import { Help } from '@/pages/MyAccount/Help';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: EnterPage },
  { path: '/index', Component: IndexPage },
  { path: '/onboarding', Component: Onboarding },
  { path: '/listAiModels', Component: ListAiModels },
  { path: '/myAccount-page', Component: MyAccountPage },
  { path: '/rqsthistory-page', Component: RqstHistory },
  { path: '/help-page', Component: Help },
 
];
