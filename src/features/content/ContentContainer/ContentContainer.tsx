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
  const [isSiteEnabled, setIsSiteEnabled] = useState<boolean>(false)

  const isChatGPT = location.hostname.includes("chatgpt.com") || location.hostname.includes("chat.openai.com")

  // functions
  function updateCurrentUrl() {
    setCurrentUrl(location.href)
  }

  function delay(milliseconds: number) {
    return new Promise(res => setTimeout(res, milliseconds));
  }

  async function searchForChat(): Promise<null> {
    const isChatGPT = location.hostname.includes("chatgpt.com") || location.hostname.includes("chat.openai.com")
    if (!isChatGPT) {
      setCurrentScrollContainer(document.documentElement)
      return null
    }

    await delay(500)
    for (let i =0; i<10; i++) {
      const chat = queryChatContainer()
      if (chat) {
          setCurrentScrollContainer(chat.parentElement)
          return null
      }
      await delay(300)
    }
    setCurrentScrollContainer(null)
    return null
}

  // On initial render
  useEffect(() => {
    const urlObserver = new MutationObserver(updateCurrentUrl)
    urlObserver.observe(document, {childList: true, subtree: true})
    chrome.storage.local.get("showButton", (result) => {
      if (result.showButton !== undefined) {
        setShowButton(result.showButton);
      }
    });
    chrome.storage.local.get("enabledSites", (result) => {
      const host = location.hostname.replace(/^www\./, "")
      const sites = result.enabledSites || ["chatgpt.com"]
      if (!result.enabledSites) {
        chrome.storage.local.set({ enabledSites: sites })
      }
      setIsSiteEnabled(sites.includes(host))
    })
  }, [])

  // On current url change
  useEffect(() => {
    searchForChat()
    chrome.storage.local.get("enabledSites", (result) => {
      const host = location.hostname.replace(/^www\./, "")
      const sites = result.enabledSites || ["chatgpt.com"]
      setIsSiteEnabled(sites.includes(host))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl])

  return (

      <div className={styles.appContainer}>
        {showButton && isSiteEnabled && (
          <Minimap elementToMap={currentScrollContainer} isFullHtml={!isChatGPT} />
        )}
      </div>

  );
}
