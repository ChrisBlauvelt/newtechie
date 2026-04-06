<script>
  import { onMount } from "svelte";

  // Optional: We can add some logic here if we need dynamic interactive elements later
  // such as mouse tracking for a spotlight effect.
</script>

<div class="blueprint-bg fixed inset-0 -z-50 pointer-events-none">
  <!-- CSS Grid Background -->
  <div class="grid-layer absolute inset-0"></div>

  <!-- Tracing line glow effects -->
  <div class="line-tracer tracer-h tracer-1"></div>
  <div class="line-tracer tracer-h tracer-2"></div>
  <div class="line-tracer tracer-v tracer-3"></div>
  <div class="line-tracer tracer-v tracer-4"></div>
  <div class="line-tracer tracer-h tracer-5"></div>
  <div class="line-tracer tracer-v tracer-6"></div>

  <!-- Subtle overlay for depth -->
  <div class="radial-gradient-overlay absolute inset-0"></div>
</div>

<style>
  .blueprint-bg {
    background-color: #0b1120; /* Dark slate typical of SaaS themes */
    overflow: hidden;
  }

  .grid-layer {
    /* Blueprint grid pattern using linear gradients */
    background-image: linear-gradient(
        to right,
        rgba(20, 184, 166, 0.1) 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, rgba(20, 184, 166, 0.1) 1px, transparent 1px);
    background-size: 50px 50px; /* Grid cell size */
    opacity: 0.8;
  }

  .radial-gradient-overlay {
    background: radial-gradient(circle at center, transparent 0%, #0b1120 100%);
    opacity: 0.9;
  }

  /* Base tracer styling */
  .line-tracer {
    position: absolute;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(20, 184, 166, 0.8),
      transparent
    );
    box-shadow: 0 0 10px 2px rgba(20, 184, 166, 0.4);
    opacity: 0;
  }

  /* Horizontal tracers */
  .tracer-h {
    height: 1px;
    width: 200px; /* Length of the light beam */
    background: linear-gradient(
      90deg,
      transparent,
      rgba(45, 212, 191, 1),
      transparent
    );
    animation: trace-h 10s infinite linear;
  }

  /* Vertical tracers */
  .tracer-v {
    width: 1px;
    height: 200px;
    background: linear-gradient(
      180deg,
      transparent,
      rgba(45, 212, 191, 1),
      transparent
    );
    animation: trace-v 12s infinite linear;
  }

  /* Specific Positions and Delays directly along the grid lines (multiples of 50px) */
  .tracer-1 {
    top: 150px;
    left: -200px;
    animation-duration: 8s;
  }

  .tracer-2 {
    top: 450px;
    right: -200px;
    animation: trace-h-reverse 15s infinite linear;
    animation-delay: 2s;
  }

  .tracer-3 {
    left: 200px;
    top: -200px;
    animation-duration: 11s;
    animation-delay: 1s;
  }

  .tracer-4 {
    left: 650px;
    bottom: -200px;
    animation: trace-v-reverse 14s infinite linear;
    animation-delay: 4s;
  }

  .tracer-5 {
    bottom: 250px;
    left: -200px;
    animation-duration: 10s;
    animation-delay: 5s;
  }

  .tracer-6 {
    right: 300px;
    top: -200px;
    animation-duration: 9s;
    animation-delay: 3s;
  }

  /* Animations for the tracers */
  @keyframes trace-h {
    0% {
      left: -200px;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      left: 100vw;
      opacity: 0;
    }
  }

  @keyframes trace-h-reverse {
    0% {
      right: -200px;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      right: 100vw;
      opacity: 0;
    }
  }

  @keyframes trace-v {
    0% {
      top: -200px;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      top: 100vh;
      opacity: 0;
    }
  }

  @keyframes trace-v-reverse {
    0% {
      bottom: -200px;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      bottom: 100vh;
      opacity: 0;
    }
  }
</style>
