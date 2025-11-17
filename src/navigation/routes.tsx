import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { Onboarding } from '@/pages/Onboarding/Onboarding';
import { EnterPage } from '@/pages/EnterPage/EnterPage';
import { ListAiModels } from '@/pages/ListAiModels/ListAiModels';
import { MyAccountPage } from '@/pages/MyAccount/MyAccount';

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
 
];
