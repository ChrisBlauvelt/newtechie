import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import BrowserFrame from './BrowserFrame.svelte';

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

  it('has links to open the site in a new tab', () => {
    render(BrowserFrame, { props: defaultProps });
    const links = screen.getAllByRole('link', { name: /visit/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute('href', 'https://bagelboyscafe.com');
    expect(links[0]).toHaveAttribute('target', '_blank');
  });

  it('shows fallback image when no video provided', () => {
    render(BrowserFrame, {
      props: { ...defaultProps, fallbackImage: '/portfolio/bagelboyscafe.webp' },
    });
    const img = screen.getByAltText('Bagel Boys Cafe preview');
    expect(img).toHaveAttribute('src', '/portfolio/bagelboyscafe.webp');
  });
});
