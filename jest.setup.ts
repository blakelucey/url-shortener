import React from 'react';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: Record<string, unknown>) =>
    React.createElement('img', { alt, ...props }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});
