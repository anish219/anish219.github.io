---
layout: layouts/page.njk
kind: cv
permalink: /cv.html
title: Anish Ravichandran
eyebrow: Curriculum vitae
description: 'Expanded CV for Anish Ravichandran: education, experience, projects, and selected MIT coursework.'
lead: Robotics software, scientific computing, and applied AI. This expanded CV adds project detail and coursework to the experience on my one-page resume.
meta: San Francisco, CA
---

## Education

### Massachusetts Institute of Technology

*Cambridge, MA · 2020–2025*

M.Eng. in Electrical Engineering and Computer Science, Artificial Intelligence concentration (February 2025). S.B. in Electrical Engineering and Computer Science (May 2024); GPA 4.61/5.00.

M.Eng. thesis: [Toward An Explainable Electric Power Grid Operation Assistant Using Large Language Models](https://hdl.handle.net/1721.1/159085).

## Experience

### Explain AI · Co-founder and CTO; advisor

*San Francisco, CA · February 2025–September 2026; advisor since September 2026*

- Built an AI-assisted enterprise reporting product with document ingestion, retrieval, cited generation, and human review in Word.
- Worked across a multitenant AWS stack, deployment, monitoring, and customer feedback. In one measured workflow, two users' combined reporting time fell from 14 to 5 hours across two monthly cycles.
- Read the [project note](/projects/explain-ai.html) for context and limits of that result.

### MIT Laboratory for Information and Decision Systems · Graduate Research Assistant

*Electric Energy Systems Group · Cambridge, MA · December 2023–February 2025*

- Reimplemented the CAMPS power-system simulator from MATLAB in Python, including component equations, system assembly, and solver integration.
- The Python workflow was used by lab colleagues and as material in an MIT course with more than 20 students.
- Investigated distributed control and grid monitoring; see the [CAMPS project note](/projects/camps.html).

### Nominal · Full Stack Software Engineer Intern

*Austin, TX / New York, NY · June–August 2023*

- Traced ingestion failures through Postgres, API contracts, Java services, and a Next.js interface so users could see actionable upload errors.
- Fixed a customer-reported time-series graph navigation bug and contributed production API and UI changes.

### Boston Dynamics · Robotics Software Intern

*Waltham, MA · June–August 2022*

- Built and tested Spot Autowalk SDK examples and an interface for camera feeds and sensor state while invoking mission functions; the work shipped to customers.
- Integrated sensor-pointing logic across robot leg and third-party sensor services for repeatable inspection images.
- Read the [Spot project note](/projects/spot-autowalk.html).

### Computation and Imaging · Summer Intern

*June–September 2021*

Explored phone-based 3D capture and photogrammetry for a high-precision imaging use case. The work was a feasibility experiment; the available depth hardware did not meet the intended precision requirement.

## Selected projects

### [Explainable power grid operation assistant](/projects/grid-agent.html)

*M.Eng. thesis · 2025*

Designed and evaluated tool-using LLM agents for topology decisions in two Grid2Op scenarios against naive, random, do-nothing, and expert baselines. Results were mixed and limited to those scenarios.

### [ROS racecar perception and planning](/projects/ros-racecar.html)

*MIT Robotics Science and Systems · Spring 2023*

Implemented SIFT and multiscale template matching, assessed localization on a physical car, and worked on RRT* and final-challenge integration.

### [Solar-powered bus stop sensing prototype](/projects/solar-sensor.html)

*MIT Engineering for Impact · Spring 2023*

Designed and assembled an Altium power-management PCB, integrated a prebuilt solar board and battery circuit with an ESP32, and modeled power endurance. This was a course prototype, not a field deployment.

### SO-101 arm imitation-learning project

*In progress · 2026*

Collecting teleoperation demonstrations for a small-object placement task. Training and evaluation remain to be completed.

## Selected coursework

### Robotics Science and Systems · MIT 6.4200

ROS, perception, localization, planning, and physical racecar labs. My [project note](/projects/ros-racecar.html) describes my individual contributions and integration challenges.

### Efficient Deep Learning · MIT 6.5940

Course assignments and a team project involving KV caching and sliding-window attention. I contributed evaluation code and a metric interface fix; I do not claim ownership of the team's cache optimization.

### Computational Sensorimotor Learning · MIT 6.8200

Policy learning, demonstrations, reward design, model-based learning, and sim-to-real concepts through assignments.

### Engineering for Impact · MIT 6.900

Team-based development of a [solar-powered sensing prototype](/projects/solar-sensor.html) for a bus stop concept, including electrical design and system power budgeting.

### Additional foundations

Coursework in machine learning, natural language processing, embedded systems, circuits, and software design. In MIT 6.115, I worked with assembly, PSoCs, and lab instrumentation and built an ESP32 photoresistor-controlled brightness project.

## Leadership

As president of MIT's Interfraternity Council, I coordinated a leadership council of more than 30 people and worked with students and administrators on health and safety. I also served as IFC recruitment chair and president of the South Asian Association of Students.

## Technical areas

**Direct experience:** Python scientific software, robot SDK integration, AWS product engineering, retrieval and document workflows, full-stack debugging, and evaluation of tool-using agents.

**Project experience:** ROS perception and planning, PCB design and assembly, energy budgeting, and power grid simulation.

Last updated September 2026. Project notes provide more context than this summary.
