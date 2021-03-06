import { getElapsedTime } from "helpers/common";

test("getElapsedTime() one day diff", () => {
  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));

  const dayLengthInMs = 1000 * 60 * 60 * 24;
  expect(getElapsedTime(yesterday)).toBeWithinRange(
    dayLengthInMs - 1,
    dayLengthInMs + 1,
  );
});

test("getElapsedTime() one hour diff", () => {
  const today = new Date();
  const oneHourAgo = new Date(today.setHours(today.getHours() - 1));

  const hourLengthInMs = 1000 * 60 * 60;
  expect(getElapsedTime(oneHourAgo)).toBeWithinRange(
    hourLengthInMs - 1,
    hourLengthInMs + 1,
  );
});

test("getElapsedTime() one minute diff", () => {
  const today = new Date();
  const oneMinuteAgo = new Date(today.setMinutes(today.getMinutes() - 1));

  const minuteLengthInMs = 1000 * 60;
  expect(getElapsedTime(oneMinuteAgo)).toBeWithinRange(
    minuteLengthInMs - 1,
    minuteLengthInMs + 1,
  );
});

test("getElapsedTime() 30 seconds diff", () => {
  const today = new Date();
  const thirtySecondsAgo = new Date(today.setSeconds(today.getSeconds() - 30));

  const thirtySecondsLengthInMs = 1000 * 30;
  expect(getElapsedTime(thirtySecondsAgo)).toBeWithinRange(
    thirtySecondsLengthInMs - 1,
    thirtySecondsLengthInMs + 1,
  );
});
