import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/app/App';

afterEach(() => {
  sessionStorage.clear();
  vi.restoreAllMocks();
});

describe('FLOW-UP application', () => {
  it('renders the sign-in screen for a new session', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: 'Welcome back' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('switches to registration without leaving the page', () => {
    render(<App />);
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Create an account' })[1],
    );
    expect(
      screen.getByRole('heading', { name: 'Create your account' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create account' }),
    ).toBeInTheDocument();
  });

  it('shows the workspace shell after restoring an authenticated session', async () => {
    sessionStorage.setItem('flow-up.access-token', 'session-token');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
        const url = String(input);
        const data = url.endsWith('/api/auth/session')
          ? {
              user: {
                userId: 'user-1',
                email: 'person@example.com',
                isAuthenticated: true,
              },
            }
          : url.endsWith('/api/workspaces/overview')
            ? {
                workspace: {
                  id: 'ws-1',
                  userId: 'user-1',
                  name: 'Personal Workspace',
                  createdAt: '',
                  updatedAt: '',
                },
                projects: [],
                goalSummary: null,
              }
            : url.endsWith('/api/goals/hierarchy')
              ? []
              : [];
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, data }),
        };
      }),
    );
    render(<App />);
    expect(
      await screen.findByRole('heading', { name: 'Your space to grow' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Personal Workspace')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/session',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer session-token',
        }),
      }),
    );
  });
});
