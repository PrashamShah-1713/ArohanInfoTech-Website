import { useEffect } from 'react'

const updateMetaTag = (selector, attributes) => {
  let tag = document.head.querySelector(selector)

  if (!tag) {
    tag = document.createElement('meta')
    Object.keys(attributes).forEach((key) => {
      if (key !== 'content') {
        tag.setAttribute(key, attributes[key])
      }
    })
    document.head.appendChild(tag)
  }

  if (attributes.content) {
    tag.setAttribute('content', attributes.content)
  }

  return tag
}

const updateLinkTag = (rel, href) => {
  let link = document.head.querySelector(`link[rel=\"${rel}\"]`)

  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }

  link.setAttribute('href', href)
  return link
}

const getPageUrl = (url) => {
  if (url) return url
  if (typeof window === 'undefined') return undefined
  return window.location.href
}

const SEOTags = ({
  title,
  description,
  keywords,
  image,
  url,
  noindex = false,
}) => {
  useEffect(() => {
    if (title) {
      document.title = title
    }

    if (description) {
      updateMetaTag('meta[name="description"]', { name: 'description', content: description })
      updateMetaTag('meta[property="og:description"]', { property: 'og:description', content: description })
      updateMetaTag('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    }

    if (keywords) {
      updateMetaTag('meta[name="keywords"]', { name: 'keywords', content: keywords })
    }

    updateMetaTag('meta[name="robots"]', {
      name: 'robots',
      content: noindex ? 'noindex, nofollow' : 'index, follow',
    })

    if (title) {
      updateMetaTag('meta[property="og:title"]', { property: 'og:title', content: title })
      updateMetaTag('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    }

    if (image) {
      updateMetaTag('meta[property="og:image"]', { property: 'og:image', content: image })
      updateMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: image })
      updateMetaTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    }

    const pageUrl = getPageUrl(url)
    if (pageUrl) {
      updateLinkTag('canonical', pageUrl)
      updateMetaTag('meta[property="og:url"]', { property: 'og:url', content: pageUrl })
    }
  }, [title, description, keywords, image, url, noindex])

  return null
}

export default SEOTags
