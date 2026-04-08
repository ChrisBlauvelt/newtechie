import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import PortfolioBento from './PortfolioBento.svelte';

describe('PortfolioBento', () => {
  it('renders all four portfolio sites', () => {
    render(PortfolioBento);
    // Each site appears in the site list; the selected one also appears in the BrowserFrame preview
    expect(screen.getAllByText('Brunch Apothecary').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Bagel Boys Cafe')).toBeInTheDocument();
    expect(screen.getByText("Rico's World Kitchen")).toBeInTheDocument();
    expect(screen.getByText('The Artisan: A Gathering Place')).toBeInTheDocument();
  });

  it('renders section heading', () => {
    render(PortfolioBento);
    expect(screen.getByText('Portfolio of Local Business Websites')).toBeInTheDocument();
  });
});
