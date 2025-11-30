export function Loading(){
  return (
    /* html */`
    <svg viewBox="0 0 200 200" class="loader-svg" aria-hidden="true">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 20 -10" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
      <g id="gooey" filter="url(#goo)">
        <circle class="dot" cx="100" cy="100" r="6" />
      </g>
    </svg>`
  )
}