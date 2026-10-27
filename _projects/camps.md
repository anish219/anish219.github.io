---
layout: layouts/article.njk
kind: project
tags:
- projects
permalink: /projects/camps.html
title: Rebuilding CAMPS in Python
label: Graduate Research · MIT LIDS / Electric Energy Systems Group · 2023–25
summary: Turning a MATLAB research simulator into a Python library for building power-system models, inspecting their equations, and studying what happens when they move away from equilibrium.
order: 40
group: 2023–25
when: 2023–25
context: MIT LIDS · Scientific software · Simulation
list_title: CAMPS power-system simulator in Python
list_summary: Implemented a power-system simulator in Python, including component state equations, system assembly, and solver integration, which was adopted by lab colleagues and an MIT course with 20+ students.
scripts:
- /assets/projects/camps/plotly-2.24.1.min.js
- /assets/projects/camps/chart.js
---

<figure class="trajectory-figure">
      <div class="plot-controls">
        <label>Notebook example <select id="example"><option value="demo">Generator–line–load demo</option><option value="sheriff">Reduced SHERIFF microgrid</option></select></label>
        <label>State variable <select id="variable"><option value="all">All states</option></select></label>
      </div>
      <div id="trajectory" role="img" aria-label="Interactive plot of saved PyCAMPS state trajectories"></div>
      <p id="plot-status" class="meta" aria-live="polite">Loading the saved notebook output…</p>
      <figcaption>Actual saved output from my PyCAMPS notebooks. Choose an example or state variable to inspect; drag to zoom and double-click to reset. These traces are replayed from the archive, rather than recomputed in the browser.</figcaption>
    </figure>

At MIT’s Electric Energy Systems Group, I rebuilt CAMPS—*Centralized Automated Modeling of Power Systems*—in Python. The lab already had a MATLAB implementation and a modular modeling framework. My work was to turn that into a Python package that lab colleagues and students could use, while extending the models and making the setup and analysis workflow easier to work with.

What I liked about this project was that the equations stayed visible. You could define a generator, connect it to a transmission line and a load, inspect the assembled state equations, then solve and simulate that exact system. It made the connection between the math and the code very direct.

## Building systems from component models

PyCAMPS represents the grid as modules connected at buses. Each module carries its parameters, state variables, controllable inputs, port quantities, and symbolic state equations. Names are indexed by component, so two generators can have the same types of states without their symbols colliding.

The component library in the notebooks includes synchronous-machine variants, controlled machine and photovoltaic models, short and long transmission lines, and PQ and RL loads. The simplest demo uses three of those modules:

<div class="table-wrap">
      <table>
        <caption>The generator–line–load example</caption>
        <thead><tr><th scope="col">Module</th><th scope="col">States in this example</th><th scope="col">Role</th></tr></thead>
        <tbody>
          <tr><th scope="row"><code>Type4_1</code></th><td>Rotor angle and speed</td><td>Synchronous-machine dynamics</td></tr>
          <tr><th scope="row"><code>LongLine</code></th><td>Six voltage/current states in d–q coordinates</td><td>Dynamic transmission-line model</td></tr>
          <tr><th scope="row"><code>RLLoad</code></th><td>Two current states in d–q coordinates</td><td>Resistive–inductive load dynamics</td></tr>
        </tbody>
      </table>
    </div>

The generator exposes electrical ports to the network while retaining its mechanical states. The long line has left and right terminals, and the load connects at the receiving bus. The models also carry reference-frame angle, speed, and base-speed information so their equations can be assembled consistently.

## Assembling the network equations

The user supplies a list of modules and specifies which ports share each bus. From those connections, the system builds an interconnection matrix and Kirchhoff current-law constraints. The assembly process substitutes the connected port quantities into the component equations to produce the full system’s state equations.

```python
from pycamps.modules import Type4_1, LongLine, RLLoad
from pycamps.simulation import PowerSystem, Dynamics

generator = Type4_1("G1", BaseSpeed=377)
line = LongLine("TL_1_2", BaseSpeed=377)
load = RLLoad("L1", BaseSpeed=377)

modules = [generator, line, load]
buses = [
    [[generator], [line, "L"]],
    [[load], [line, "R"]],
]
system = PowerSystem("Example_1", modules, buses)
```

<p class="meta">A shortened version of the setup in the demo notebook. “L” and “R” identify the transmission line’s two terminals.</p>

That small example produces a ten-state nonlinear system. For instance, the load’s voltage terms become the receiving-end line voltages after assembly. Users can print both the individual component equations and the assembled equations as LaTeX, which is useful for checking the connections before trusting any numerical output.

This was the main value of automating the assembly: changing the network didn’t mean manually rederiving every interconnection equation. The component models and the bus specification supplied that structure.

## Equilibrium, stability, and nonlinear trajectories

Once the symbolic model is assembled, the `Dynamics` workflow handles parameter loading and numerical analysis. The demo first asks for the required parameters, then supplies a dictionary containing generator inertia and damping, electrical parameters, line resistance/inductance/capacitance, and load resistance and inductance. The sandbox also demonstrates loading component parameters from MATLAB `.mat` files.

```python
simulator = Dynamics(system)
simulator.get_required_parameters()
simulator.load_new_params(params_dictionary=params)

equilibrium = simulator.solve_equilibrium(method="hybr")
simulator.linearized_analysis(xf=equilibrium)

time, states = simulator.simulate_trajectory(
    xf=equilibrium,
    simulation_time=0.3,
    method="LSODA",
)
```

<p class="meta">The same analysis sequence used in the archived demo; <code>params</code> is its component-parameter dictionary.</p>

The equilibrium stage finds a state where the assembled derivatives vanish. Linearized analysis then examines the local system’s eigenvalues and participation factors, while time-domain integration shows the nonlinear trajectory. Those answer related but different questions: finding an equilibrium doesn’t mean it is stable.

The saved demo makes that distinction concrete. It finds an equilibrium, then reports an unstable eigenvalue of about **+1.4611**. The participation-factor output identifies the generator’s rotor angle and speed as the dominant participating states, with values near 0.50 each. That gives the user a place to investigate rather than only returning an unstable/stable flag.

The numerical trajectories and equilibrium values were also exported to `.mat` files, keeping them usable alongside the lab’s existing MATLAB workflows. The notebook adds interactive state selection and a time-range slider for inspecting the results.

## Checking the Python implementation against MATLAB

Moving a simulator between languages meant checking more than whether the code ran. In my May 2024 progress update, I compared MATLAB-assembled and Python-assembled systems and exercised both MATLAB and Python solution paths. Keeping model assembly and numerical integration separate helped narrow down where a discrepancy could originate.

<div class="comparison-grid">
      <figure><a href="/assets/projects/camps/matlab-assembly-matlab-solver.jpg"><img src="/assets/projects/camps/matlab-assembly-matlab-solver.jpg" loading="lazy" alt="Archived trajectory plot from MATLAB CAMPS with the MATLAB solve path"></a><figcaption>MATLAB CAMPS · MATLAB solve path</figcaption></figure>
      <figure><a href="/assets/projects/camps/python-assembly-matlab-solver.png"><img src="/assets/projects/camps/python-assembly-matlab-solver.png" loading="lazy" alt="Archived trajectory plot from Python CAMPS with the MATLAB solve path"></a><figcaption>Python CAMPS · MATLAB solve path</figcaption></figure>
      <figure><a href="/assets/projects/camps/matlab-assembly-python-solver.jpg"><img src="/assets/projects/camps/matlab-assembly-python-solver.jpg" loading="lazy" alt="Archived trajectory plot from MATLAB CAMPS with the Python solve path"></a><figcaption>MATLAB CAMPS · Python solve path</figcaption></figure>
      <figure><a href="/assets/projects/camps/python-assembly-python-solver.png"><img src="/assets/projects/camps/python-assembly-python-solver.png" loading="lazy" alt="Archived trajectory plot from Python CAMPS with the Python solve path"></a><figcaption>Python CAMPS · Python solve path</figcaption></figure>
    </div>

<p class="meta">Original plots from the May 2024 update. Each row compares the two model implementations under the same labeled solve path; the rows use different machine examples. These are development comparisons, rather than a numerical error-bound or performance benchmark.</p>

## Extending the models and the workflow

Beyond rebuilding the existing pipeline, I added dictionary-based parameter passing, default reference frames, and easier graph generation. These were small changes to the interface that made repeated experiments less cumbersome: fewer setup details to reconstruct each time, and a more direct path from a network description to a runnable model.

I also got the `SM7StateControl` model working and used it in the reduced SHERIFF example. The sandbox combines two controlled seven-state synchronous machines, a controlled photovoltaic module, four RL loads, and three long lines on four buses. The machine states include stator and rotor d–q currents, field current, rotor angle, and speed.

That example loads each component’s parameter file, finds an equilibrium, runs the participation-factor analysis, and integrates from a perturbed initial state—`xf * 1.1` in the notebook. The saved output contains 38 state trajectories. You can inspect those in the plot at the top of this page by selecting the reduced SHERIFF example.

I also explored a custom line model without dynamic derivatives and graph-building and topology stress-test helpers. Those notebooks were useful places to try extensions; some helpers remained commented-out experiments rather than finished package features.

## Making it usable in the lab and classroom

The library was adopted by colleagues in the Electric Energy Systems Group and used in **MIT 6.7120, Models, Controls of Energy Systems**, with over 20 students. That made documentation and a repeatable setup part of the work. A student needed a path from importing the package to understanding the equations and interpreting a stability result.

<figure>
      <a href="/assets/projects/camps/api-documentation.png"><img src="/assets/projects/camps/api-documentation.png" loading="lazy" alt="Archived PyCAMPS API documentation for PowerSystem, showing the system name, module list, and bus connections"></a>
      <figcaption>The API documentation from my September 2024 update, including the inputs needed to construct a power system.</figcaption>
    </figure>

The demo notebook walked through that sequence step by step: instantiate components, connect buses, inspect equations, discover parameters, solve, linearize, and simulate. It also encouraged users to perturb the initial state and see how the response changed.

The archived notebooks show an earlier period when PyCAMPS was published on PyPI. We later took it off the public index and hosted the Python package on the lab’s local server, where users could pull it into their environments. The examples and parameter files remained the entry point for using the library.

## Where it fit in the lab’s work

CAMPS supplied the component-level dynamics side of the lab’s broader power-system modeling work. The larger digital-twin architecture considered how dynamic simulation should exchange information with static power-flow analysis and economic-dispatch models. That raised practical questions about reference frames, parameter consistency, and when a change in one model should trigger a new analysis in another.

For me, the project was a lesson in building scientific software that someone else could actually use. Porting equations was one part of it. Connecting those equations correctly, diagnosing unstable modes, preserving the existing data workflow, and making the package understandable to researchers and students were just as central to getting it used.

MIT Electric Energy Systems Group · Laboratory for Information and Decision Systems · [Lab website](https://eesg.mit.edu/)
