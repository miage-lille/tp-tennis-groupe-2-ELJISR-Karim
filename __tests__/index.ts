import { describe, expect, test } from '@jest/globals';
import {
  otherPlayer,
  playerToString,
  pointToString,
  scoreToString,
} from '..';

describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });
});

describe('Tests for string conversion', () => {
  test('Given Love, Fifteen, Thirty points, they are correctly converted to string', () => {
    expect(
      pointToString({
        kind: 'LOVE',
      })
    ).toStrictEqual('Love');
    expect(
      pointToString({
        kind: 'FIFTEEN',
      })
    ).toStrictEqual('Fifteen');
    expect(
      pointToString({
        kind: 'THIRTY',
      })
    ).toStrictEqual('Thirty');
  });

  test('Given Score, it is correctly converted to string', () => {
    expect(
      scoreToString({
        kind: 'POINTS',
        pointsData: {
          PLAYER_ONE: {
            kind: 'LOVE',
          },
          PLAYER_TWO: {
            kind: 'FIFTEEN',
          },
        },
      })
    ).toStrictEqual('Love - Fifteen');
    expect(
      scoreToString({
        kind: 'DEUCE',
      })
    ).toStrictEqual('Deuce');
  });
});

describe('Tests for transition functions', () => {
  // test('Given deuce, score is advantage to winner', () => {
  //   console.log('To fill when we will know how represent Deuce');
  // });
  // test('Given advantage when advantagedPlayer wins, score is Game avantagedPlayer', () => {
  //   console.log('To fill when we will know how represent Advantage');
  // });
  // test('Given advantage when otherPlayer wins, score is Deuce', () => {
  //   console.log('To fill when we will know how represent Advantage');
  // });
  // test('Given a player at 40 when the same player wins, score is Game for this player', () => {
  //   console.log('To fill when we will know how represent Forty');
  // });
  // test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
  //   console.log('To fill when we will know how represent Forty');
  // });
  // test('Given player at 40 and other at 15 when other wins, score is 40 - 15', () => {
  //   console.log('To fill when we will know how represent Forty');
  // });
  // -------------------------TESTS POINTS-------------------------- //
  // test('Given players at 0 or 15 points score kind is still POINTS', () => {
  //   throw new Error(
  //     'Your turn to code the preconditions, expected result and test.'
  //   );
  // });

  // test('Given one player at 30 and win, score kind is forty', () => {
  //   throw new Error(
  //     'Your turn to code the preconditions, expected result and test.'
  //   );
  // });
});
