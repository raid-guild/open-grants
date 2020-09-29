import { Box, VStack } from '@chakra-ui/core';
import { GrantHeader } from 'components/GrantHeader';
import { Grant } from 'graphql/autogen/types';
import { getGrant } from 'graphql/getGrant';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AreaSeries, FlexibleWidthXYPlot, XAxis, YAxis } from 'react-vis';
/*
import styled from 'styled-components';


const ChartDiv = styled.div`
  width: 100%;
  max-width: 800px;
  height: 420px;
  position: relative;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  margin: 0px;
  padding: 0px;
  &:before {
    content: 'ETH';
    font-family: sans-serif;
    position: absolute;
    left: -30px;
    top: 50%;
    transform: rotate(-90deg);
    color: #ccc;
  }
`;

*/

const ChartDiv: React.FC = ({ children }) => (
  <Box
    w="100%"
    maxW="800px"
    h="420px"
    position="relative"
    borderLeft="1px solid #ccc"
    borderBottom="1px solid #ccc"
    m="0"
    p="0"
    _before={{
      content: 'ETH',
      fontFamily: 'sans-serif',
      position: 'absolute',
      left: '-30px',
      top: '50%',
      transform: 'rotate(-90deg)',
      color: '#ccc',
    }}
  >
    {children}
  </Box>
);

const dataOne = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 1,
    y: 10.467581549309639,
  },
  {
    x: 2,
    y: 10.890566507677987,
  },
  {
    x: 3,
    y: 10.9054250129686,
  },
  {
    x: 4,
    y: 11.69755493875752,
  },
  {
    x: 5,
    y: 12.245723877500671,
  },
  {
    x: 6,
    y: 12.63404048418984,
  },
  {
    x: 7,
    y: 11.940748593792001,
  },
  {
    x: 8,
    y: 11.885194291058927,
  },
  {
    x: 9,
    y: 11.606726436058974,
  },
  {
    x: 10,
    y: 11.724715096804212,
  },
  {
    x: 11,
    y: 11.376768696031867,
  },
  {
    x: 12,
    y: 11.123778747150174,
  },
];

const dataTwo = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 1,
    y: 0,
  },
  {
    x: 2,
    y: 10.179032277024639,
  },
  {
    x: 3,
    y: 10.360124362735931,
  },
  {
    x: 4,
    y: 10.203211916432986,
  },
  {
    x: 5,
    y: 10.083980269795509,
  },
  {
    x: 6,
    y: 9.286861384708057,
  },
  {
    x: 7,
    y: 9.196972670222204,
  },
  {
    x: 8,
    y: 8.775324629811724,
  },
  {
    x: 9,
    y: 9.162337282733054,
  },
  {
    x: 10,
    y: 8.71049888560288,
  },
  {
    x: 11,
    y: 9.09354652467816,
  },
  {
    x: 12,
    y: 9.423137603106285,
  },
];

const dataThree = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 1,
    y: 0,
  },
  {
    x: 2,
    y: 0,
  },
  {
    x: 3,
    y: 0,
  },
  {
    x: 4,
    y: 9,
  },
  {
    x: 5,
    y: 10.49792117295561,
  },
  {
    x: 6,
    y: 9.967692907754097,
  },
  {
    x: 7,
    y: 9.741276841602215,
  },
  {
    x: 8,
    y: 10.241670305429935,
  },
  {
    x: 9,
    y: 10.705399648705965,
  },
  {
    x: 10,
    y: 10.735561172006447,
  },
  {
    x: 11,
    y: 10.761739825842053,
  },
  {
    x: 12,
    y: 11.382978279546732,
  },
];

interface MatchParams {
  grantAddress: string;
}

type Props = RouteComponentProps<MatchParams>;

const GrantPage: React.FC<Props> = ({
  match: {
    params: { grantAddress },
  },
}) => {
  const [grant, setGrant] = useState<Grant | null | undefined>();

  useEffect(() => {
    async function fetchGrant() {
      setGrant(await getGrant(grantAddress.toLowerCase()));
    }
    fetchGrant();
  }, [grantAddress]);

  if (grant === undefined) {
    return <Box mt="5rem"> Loading ... </Box>;
  }
  if (grant === null) {
    return <Box mt="5rem"> Grant not found </Box>;
  }
  return (
    <VStack w="100%">
      <GrantHeader grant={grant} />
      <ChartDiv>
        <FlexibleWidthXYPlot stackBy="y" yDomain={[0, 50]} height="420">
          <AreaSeries
            curve="curveBasis"
            animation
            data={dataOne}
            opacity={0.25}
            style={{}}
          />
          <AreaSeries
            animation
            curve="curveBasis"
            data={dataTwo}
            opacity={0.25}
            style={{}}
          />
          <AreaSeries
            animation
            curve="curveBasis"
            data={dataThree}
            opacity={0.25}
            style={{}}
          />
          <XAxis style={{ fontSize: '9px' }} />
          <YAxis style={{ fontSize: '9px' }} />
        </FlexibleWidthXYPlot>
      </ChartDiv>
    </VStack>
  );
};

export default GrantPage;
