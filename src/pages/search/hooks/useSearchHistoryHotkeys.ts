import { useEffect, type RefObject } from 'react';
import hotkeys, { type KeyHandler } from 'hotkeys-js';

export function useSearchHistoryHotkeys(
  listRef: RefObject<HTMLUListElement | null>,
  onFocusInput: () => void
) {
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const navigation: Record<string, (buttons: HTMLButtonElement[], index: number) => void> = {
      up: (buttons, index) => {
        if (index === 0) onFocusInput();
        else buttons[index - 1]?.focus();
      },
      down: (buttons, index) => buttons[Math.min(index + 1, buttons.length - 1)]?.focus(),
      home: (buttons) => buttons[0]?.focus(),
      end: (buttons) => buttons.at(-1)?.focus(),
    };

    const bindings = Object.entries(navigation).map(([key, moveFocus]) => {
      const method: KeyHandler = (event) => {
        const { target } = event;
        if (event.isComposing || !(target instanceof Element) || !list.contains(target)) return;

        const item = target.closest('li');
        const buttons = Array.from(
          list.querySelectorAll<HTMLButtonElement>('[data-history-select]')
        );
        const index = buttons.findIndex((button) => button.closest('li') === item);
        if (index === -1) return;

        moveFocus(buttons, index);
        return false;
      };

      hotkeys(key, method);
      return { key, scope: 'all', method };
    });

    return () => hotkeys.unbind(bindings);
  }, [listRef, onFocusInput]);
}
