import { useEffect, useState } from "react";
import {
  queryChatContainer,
} from "./Minimap/utils";
import styles from "./ContentContainer.module.css";
import Minimap from "./Minimap/Minimap";

export default function ContentContainer() {
  // states
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [currentScrollContainer, setCurrentScrollContainer] = useState<HTMLElement|null>(null)
  const [showButton, setShowButton] = useState<boolean>(true)
  const [siteAllowed, setSiteAllowed] = useState<boolean>(true)
  const [isFullHtml, setIsFullHtml] = useState<boolean>(false)

  // functions
  function updateCurrentUrl() {
    setCurrentUrl(location.href)
  }

  function delay(milliseconds: number) {
    return new Promise(res => setTimeout(res, milliseconds));
  }

  async function searchForChat(): Promise<null> {
    await delay(500)
    for (let i =0; i<10; i++) {
      const chat = queryChatContainer()
      if (chat) {
          setCurrentScrollContainer(chat.parentElement)
          setIsFullHtml(false)
          return null
      }
      await delay(300)
    }
    setCurrentScrollContainer(document.documentElement)
    setIsFullHtml(true)
    return null
}

  // On initial render
  useEffect(() => {
    const urlObserver = new MutationObserver(updateCurrentUrl)
    urlObserver.observe(document, {childList: true, subtree: true})
    chrome.storage.local.get(["showButton", "allowedHosts"], (result) => {
      if (result.showButton !== undefined) {
        setShowButton(result.showButton);
      }
      const hosts = Array.isArray(result.allowedHosts) ? result.allowedHosts as string[] : ["*"]
      const hostname = location.hostname
      const allowed = hosts.includes("*") || hosts.some(h => hostname.includes(h))
      setSiteAllowed(allowed)
    });
  }, [])

  // On current url change
  useEffect(() => {
    if (siteAllowed) {
      searchForChat()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl, siteAllowed])

  return (
 
      <div className={styles.appContainer}>
        {showButton && siteAllowed && (
          <Minimap elementToMap={currentScrollContainer} isFullHtml={isFullHtml} />
        )}
      </div>

  );
}
