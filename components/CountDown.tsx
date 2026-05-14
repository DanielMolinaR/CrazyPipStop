import * as React from 'react';
import { View, AppState, AppStateStatus } from 'react-native';

import CpsButtonBig from './CpsButtonBig';
import StyledText from './StyledText';

// Audio cue lead-in: the countdown sound starts immediately, but the visible
// timer only begins ticking after this delay so the audio cue ("3, 2, 1...")
// lines up with the displayed seconds.
const LEAD_IN_MS = 5200;

interface CountDownProps {
  until: number;
  running?: boolean;
  style?: string;
  onFinish?: (hasFinished: boolean) => void;
  onSound?: () => void | Promise<void>;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function CountDown({
  until,
  running = true,
  style,
  onFinish,
  onSound,
}: CountDownProps) {
  const [time, setTime] = React.useState<number>(Math.max(until, 0));

  // Refs so the long-lived setInterval and AppState callbacks always see the
  // current values without having to re-create themselves on every prop change.
  const runningRef = React.useRef(running);
  const onFinishRef = React.useRef(onFinish);
  const finishedRef = React.useRef(false);
  const wentBackgroundAtRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    runningRef.current = running;
  }, [running]);

  React.useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  // Reset internal state if the parent passes a new `until` value.
  React.useEffect(() => {
    setTime(Math.max(until, 0));
    finishedRef.current = false;
  }, [until]);

  // Background/foreground handling: when the user backgrounds the app we
  // record the timestamp, and on resume we subtract the elapsed wall-clock
  // time so the timer doesn't drift.
  React.useEffect(() => {
    const onAppStateChange = (state: AppStateStatus) => {
      if (state === 'background') {
        wentBackgroundAtRef.current = Date.now();
        return;
      }
      if (state === 'active' && wentBackgroundAtRef.current && runningRef.current) {
        const elapsedSeconds = (Date.now() - wentBackgroundAtRef.current) / 1000;
        wentBackgroundAtRef.current = null;
        setTime((current) => Math.max(0, current - elapsedSeconds));
      }
    };
    const sub = AppState.addEventListener('change', onAppStateChange);
    return () => sub.remove();
  }, []);

  // Lead-in audio + ticking timer. Runs once on mount; cleanup cancels both
  // the pending lead-in and the active interval.
  React.useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const begin = async () => {
      if (onSound) {
        // Fire and forget — don't await the audio load. The visible timer
        // starts after a fixed lead-in regardless of how slow audio loading
        // is, matching the original class component's timing where the
        // load happened in parallel with the lead-in delay rather than
        // serially before it.
        Promise.resolve(onSound()).catch(() => {});
      }
      await sleep(LEAD_IN_MS);
      if (cancelled) return;

      intervalId = setInterval(() => {
        if (!runningRef.current) return;
        setTime((current) => {
          if (current <= 0) return 0;
          const next = Math.max(0, current - 1);
          if (next === 0 && !finishedRef.current) {
            finishedRef.current = true;
            onFinishRef.current?.(true);
          }
          return next;
        });
      }, 1000);
    };

    begin();

    return () => {
      cancelled = true;
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className={style}>
      <CpsButtonBig>
        <View className="w-full h-full bg-cps-brown rounded-md items-center justify-center">
          <StyledText
            fontSize={72}
            style="text-cps-yellow font-black"
            text={`${Math.ceil(time)}"`}
          />
        </View>
      </CpsButtonBig>
    </View>
  );
}
