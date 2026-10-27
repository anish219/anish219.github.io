const exampleSelect = document.getElementById('example');
  const variableSelect = document.getElementById('variable');
  const plotStatus = document.getElementById('plot-status');
  const savedPlots = {};
  let activePlot;
  async function loadExample() {
    const key = exampleSelect.value;
    try {
      if (!savedPlots[key]) {
        const response = await fetch('/assets/projects/camps/' + (key === 'demo' ? 'demo-trajectory.json' : 'sheriff-trajectory.json'));
        if (!response.ok) throw new Error('Saved output unavailable');
        savedPlots[key] = await response.json();
      }
      activePlot = savedPlots[key];
      variableSelect.replaceChildren(new Option('All states', 'all'));
      activePlot.data.forEach(trace => variableSelect.add(new Option(trace.name, trace.name)));
      if (key === 'sheriff') variableSelect.value = 'omega_G22';
      drawPlot();
    } catch (error) {
      plotStatus.textContent = 'The saved interactive plot could not load. The original comparison plots below remain available.';
    }
  }
  function drawPlot() {
    const chosen = variableSelect.value;
    const traces = activePlot.data.filter(t => chosen === 'all' || t.name === chosen).map(t => ({...t, mode:'lines'}));
    const narrow = window.innerWidth < 600;
    const layout = {
      autosize:true, height:narrow ? 390 : 470,
      margin:{l:65,r:18,t:22,b:55},
      paper_bgcolor:'#fff',plot_bgcolor:'#fff',
      font:{family:'Arial, sans-serif',size:12,color:'#262a30'},
      xaxis:{title:'Time (s)',gridcolor:'#e6e8ea',rangeslider:{visible:true,thickness:0.13}},
      yaxis:{title:'Saved state value',gridcolor:'#e6e8ea'},
      showlegend:traces.length < 12 && !narrow,
      legend:{orientation:'h',y:-0.35,font:{size:10}},
      uirevision:exampleSelect.value + chosen
    };
    Plotly.react('trajectory', traces, layout, {responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d']});
    plotStatus.textContent = (exampleSelect.value === 'demo' ? '10 states · generator–line–load example' : '38 states · reduced SHERIFF · perturbed initial state') + ' · 0.3-second archived simulation. States retain their original scales and units.';
  }
  exampleSelect.addEventListener('change', loadExample);
  variableSelect.addEventListener('change', drawPlot);
  loadExample();
