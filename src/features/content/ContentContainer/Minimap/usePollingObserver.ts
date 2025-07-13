import { useEffect, useRef } from 'react'

/**
 * Periodically checks the number of chat messages in `elementToObserve` and
 * triggers `callback` when the count changes. This avoids continuous
 * MutationObserver updates and reduces resource usage.
 *
 * @param elementToObserve - Container element holding chat messages.
 * @param callback - Function invoked when the element's message count changes.
 * @param intervalMs - Polling interval in milliseconds.
 */
export default function usePollingObserver(
  elementToObserve: HTMLElement | null,
  callback: CallableFunction,
  intervalMs: number = 1000,
): void {
  const previousCount = useRef<number>(0)

  useEffect(() => {
    if (!elementToObserve) return

    const checkForChanges = () => {
      const count = elementToObserve.querySelectorAll('[data-message-author-role]').length
      if (count !== previousCount.current) {
        previousCount.current = count
        callback()
      }
    }

    // Initial check and then periodic polling
    checkForChanges()
    const id = setInterval(checkForChanges, intervalMs)
    return () => clearInterval(id)
  }, [elementToObserve, callback, intervalMs])
}
