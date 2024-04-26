import { useRef } from 'react';

export function useDebouncedCallback() {
    const debouncedCallbackRef = useRef<NodeJS.Timeout | null>(null);

    return {
        debounceCall(callback: () => void, delay: number) {
            if (debouncedCallbackRef.current) {
                clearTimeout(debouncedCallbackRef.current);
            }
            debouncedCallbackRef.current = setTimeout(() => {
                callback();
            }, delay);
        },
        debounce() {
            if (debouncedCallbackRef.current) {
                clearTimeout(debouncedCallbackRef.current);
            }
        },
    };
}
