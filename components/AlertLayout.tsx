import { ReactElement, ReactNode } from 'react';
import AlertList from './AlertList';

type Props = {
  selectedId?: string;
  children?: ReactNode;
};

const AlertLayout = ({ children, selectedId }: Props): ReactElement => {
  return (
    <>
      <AlertList selectedId={selectedId || null} />
      {children}
    </>
  );
};

export default AlertLayout;
