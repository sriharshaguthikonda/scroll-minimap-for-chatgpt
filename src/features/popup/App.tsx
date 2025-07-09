import styles from './App.module.css'
import demoImage from '../../assets/demo.png'
import logoImage from '../../assets/logo.png'
import { FaGithub, FaStar } from 'react-icons/fa'
import { MdBugReport } from 'react-icons/md'
import { useEffect, useState } from 'react'


function App() {
  const [showButton, setShowButton] = useState(true)
  const [enableAll, setEnableAll] = useState(false)
  const [enableSite, setEnableSite] = useState(false)
  const [currentHost, setCurrentHost] = useState('')

  function toggleShowButton(newValue: boolean) {
    setShowButton(newValue)

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTabID = tabs[0].id
      if (currentTabID) {
        chrome.tabs.reload(currentTabID)
      }
    });

  }


  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url ? new URL(tabs[0].url) : null
      const host = url ? url.hostname : ''
      setCurrentHost(host)
      chrome.storage.local.get(["showButton", "enableAll", "enabledHosts"], (result) => {
        if (result.showButton !== undefined) {
          setShowButton(result.showButton)
        }
        const hosts: string[] = result.enabledHosts || []
        setEnableAll(!!result.enableAll)
        setEnableSite(hosts.includes(host))
      })
    })
  }, [])


  useEffect(() => {
    chrome.storage.local.set({ showButton: showButton });
  }, [showButton]);

  useEffect(() => {
    chrome.storage.local.get(["enabledHosts"], (result) => {
      const hosts: string[] = result.enabledHosts || []
      const index = hosts.indexOf(currentHost)
      if (enableSite && index === -1) {
        hosts.push(currentHost)
      } else if (!enableSite && index !== -1) {
        hosts.splice(index, 1)
      }
      chrome.storage.local.set({ enabledHosts: hosts })
    })
  }, [enableSite, currentHost])

  useEffect(() => {
    chrome.storage.local.set({ enableAll: enableAll })
  }, [enableAll])


  return (
    <div>
      <div className={styles.heading}>
        <img src={logoImage} />
        <h1>ChatGPT ScrollMap</h1>
      </div>

      <div className={styles.body}>

        <div>
          Enable ScrollMap on any website. Use the options below to control where it appears.
        </div>

        <div className={styles.demo}>
          <p>There should be a minimap button in the top right of chatgpt.</p>
          <img id="demo" src={demoImage} />
        </div>

        <details>
          <summary>Trouble shooting:</summary>
          <ul>
            <li>Refresh page if button has not appeared</li>
            <li>Click refresh button if chat contents do not match</li>
            <li>Make sure "hide minimap" is not selected below</li>
            <li><a target='_blank' href="https://github.com/Aebel-Shajan/scroll-minimap-for-chatgpt/issues">Make a bug report</a></li>
          </ul>
        </details>



      </div>

      <div
      className={styles.settings}
      >
        {/* <h3>
          Settings
        </h3> */}
        <div
          className={styles.checkbox}
          onClick={() => setEnableAll(!enableAll)}
        >
          <label>
            Enable on all sites
          </label>

          <input
            type="checkbox"
            checked={enableAll}
          />

        </div>

        {!enableAll && (
        <div
          className={styles.checkbox}
          onClick={() => setEnableSite(!enableSite)}
        >
          <label>
            Enable on {currentHost || 'this site'}
          </label>

          <input
            type="checkbox"
            checked={enableSite}
          />

        </div>
        )}
        <div
          className={styles.checkbox}
          onClick={() => toggleShowButton(!showButton)}
        >
          <label>
            Hide minimap
          </label>

          <input
            type="checkbox"
            checked={!showButton}
          // onChange={(e) => setShowButton(e.target.checked)}
          />

        </div>
      </div>
      <div className={styles.footer}>
        <a
          href="https://github.com/Aebel-Shajan/scroll-minimap-for-chatgpt"
          target="_blank">
          <FaGithub />
        </a>
        <a
          href="https://chromewebstore.google.com/detail/scroll-minimap-for-chatgp/apekbedjllgmacohbcckgipfhjddehkf"
          target="_blank">
          <FaStar />
        </a>
        <a
          href="https://github.com/Aebel-Shajan/scroll-minimap-for-chatgpt/issues"
          target="_blank">
          <MdBugReport />
        </a>
        <a
          href='https://buymeacoffee.com/aebel'
          target='_blank'
        >
          🎁
        </a>
        <a
          href='https://www.brainrotreader.com/'
          target='_blank'
        >
          📣
        </a>
      </div>
    </div>
  )
}

export default App
