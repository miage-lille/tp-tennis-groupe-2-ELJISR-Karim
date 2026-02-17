import { describe, expect, test } from '@jest/globals';
import {
  otherPlayer,
  playerToString,
  pointToString,
  scoreToString,
  scoreWhenDeuce,
  scoreWhenAdvantage,
  scoreWhenForty,
  scoreWhenPoint,
  scoreWhenGame,
  score,
} from '..';
import { stringToPlayer } from '../types/player';

describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerTwo when playerToString', () => {
    expect(playerToString('PLAYER_TWO')).toStrictEqual('Player 2');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });

  test('Given playerTwo when otherPlayer', () => {
    expect(otherPlayer('PLAYER_TWO')).toStrictEqual('PLAYER_ONE');
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
  test('Given deuce, score is advantage to winner', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((w) => {
      const winner = w as 'PLAYER_ONE' | 'PLAYER_TWO';
      const score = scoreWhenDeuce(winner);
      const scoreExpected = { kind: 'ADVANTAGE', player: winner };
      expect(score).toStrictEqual(scoreExpected);
    });
  });

  test('Given advantage when advantagedPlayer wins, score is Game advantagedPlayer', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((p) => {
      const advantagedPlayer = p as 'PLAYER_ONE' | 'PLAYER_TWO';
      const winner = advantagedPlayer;
      const score = scoreWhenAdvantage(advantagedPlayer, winner);
      const scoreExpected = { kind: 'GAME', player: winner };
      expect(score).toStrictEqual(scoreExpected);
    });
  });

  test('Given advantage when otherPlayer wins, score is Deuce', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((p) => {
      const advantagedPlayer = p as 'PLAYER_ONE' | 'PLAYER_TWO';
      const winner = otherPlayer(advantagedPlayer);
      const score = scoreWhenAdvantage(advantagedPlayer, winner);
      const scoreExpected = { kind: 'DEUCE' };
      expect(score).toStrictEqual(scoreExpected);
    });
  });
  test('Given a player at 40 when the same player wins, score is Game for this player', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
      const player = winner as 'PLAYER_ONE' | 'PLAYER_TWO';
      const fortyData = {
        player,
        otherPoint: { kind: 'THIRTY' } as any, // Using strict structure for now or constructors
      };
      const score = scoreWhenForty(fortyData, player);
      const scoreExpected = { kind: 'GAME', player };
      expect(score).toStrictEqual(scoreExpected);
    });
  });

  test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
      const player = winner as 'PLAYER_ONE' | 'PLAYER_TWO';
      const other = otherPlayer(player);
      const fortyData = {
        player: other,
        otherPoint: { kind: 'THIRTY' } as any,
      };
      const score = scoreWhenForty(fortyData, player);
      const scoreExpected = { kind: 'DEUCE' };
      expect(score).toStrictEqual(scoreExpected);
    });
  });

  test('Given player at 40 and other at 15 when other wins, score is 40 - 30', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
      const player = winner as 'PLAYER_ONE' | 'PLAYER_TWO';
      const other = otherPlayer(player);
      const fortyData = {
        player: other,
        otherPoint: { kind: 'FIFTEEN' } as any,
      };
      const score = scoreWhenForty(fortyData, player);
      const scoreExpected = {
        kind: 'FORTY',
        fortyData: {
          player: other,
          otherPoint: { kind: 'THIRTY' },
        },
      };
      expect(score).toStrictEqual(scoreExpected);
    });
  });
  // -------------------------TESTS POINTS-------------------------- //
  test('Given players at 0 or 15 points score kind is still POINTS', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
      const player = winner as 'PLAYER_ONE' | 'PLAYER_TWO';
      const other = otherPlayer(player);

      // Case 1: Love -> Fifteen
      const currentPoints1 = {
        PLAYER_ONE: { kind: 'LOVE' },
        PLAYER_TWO: { kind: 'LOVE' },
      } as any;
      const score1 = scoreWhenPoint(currentPoints1, player);
      const expectedScore1 = {
        kind: 'POINTS',
        pointsData: {
          ...currentPoints1,
          [player]: { kind: 'FIFTEEN' },
        },
      };
      expect(score1).toStrictEqual(expectedScore1);

      // Case 2: Fifteen -> Thirty
      const currentPoints2 = {
        ...currentPoints1,
        [player]: { kind: 'FIFTEEN' },
      } as any;
      const score2 = scoreWhenPoint(currentPoints2, player);
      const expectedScore2 = {
        kind: 'POINTS',
        pointsData: {
          ...currentPoints2,
          [player]: { kind: 'THIRTY' },
        },
      };
      expect(score2).toStrictEqual(expectedScore2);
    });
  });

  test('Given one player at 30 and win, score kind is forty', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
      const player = winner as 'PLAYER_ONE' | 'PLAYER_TWO';
      const other = otherPlayer(player);

      const currentPoints = {
        PLAYER_ONE: { kind: 'LOVE' },
        PLAYER_TWO: { kind: 'LOVE' },
        [player]: { kind: 'THIRTY' },
      } as any;

      const score = scoreWhenPoint(currentPoints, player);
      const expectedScore = {
        kind: 'FORTY',
        fortyData: {
          player: player,
          otherPoint: currentPoints[other],
        },
      };
      expect(score).toStrictEqual(expectedScore);
    });
  });

  test('Given game, score is still game', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
      const player = winner as 'PLAYER_ONE' | 'PLAYER_TWO';
      const score = scoreWhenGame(player);
      const expectedScore = { kind: 'GAME', player };
      expect(score).toStrictEqual(expectedScore);
    });
  });
});

describe('Tests for score function (Integration)', () => {
  test('Given a full game flow', () => {
    let currentScore: any = {
      kind: 'POINTS',
      pointsData: {
        PLAYER_ONE: { kind: 'LOVE' },
        PLAYER_TWO: { kind: 'LOVE' },
      },
    };

    // 15 - Love
    currentScore = score(currentScore, 'PLAYER_ONE');
    expect(scoreToString(currentScore)).toBe('Fifteen - Love');

    // 15 - 15
    currentScore = score(currentScore, 'PLAYER_TWO');
    expect(scoreToString(currentScore)).toBe('Fifteen - Fifteen');

    // 30 - 15
    currentScore = score(currentScore, 'PLAYER_ONE');
    expect(scoreToString(currentScore)).toBe('Thirty - Fifteen');

    // 40 - 15
    currentScore = score(currentScore, 'PLAYER_ONE');
    expect(scoreToString(currentScore)).toBe('Forty - Fifteen');

    // 40 - 30
    currentScore = score(currentScore, 'PLAYER_TWO');
    expect(scoreToString(currentScore)).toBe('Forty - Thirty');

    // Deuce
    currentScore = score(currentScore, 'PLAYER_TWO');
    expect(scoreToString(currentScore)).toBe('Deuce');

    // Advantage Player 1
    currentScore = score(currentScore, 'PLAYER_ONE');
    expect(scoreToString(currentScore)).toBe('Advantage Player 1');

    // Game Player 1
    currentScore = score(currentScore, 'PLAYER_ONE');
    expect(scoreToString(currentScore)).toBe('Game Player 1');
  });
});

describe('Tests for player type', () => {
  test('Given invalid string, stringToPlayer throws', () => {
    expect(() => stringToPlayer('INVALID')).toThrow();
  });
});
