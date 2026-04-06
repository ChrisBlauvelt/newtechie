import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import SuggestedQuestions from './SuggestedQuestions.svelte';

describe('SuggestedQuestions Component', () => {
  const defaultQuestions = [
    'How can local AI document processing help my small business?',
    'How can a modern website with integrated analytics help our marketing team gain insight?',
    'What smart home automation services do you offer in Gwinnett County?'
  ];

  it('renders all provided questions', () => {
    render(SuggestedQuestions, {
      props: {
        questions: defaultQuestions,
        onSelect: vi.fn(),
        isVisible: true
      }
    });

    defaultQuestions.forEach(question => {
      expect(screen.getByText(question)).toBeInTheDocument();
    });
  });

  it('calls onSelect with correct question when clicked', async () => {
    const onSelect = vi.fn();
    render(SuggestedQuestions, {
      props: {
        questions: defaultQuestions,
        onSelect,
        isVisible: true
      }
    });

    const firstQuestion = screen.getByText(defaultQuestions[0]);
    await fireEvent.click(firstQuestion);

    expect(onSelect).toHaveBeenCalledWith(defaultQuestions[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('does not render when isVisible is false', () => {
    const { container } = render(SuggestedQuestions, {
      props: {
        questions: defaultQuestions,
        onSelect: vi.fn(),
        isVisible: false
      }
    });

    expect(container.querySelector('.suggested-questions')).not.toBeInTheDocument();
  });

  it('does not render when questions array is empty', () => {
    const { container } = render(SuggestedQuestions, {
      props: {
        questions: [],
        onSelect: vi.fn(),
        isVisible: true
      }
    });

    expect(container.querySelector('.suggested-questions')).not.toBeInTheDocument();
  });

  it('has proper ARIA labels for accessibility', () => {
    render(SuggestedQuestions, {
      props: {
        questions: defaultQuestions,
        onSelect: vi.fn(),
        isVisible: true
      }
    });

    const group = screen.getByRole('group', { name: 'Suggested questions' });
    expect(group).toBeInTheDocument();

    const firstButton = screen.getByRole('button', { 
      name: `Ask: ${defaultQuestions[0]}` 
    });
    expect(firstButton).toBeInTheDocument();
  });

  it('applies teal styling with hover states', () => {
    render(SuggestedQuestions, {
      props: {
        questions: [defaultQuestions[0]],
        onSelect: vi.fn(),
        isVisible: true
      }
    });

    const button = screen.getByRole('button');
    expect(button).toHaveClass('question-chip');
  });

  it('handles multiple question selections', async () => {
    const onSelect = vi.fn();
    render(SuggestedQuestions, {
      props: {
        questions: defaultQuestions,
        onSelect,
        isVisible: true
      }
    });

    for (const question of defaultQuestions) {
      const button = screen.getByText(question);
      await fireEvent.click(button);
    }

    expect(onSelect).toHaveBeenCalledTimes(defaultQuestions.length);
    defaultQuestions.forEach((question, index) => {
      expect(onSelect).toHaveBeenNthCalledWith(index + 1, question);
    });
  });
});
