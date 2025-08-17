import { useEffect } from 'react'
export default function useReveal(selector='.reveal', rootMargin='-10% 0px'){
  useEffect(() => {
    const els=[...document.querySelectorAll(selector)]
    if(!('IntersectionObserver' in window) || els.length===0){ els.forEach(e=>e.classList.add('is-visible')); return }
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target) }})
    },{ root:null, rootMargin, threshold:.12 })
    els.forEach(el=>io.observe(el))
    return ()=>io.disconnect()
  },[selector,rootMargin])
}
