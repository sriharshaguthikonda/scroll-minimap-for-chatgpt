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
  const [enabled, setEnabled] = useState<boolean>(false)

  // functions
  function updateCurrentUrl() {
    setCurrentUrl(location.href)
  }

  function refreshSettings() {
    const host = location.hostname
    chrome.storage.local.get(["enableAll", "enabledHosts", "showButton"], (result) => {
      const enableAll = result.enableAll || false
      const hosts: string[] = result.enabledHosts || []
      setEnabled(enableAll || hosts.includes(host))
      if (result.showButton !== undefined) {
        setShowButton(result.showButton)
      }
    });
  }

  function delay(milliseconds: number) {
    return new Promise(res => setTimeout(res, milliseconds));
  }

  async function searchForChat(): Promise<null> {
    if (!enabled) {
      setCurrentScrollContainer(null)
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
    refreshSettings()
  }, [])

  // On current url change
  useEffect(() => {
    // console.log("current url", currentUrl.slice(-2))
    refreshSettings()
    searchForChat()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl])

  return (
 
      <div className={styles.appContainer}>
        {showButton && <Minimap elementToMap={currentScrollContainer}/>}
      </div>

  );
}
