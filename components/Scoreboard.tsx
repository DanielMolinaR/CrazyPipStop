import * as React from 'react';
import { View, Image } from 'react-native';

import CpsRoundButton from './CpsRoundButton';
import CpsButtonSmall from './CpsButtonSmall';
import StyledText from './StyledText';

import { useIsTablet } from '../hooks/useIsTablet';
import blackX from '../assets/images/black-x.png';
import whiteX from '../assets/images/white-x.png';

// Cap the scoreboard's overall width on tablets — without this, each
// item (sized as a percentage of full screen width) becomes huge and
// the score circles + mistake squares look stretched. 480 pt keeps the
// items at roughly phone-equivalent proportions.
const TABLET_SCOREBOARD_MAX_WIDTH = 480;

interface ScoreboardProps {
  victoryPoints: number;
  maxVictoryPoints: number;
  losingPoints: number;
  maxLosePoints: number;
  // Slight font-size tweak between Game and Resolve screens — defaults to the
  // GameScreen size; ResolveScreen passes 24.
  victoryFontSize?: number;
}

export default function Scoreboard({
  victoryPoints,
  maxVictoryPoints,
  losingPoints,
  maxLosePoints,
  victoryFontSize = 22,
}: ScoreboardProps) {
  const wrap = maxLosePoints < 5 ? '' : 'flex-wrap';
  const isTablet = useIsTablet();

  const rows = (
    <>
      <View className="w-full basis-[31%] h-full flex flex-row gap-x-3 items-center justify-center">
        {Array.from({ length: maxVictoryPoints }, (_, i) => {
          const earned = victoryPoints > i;
          return (
            <View key={`victory-${i}`} className="w-[13%] h-[75%]">
              <CpsRoundButton>
                <View
                  className={`w-full h-full ${earned ? 'bg-cps-green' : 'bg-cps-yellow'} rounded-full items-center justify-center`}
                >
                  <View className="-mt-1">
                    <StyledText
                      fontSize={victoryFontSize}
                      style={`font-black ${earned ? 'text-white' : ''}`}
                      text={i + 1}
                    />
                  </View>
                </View>
              </CpsRoundButton>
            </View>
          );
        })}
      </View>
      <View
        className={`flex-1 pt-1 w-full flex flex-row gap-2 items-center justify-center ${wrap}`}
      >
        {Array.from({ length: maxLosePoints }, (_, i) => {
          const lost = losingPoints > i;
          return (
            <View key={`mistake-${i}`} className="w-[18%] h-[40%]">
              <CpsButtonSmall>
                <View
                  className={`w-full h-full ${lost ? 'bg-cps-red' : 'bg-cps-yellow'} rounded-md items-center justify-center`}
                >
                  <Image
                    className="w-full h-full"
                    source={lost ? whiteX : blackX}
                    resizeMode="contain"
                  />
                </View>
              </CpsButtonSmall>
            </View>
          );
        })}
      </View>
    </>
  );

  // On phone, render the rows directly as children of the centred outer
  // View — same structure as before any iPad work, so phone layout is
  // unchanged. On tablet, wrap them in a 480 pt-wide centred container
  // so each item's percentage width is taken against the cap rather
  // than the full screen, keeping the circles / X squares phone-sized.
  return (
    <View className="h-[27%] flex items-center justify-center">
      {isTablet ? (
        <View
          className="h-full flex items-center justify-center"
          style={{ width: '100%', maxWidth: TABLET_SCOREBOARD_MAX_WIDTH }}
        >
          {rows}
        </View>
      ) : (
        rows
      )}
    </View>
  );
}
