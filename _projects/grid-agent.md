---
layout: layouts/article.njk
kind: project
tags:
- projects
permalink: /projects/grid-agent.html
title: Building an explainable power-grid assistant
label: M.Eng. Thesis · MIT EECS / Electric Energy Systems Group · 2025
summary: I wanted to see whether an LLM could help make grid-operation decisions, and how much difference it would make to give it access to a simulator.
card_image: /assets/projects/grid-agent/benchmark-grid.png
card_image_alt: Grid2Op power grid network with substations, generators, loads, and line loading values
order: 30
group: '2024'
when: '2024'
context: M.Eng. thesis · Agent evaluation · Power systems
list_title: An explainable power grid operation assistant
list_summary: Built and evaluated tool-using AI agents on grid operation scenarios.
links:
- label: read the thesis
  url: https://hdl.handle.net/1721.1/159085
---

<figure>
      <a href="/assets/projects/grid-agent/benchmark-grid.png"><img src="/assets/projects/grid-agent/benchmark-grid.png" width="1268" height="708" alt="Grid2Op benchmark network with 14 substations, generators, loads, and colored power lines labeled with their loading percentages"></a>
      <figcaption>The Grid2Op network used for the thesis evaluation: 14 substations, 20 lines, 6 generators, and 11 loads. Figure 2.1 in the thesis.</figcaption>
    </figure>

During my M.Eng. at MIT, I worked in the Electric Energy Systems Group on power-system simulation and control. The lab’s broader work connected secondary and tertiary grid coordination, including market bids and integration with PSS/E. Alongside that work, I built the LLM assistant that became my thesis as a **two-month side project**.

The question was fairly simple to ask: could a language model look at a grid’s state, recommend a useful action, and explain why? Actually testing that meant connecting the model to a power-system simulator and giving it decisions with consequences. A plausible explanation was only useful if the resulting action helped keep the simulated grid running.

## Giving the problem a concrete shape

“Help operate a power grid” is a pretty broad task. I narrowed it down to topology decisions in Grid2Op, using the Learn to Run a Power Network benchmark. The agent observed line loadings and the network configuration, then decided whether to reconnect a line or change how equipment was connected within a substation. The simulator applied the action and returned the next state.

This creates an interesting sequential problem. If a line becomes overloaded and disconnects, its power flow gets redistributed to other lines. Those can become overloaded too, leading to a cascading failure. A local change can help one part of the network while creating a problem somewhere else.

I tested two scenarios on a modified IEEE 14-bus grid: routine operation and a failure case that started with two lines disconnected. I compared the LLM agents with do-nothing, random, and expert-system baselines. All of this happened in simulation.

## The first agent could explain more than it could do

The first implementation used a 2024-era GPT-4 model (`gpt-4-0125-preview`) with a ReAct loop: observe the grid, produce an action and a rationale, submit the action, and repeat. I used structured output schemas to get the response into the format Grid2Op expected.

Even that interface took iteration. Without examples, the model would invent its own action format. It could also identify an overloaded line and explain why changing the topology might help, then stop short of producing a useful action because it didn’t know what the change would actually do.

<figure>
      <img src="/assets/projects/grid-agent/naive-agent.png" loading="lazy" alt="Original thesis diagram of the initial agent loop between Grid2Op observations, the language model, and submitted actions">
      <figcaption>The initial ReAct implementation. The model received the grid observation and returned an action directly. Figure 2.2 in the thesis.</figcaption>
    </figure>

That gap showed up in the results. The naive agent failed partway through both evaluation scenarios. Being able to talk about power systems hadn’t given it a reliable way to predict the effect of changing the network.

## Letting the agent use the simulator

The next version used LangGraph to put another tool-use loop inside each timestep. Before committing to an action, the agent could rank overloads, ask an expert-system simulator for candidate topologies, generate recovery or reconnection actions, combine actions, and simulate their effects.

<figure>
      <a href="/assets/projects/grid-agent/tool-agent.png"><img src="/assets/projects/grid-agent/tool-agent.png" loading="lazy" alt="Original thesis diagram showing the language model interacting with Grid2Op and tools for ranking overloads, ranking topologies, restoring topology, and reconnecting lines"></a>
      <figcaption>The nested ReAct design. The four main tools are shown here; action-combination and action-simulation tools supported the same loop. Figure 2.3 in the thesis.</figcaption>
    </figure>

This gave the model something concrete to work with. It could ask which line needed attention, get a candidate action grounded in a power-flow simulation, and choose from the generated actions. It also meant the tool interfaces became a large part of the engineering work.

For example, I separated choosing a tool from supplying its parameters so the inputs would be parsed correctly. Tool calls also made the conversation history grow quickly. At the end of each timestep, I summarized the observation, goal, tool use, and chosen action, then carried that summary into the next step instead of keeping the entire conversation.

## What changed in the results

The tool-assisted agent completed both one-hour scenarios. In the cascading-failure case, it used a topology change at substation 3 to relieve the overloads, then continued operating. The expert-system baseline also completed that scenario; the naive LLM, random agent, and do-nothing agent did not.

<figure>
      <a href="/assets/projects/grid-agent/tool-run-grid.png"><img src="/assets/projects/grid-agent/tool-run-grid.png" width="1268" height="708" loading="lazy" alt="Grid state from the tool-assisted run after the first topology action, with line loading percentages below their limits"></a>
      <figcaption>The tool-assisted run after its first topology action in the cascading-failure scenario. Figure B.5 in the thesis.</figcaption>
    </figure>

<div class="table-wrap">
      <table>
        <caption>Did the agent complete the 12-step episode?</caption>
        <thead><tr><th scope="col">Agent</th><th scope="col">Routine operation</th><th scope="col">Cascading failure</th></tr></thead>
        <tbody>
          <tr><th scope="row">Do nothing</th><td>Yes</td><td>No</td></tr>
          <tr><th scope="row">Random</th><td>No</td><td>No</td></tr>
          <tr><th scope="row">Expert system</th><td>Yes</td><td>Yes</td></tr>
          <tr><th scope="row">Naive LLM</th><td>No</td><td>No</td></tr>
          <tr><th scope="row">LLM with tools</th><td>Yes</td><td>Yes</td></tr>
        </tbody>
      </table>
    </div>

<p class="meta">Completion outcomes from thesis Tables 3.1–3.2. Each scenario covered 12 five-minute timesteps, or one simulated hour. Completion alone does not measure operating efficiency.</p>

The routine-operation result was less encouraging. Although the tool-assisted agent survived, it had higher operating costs than both the expert baseline and simply doing nothing. Its tools were designed around fixing overloads, so they were much less useful when the grid was already stable.

In the failure scenario, the tool-assisted agent’s reported cost was slightly lower than the expert agent’s, but the evaluation was too small to establish an advantage. Compute and API costs limited the runs to one hour each. The useful result was seeing where the tool-assisted design helped and where its interfaces still constrained it.

## Keeping the operator in the picture

The motivation for an explainable assistant was also about the person using it. Earlier in the project, I built a Grid Guardian interface that put a network visualization beside a chat panel, so a user could inspect the grid and ask about it in the same place.

<figure>
      <a href="/assets/projects/grid-agent/early-interface.png"><img src="/assets/projects/grid-agent/early-interface.png" loading="lazy" alt="Early Grid Guardian prototype with a network visualization on the left and a natural-language assistant panel on the right"></a>
      <figcaption>An earlier Grid Guardian prototype from my December 2024 demo slides. This interface preceded the final Grid2Op evaluation.</figcaption>
    </figure>

The thesis also made the limits of that idea clearer. A readable rationale gives someone a way to inspect a recommendation, but it doesn’t establish that the recommendation is correct. Evaluating how well the assistant actually helped human operators remained future work.

## Revisiting this with modern models

These results reflect 2024-era LLMs. I expect modern models to perform substantially better, and rerunning the benchmark is a natural avenue for future research. It would be interesting to see which failures improve with a newer model and which still require changes to the tools or the way the agent interacts with the simulator.

A useful follow-up would keep the same scenarios and baselines for comparison, then extend the evaluation to longer episodes and larger grids. That would let us test how much progress comes from the model itself and how much comes from a better-designed system around it.

## Training on outcomes with RLVR

An even more interesting direction is **reinforcement learning with verifiable rewards (RLVR)**: training a model using outcomes that can be checked programmatically. My thesis used Grid2Op to evaluate prompted agents; it didn’t train the LLM’s weights through interaction with the grid. With a sufficiently high-fidelity simulator, there’s an opportunity to turn that interaction into a training loop and work toward automating more of grid operation.

The model could propose an action or sequence of tool calls, the simulator could execute it, and a verifier could score the resulting trajectory. Useful signals might include whether the actions were legal, demand remained served, modeled voltage and thermal limits were respected, and operating losses were reduced. The reward would need to consider a long enough horizon that fixing an immediate overload while causing a later failure wouldn’t count as success. The appeal is having feedback grounded in simulated consequences rather than how convincing the explanation sounds, extending the idea of [rule-based outcome rewards used in reasoning-model training](https://arxiv.org/html/2501.12948v1).

That makes simulator fidelity a central research question. Grid2Op already provides an RL environment, but its [documentation separates the decision-making framework from the power-flow backend and the time-series data](https://grid2op.readthedocs.io/en/latest/grid2op.html). It can work with historical grid states and different solvers; being an RL environment alone doesn’t establish how closely a particular setup matches a real grid. My small, five-minute-step benchmark also didn’t establish fidelity for faster electrical dynamics.

I’d want to validate the simulator against operational data and trusted engineering models, then train and test across different topologies, load profiles, outages, and observation errors. Evaluation on held-out scenarios and an independent simulator would help check whether the model learned useful operating behavior or exploited shortcuts in its training environment. A reward can verify success within the modeled system; showing that those gains transfer to real grid operation is the next research challenge.

## What I took away

The biggest lesson for me was how much the agent’s behavior depended on the tools it could use. The first version had broad freedom to suggest actions but little ability to check them. The next version could use physics-based simulation, but it inherited the assumptions and limitations of those tools.

For a two-month project, I was glad to get far enough to compare those designs against baselines and see specific failure modes. It gave me a much more concrete way to think about AI for physical systems: what information does the model need, which decisions should it make, and how can we check what happens when it acts?

*Toward An Explainable Electric Power Grid Operation Assistant Using Large Language Models* · MIT M.Eng., February 2025 · Advisor: Marija D. Ilić · [Read the full thesis](https://hdl.handle.net/1721.1/159085)
