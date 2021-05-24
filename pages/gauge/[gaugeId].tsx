import { ReactElement } from 'react';
import { useRouter } from 'next/router';

const GaugePage = (): ReactElement => {
  const router = useRouter();
  const { gaugeId } = router.query;

  return <h1>{gaugeId}</h1>;
};

export default GaugePage;
