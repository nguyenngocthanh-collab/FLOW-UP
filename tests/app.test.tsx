import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../src/app/App';

describe('application foundation', () => {
  it('renders the app name and foundation notice', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'FLOW-UP' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Project foundation')).toBeInTheDocument();
  });
});
