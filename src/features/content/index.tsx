import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ContentContainer from './ContentContainer/ContentContainer.tsx'
import './index.css'

chrome.storage.local.get("enabledDomains", (result) => {
  const domainList: string = result.enabledDomains || "chatgpt.com";
  const domains = domainList.split(/[\n,\s]+/).filter(Boolean);
  const allowed = domains.includes("*") || domains.some(d => location.hostname.includes(d));
  if (!allowed) return;

  const contentRoot = document.createElement('div')
  contentRoot.id = 'content-root'
  document.body.appendChild(contentRoot)

  setTimeout(() => {
    if (!document.querySelector("#content-root")) {
      document.body.appendChild(contentRoot)
    }
  }, 3000) // Incase some other extension removes ours

  createRoot(contentRoot).render(
    <StrictMode>
        <ContentContainer />
    </StrictMode>,
  )
})
