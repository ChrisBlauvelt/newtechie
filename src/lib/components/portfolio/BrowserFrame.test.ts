import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import BrowserFrame from './BrowserFrame.svelte';

// With visible defaulting to true and IntersectionObserver undefined in jsdom,
// the component renders content immediately without needing the observer.

describe('BrowserFrame', () => {
  const defaultProps = {
    url: 'https://bagelboyscafe.com',
    title: 'Bagel Boys Cafe',
    description: 'A local bagel shop website',
    tags: ['Svelte', 'SvelteKit'],
  };

  it('renders browser chrome with URL', () => {
    render(BrowserFrame, { props: defaultProps });
    expect(screen.getByText('bagelboyscafe.com')).toBeInTheDocument();
  });

  it('renders site title and description', () => {
    render(BrowserFrame, { props: defaultProps });
    expect(screen.getByText('Bagel Boys Cafe')).toBeInTheDocument();
    expect(screen.getByText('A local bagel shop website')).toBeInTheDocument();
  });

  it('renders tech tags', () => {
    render(BrowserFrame, { props: defaultProps });
    expect(screen.getByText('Svelte')).toBeInTheDocument();
    expect(screen.getByText('SvelteKit')).toBeInTheDocument();
  });

  it('shows interaction overlay by default', () => {
    render(BrowserFrame, { props: defaultProps });
    expect(screen.getByText('Click to interact')).toBeInTheDocument();
  });

  it('has a link to open the site in a new tab', () => {
    render(BrowserFrame, { props: defaultProps });
    const link = screen.getByRole('link', { name: /visit/i });
    expect(link).toHaveAttribute('href', 'https://bagelboyscafe.com');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
