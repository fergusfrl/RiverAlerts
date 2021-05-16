import { ReactNode } from 'react';

export type User = {
  id: number;
  name: string;
};

export type NavItem = {
  link: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
};
