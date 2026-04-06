<script>
  import { onMount, onDestroy } from "svelte";
  import { fade, slide, scale } from "svelte/transition";

  let activeIndex = 0;
  let isResolved = false;
  let cycleInterval;
  let resolveTimeout;

  const CYCLE_DURATION = 6000;
  const RESOLVE_DELAY = 1500; // time it takes to "solve" the problem

  onMount(() => {
    startCycle();
    return () => {
      stopCycle();
    };
  });

  function startCycle() {
    isResolved = false;
    // Initial resolve
    resolveTimeout = setTimeout(() => {
      isResolved = true;
    }, RESOLVE_DELAY);

    cycleInterval = setInterval(() => {
      isResolved = false;
      activeIndex = (activeIndex + 1) % 4;
      
      resolveTimeout = setTimeout(() => {
        isResolved = true;
      }, RESOLVE_DELAY);
    }, CYCLE_DURATION);
  }

  function stopCycle() {
    clearInterval(cycleInterval);
    clearTimeout(resolveTimeout);
  }

  // To let user click to see next demo
  function nextDemo() {
    stopCycle();
    isResolved = false;
    activeIndex = (activeIndex + 1) % 4;
    resolveTimeout = setTimeout(() => {
      isResolved = true;
    }, RESOLVE_DELAY);
    // Restart automatic cycling after manual interaction
    cycleInterval = setInterval(() => {
      isResolved = false;
      activeIndex = (activeIndex + 1) % 4;
      resolveTimeout = setTimeout(() => {
        isResolved = true;
      }, RESOLVE_DELAY);
    }, CYCLE_DURATION);
  }
</script>

<div class="w-full max-w-xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-900 flex flex-col cursor-pointer transition-all hover:shadow-[0_0_40px_rgba(20,184,166,0.15)]" role="button" tabindex="0" on:click={nextDemo} on:keydown={(e) => e.key === 'Enter' && nextDemo()}>
  <!-- macOS style window header -->
  <div class="bg-slate-800/80 backdrop-blur border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
    <div class="flex gap-2">
      <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
      <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
      <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
    </div>
    <div class="text-xs font-mono font-medium text-slate-400 tracking-wider">
      {#if activeIndex === 0} ~/app-dev 
      {:else if activeIndex === 1} ~/ai-agent
      {:else if activeIndex === 2} ~/managed-it
      {:else if activeIndex === 3} ~/home-assistant
      {/if}
    </div>
    <div class="w-12 text-xs text-slate-500 text-right font-mono">click</div> <!-- Spacer for center alignment -->
  </div>

  <!-- Content Body -->
  <div class="p-6 relative h-[320px] sm:h-[350px] overflow-hidden">
    
    <!-- State 0: App Dev (Code Breaks, fix it) -->
    {#if activeIndex === 0}
      <div class="w-full h-full flex flex-col font-mono text-sm" transition:fade={{ duration: 300 }}>
        <p class="text-slate-400 mb-4">// Production Database Query</p>
        
        <div class="bg-slate-950 p-4 rounded-lg border {isResolved ? 'border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.1)]' : 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]'} transition-all duration-500 relative">
          <p class="text-blue-400">SELECT <span class="text-purple-400">*</span> FROM <span class="text-yellow-300">orders</span></p>
          <p class="text-blue-400">WHERE <span class="text-slate-300">status</span> = <span class="text-green-300">'processing'</span></p>
          
          {#if isResolved}
            <p class="text-teal-400 mt-2 font-bold flex items-center gap-2" in:slide>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              TechieNeighbor.optimizeQuery()
            </p>
          {/if}
        </div>

        <div class="mt-8 flex items-center justify-between p-4 rounded-lg {isResolved ? 'bg-teal-900/20 text-teal-400' : 'bg-red-900/20 text-red-400'} transition-all duration-500">
          <div class="flex items-center gap-3">
            {#if !isResolved}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span class="font-bold">Error: Query Timeout</span>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span class="font-bold">Query Optimized</span>
            {/if}
          </div>
          <div>
            {#if !isResolved}
              <span class="font-bold animate-pulse">Latency: 15,000ms</span>
            {:else}
              <span class="font-bold">Latency: 12ms</span>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- State 1: Agentic AI -->
    {#if activeIndex === 1}
      <div class="w-full h-full flex flex-col" transition:fade={{ duration: 300 }}>
        <div class="flex justify-between items-end mb-6">
          <div>
            <h3 class="text-xl font-bold text-white mb-1">Support Inbox</h3>
            <p class="text-sm text-slate-400">Customer Inquiries</p>
          </div>
          <div class="px-3 py-1 rounded-full text-xs font-bold {isResolved ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}">
            <span class="{!isResolved ? 'animate-pulse' : ''}">{isResolved ? 'AI Agent Active' : 'Overwhelmed'}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 flex-1">
          <!-- Backlog counter -->
          <div class="bg-slate-800/50 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-700/50 relative overflow-hidden">
            <p class="text-slate-400 text-sm font-medium mb-2">Backlog Queue</p>
            {#if !isResolved}
              <p class="text-5xl font-bold text-red-400" in:scale>542</p>
            {:else}
              <p class="text-5xl font-bold text-blue-400" in:scale>0</p>
            {/if}
            
            {#if isResolved}
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" transition:slide></div>
            {/if}
          </div>

          <!-- Status Panel -->
          <div class="bg-slate-800/50 rounded-xl p-4 flex flex-col justify-center border border-slate-700/50">
            {#if !isResolved}
              <div class="space-y-3" in:fade>
                <div class="h-2 w-full bg-slate-700 rounded overflow-hidden">
                  <div class="h-full bg-red-400 w-[95%]"></div>
                </div>
                <p class="text-xs text-red-400 font-medium">Support SLA breached.</p>
              </div>
            {:else}
              <div class="space-y-3" in:fade>
                <div class="flex items-center gap-2 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                  <span class="text-sm font-bold">Local AI Processing</span>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Inquiries resolved</span>
                    <span class="text-blue-400">542 / 542</span>
                  </div>
                  <div class="h-2 w-full bg-slate-700 rounded overflow-hidden">
                    <div class="h-full bg-blue-400 w-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- State 2: Managed IT / Network -->
    {#if activeIndex === 2}
      <div class="w-full h-full flex flex-col" transition:fade={{ duration: 300 }}>
        <h3 class="text-xl font-bold text-white mb-6">Network Topology</h3>
        
        <div class="flex-1 relative flex items-center justify-center">
          <!-- Central Router -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-16 md:h-16 rounded-lg bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
          </div>

          <!-- Connection Lines -->
          <svg class="absolute inset-0 w-full h-full" style="z-index: 0;">
            <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="rgba(52, 211, 153, 0.4)" stroke-width="2" stroke-dasharray="4" class="animate-[dash_1s_linear_infinite]" />
            <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="rgba(52, 211, 153, 0.4)" stroke-width="2" stroke-dasharray="4" class="animate-[dash_1s_linear_infinite]" />
            <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="rgba(52, 211, 153, 0.4)" stroke-width="2" stroke-dasharray="4" class="animate-[dash_1s_linear_infinite]" />
            <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="{isResolved ? 'rgba(52, 211, 153, 0.4)' : 'rgba(239, 68, 68, 0.8)'}" stroke-width="2" stroke-dasharray="4" class="{isResolved ? 'animate-[dash_1s_linear_infinite]' : ''}" />
          </svg>

          <!-- Nodes -->
          <div class="absolute top-[25%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center">
             <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>
          <div class="absolute top-[25%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center">
             <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>
          <div class="absolute top-[75%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center">
             <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>
          
          <!-- Problem Node -->
          <div class="absolute top-[75%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-800 border-2 {isResolved ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'} flex items-center justify-center transition-all duration-500">
             <div class="w-1.5 h-1.5 rounded-full {isResolved ? 'bg-emerald-400 animate-pulse' : 'bg-red-500 animate-pulse'}"></div>
          </div>
        </div>

        <div class="mt-4 p-3 rounded-lg flex items-center justify-center backdrop-blur-sm border transition-all duration-500 {isResolved ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-red-900/20 border-red-500/30 text-red-500'}">
          {#if !isResolved}
            <span class="text-sm font-medium animate-pulse flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Critical: Access Point 04 Offline
            </span>
          {:else}
            <span class="text-sm font-medium flex items-center gap-2" in:fade>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Traffic Rerouted. Self-healing complete.
            </span>
          {/if}
        </div>
      </div>
    {/if}

    <!-- State 3: Home Assistant -->
    {#if activeIndex === 3}
      <div class="w-full h-full flex flex-col" transition:fade={{ duration: 300 }}>
        
        <div class="flex justify-between items-center mb-6">
           <h3 class="text-xl font-bold text-white flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
             Home Assistant
           </h3>
           <div class="relative">
             {#if !isResolved}
               <span class="px-2 py-1 rounded bg-red-900/40 text-red-500 text-xs font-bold border border-red-500/50 animate-pulse">Alert: Motion Detected</span>
             {:else}
               <span class="px-2 py-1 rounded bg-teal-900/40 text-teal-400 text-xs font-bold border border-teal-500/50" in:scale>Secured</span>
             {/if}
           </div>
        </div>

        <div class="grid grid-cols-2 gap-3 flex-1">
          <!-- Toggle 1: Doors -->
          <div class="bg-slate-800/80 rounded-xl p-4 flex flex-col justify-between border border-slate-700/50 transition-colors duration-500">
             <div class="flex justify-between items-start">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-colors duration-500 {isResolved ? 'text-teal-400' : 'text-slate-400'}"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
               <!-- Switch UI -->
               <div class="w-10 h-5 rounded-full flex items-center px-0.5 transition-colors duration-500 {isResolved ? 'bg-teal-500' : 'bg-slate-600'}">
                 <div class="w-4 h-4 bg-white rounded-full shadow transition-transform duration-500 {isResolved ? 'translate-x-5' : 'translate-x-0'}"></div>
               </div>
             </div>
             <div class="mt-4">
               <p class="text-white font-medium text-sm">Front Door</p>
               <p class="text-xs transition-colors duration-500 {isResolved ? 'text-teal-400' : 'text-slate-400'}">{isResolved ? 'Locked' : 'Unlocked'}</p>
             </div>
          </div>

          <!-- Toggle 2: Lights -->
          <div class="bg-slate-800/80 rounded-xl p-4 flex flex-col justify-between border border-slate-700/50 transition-colors duration-500">
             <div class="flex justify-between items-start">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-colors duration-500 {isResolved ? 'text-amber-400' : 'text-slate-400'}"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
               <div class="w-10 h-5 rounded-full flex items-center px-0.5 transition-colors duration-500 {isResolved ? 'bg-amber-500' : 'bg-slate-600'}">
                 <div class="w-4 h-4 bg-white rounded-full shadow transition-transform duration-500 {isResolved ? 'translate-x-5' : 'translate-x-0'}"></div>
               </div>
             </div>
             <div class="mt-4">
               <p class="text-white font-medium text-sm">Exterior Lights</p>
               <p class="text-xs transition-colors duration-500 {isResolved ? 'text-amber-400' : 'text-slate-400'}">{isResolved ? '100% Brightness' : 'Off'}</p>
             </div>
          </div>

          <!-- Camera Feed -->
          <div class="col-span-2 bg-slate-950 rounded-xl overflow-hidden border transition-colors duration-500 {isResolved ? 'border-teal-500/50' : 'border-slate-700/50'} relative h-20 flex items-center justify-center mt-1">
            {#if !isResolved}
               <p class="text-slate-500 text-sm font-mono flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                 Camera Idle
               </p>
            {:else}
               <p class="text-teal-400 text-sm font-mono flex items-center gap-2 z-10 drop-shadow-md" in:fade>
                 <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                 Recording: Driveway Feed
               </p>
               <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiPjwvcmVjdD4KPC9zdmc+')] opacity-40 z-0"></div>
               <div class="absolute inset-0 border-[3px] border-teal-500/30 rounded-xl"></div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="h-1 w-full bg-slate-800">
    {#key activeIndex}
      <div class="h-full bg-gradient-to-r from-teal-500 to-blue-500 origin-left" 
           class:animate-timer={true}
           style="animation: timer {CYCLE_DURATION}ms linear forwards;">
      </div>
    {/key}
  </div>
</div>

<style>
  @keyframes dash {
    to {
      stroke-dashoffset: -8;
    }
  }
  @keyframes timer {
    0% { width: 0%; }
    100% { width: 100%; }
  }
</style>
