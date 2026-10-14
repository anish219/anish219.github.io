---
layout: layouts/article.njk
kind: post
tags: [posts]
permalink: /writing/teaching-so-arm101-to-thread-a-bracelet.html
title: "Teaching an SO-ARM101 to Thread a Bracelet"
label: "Physical AI · Part 1 of N"
summary: "Hardware, demonstration collection, the learning pipeline, and the first real-robot ACT evaluation."
description: "Hardware, demonstration collection, the learning pipeline, and the first real-robot ACT evaluation."
date: 2026-09-21
date_label: "Part 1"
series_order: 1
series: physical-ai
homepage_writing: false
has_mermaid: true
---

*By Anish Ravichandran · Part 1 of Building a Robot Learning System*

## Motivations

I bought an SO-101 arm on a whim to see for myself how real these physical AI demos on my feed were, and to see how far the robotics industry has come since my time at Boston Dynamics. I'm trying to figure out where RL, IL, VLAs, and world models beat the classical robotics stack and where it still makes sense to stick with the tried-and-tested methods for the sake of reliability.

Instead of the traditional pick-and-place task, I wanted to do something a little more manipulation-focused, and this became the starting point for a much larger series, starting with a small robot and a surprisingly non-trivial task: pick up a beaded bracelet, loop it over the tip of an Eiffel Tower toy, and release it so that it remains looped around the tower. Additional variants were added that would vary the bracelet, tower, and robot starting position.

![Real robot and simulation paired success](/assets/blog/physical-ai/trial1.gif)

**Task demo:** Real robot on the left, fixed-command Isaac Sim replay on the right (4× speed).

## The task exposes several parts of the stack

While it's easy to visualize from the video, the task is difficult to reduce to one target pose.

The gripper must approach the bracelet and grasp a bead without slipping between beads or pushing the bracelet away. The elastic bracelet loop changes shape during transport. The arm has to bring the opening across the tower’s crown, far enough to loop it around the tower but not too far to topple to tower over or unhook the bracelet. A policy can approach correctly and still fail at any of those transitions.

That made it a useful task for investigating the whole manipulation pipeline:
- Camera geometry affects the approach
- Joint tracking affects the grasp
- Timing affects transport
- Contact and release determine whether the task actually finishes.

I wanted an experiment in which those dependencies could be inspected.

I used a leader arm for demonstrations and a follower arm for execution. An overhead camera captured the broader scene, while a wrist camera produced the view near the gripper. The recording setup used two 640 × 480 camera streams, captured with supported 30 fps camera settings and sampled into the real demonstration dataset at 20 Hz.

Those rates describe different things. The camera capture setting, dataset sampling rate, model prediction rate, and motor-command rate all need explicit definitions. Later experiments showed why treating them as one “control frequency” makes failures harder to diagnose.

## Building the demonstration loop

The project was built on HuggingFace's open-source [LeRobot platform](https://huggingface.co/docs/lerobot/index), with the [LeLab GUI](https://github.com/huggingface/leLab) providing a useful interface for recording and inspecting episodes, though I did spend a lot of time adding hardware integration, manual capture controls, repeatable resets, evaluation telemetry, and eventually simulation and policy adapters to the bare-bones GUI.

The first main bracelet dataset contained 50 demonstrations, with 10 examples in each of 5 broad starting areas around the tower. That gave the initial learner variation in approach direction, but did not guarantee coverage of every bracelet orientation, robot starting pose, or recovery state.

## What ACT contributed

ACT, or Action Chunking with Transformers, predicts a sequence of future actions from observations. Its original formulation combines a conditional variational autoencoder (CVAE) with a transformer policy. Predicting chunks gives the learner a way to represent temporally extended behavior. The method and its original manipulation experiments are described in [Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware](https://arxiv.org/abs/2304.13705).

For my first real-robot evaluation, the checkpoint had trained for 10,000 optimizer steps (severely undertrained but I was curious to see how it did, plus excited to finally train a model locally on my laptop's Apple M4 Pro chip). It predicted 40-action chunks and executed 10 actions before refreshing the prediction. The requested policy rate was 20 Hz, and temporal ensembling was off.

At that rate, 10 actions nominally span a half-second. Every refresh therefore creates an interface between the trajectory already underway and a newly predicted future. Whether that interface is smooth depends on the prediction, the inference delay, and the execution loop.

## The first scored evaluation

The evaluation used 20 scheduled rollouts with a 30-second timeout (most task demonstrations were under 15 seconds). One completed autonomously and 19 timed out. Some attempts did not establish a grasp, while others moved leftward beyond the expected approach. Even the sole successful trial had jerky control.

## The stack that grew out of the baseline

The follow-up work developed in three directions.

First, I investigated the physical execution loop. The motor traces helped distinguish a policy requesting leftward motion from a joint drifting independently. Timing traces exposed delays at chunk boundaries. An interpolation diagnostic improved command cadence and perceived smoothness, while leaving task-success improvement unestablished. This meant the physical robot wasn't the real problem.

Second, I built a real-to-sim-to-real pipeline. It reconstructed a captured scene, generated an expert trajectory in Isaac Sim, replayed the exact exported commands in simulation, and then executed reviewed commands on hardware. Running paired trials eventually helped me debug and the trajectory-transfer loop finally completed the task.

Third, I used the simulator to generate demonstrations and evaluate learned policies. That led to ACT training studies and fine-tuning experiments with SmolVLA and GR00T N1.5. Their results supplied new evidence about data interfaces, action prediction, and closed-loop behavior.

The useful output of the project was a system in which a bad rollout could lead to a specific investigation. By the end, I could ask whether an apparent failure came from scene reconstruction, actuator response, an observation mismatch, an inference stall, or a learned trajectory and identify the next measurement that would help distinguish them.

That is where the next post begins: with the jerks and leftward motion in the first ACT eval.

---

[Series overview](/writing/physical-ai-series.html)
