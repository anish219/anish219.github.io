---
layout: layouts/article.njk
kind: project
tags:
- projects
permalink: /projects/solar-sensor.html
title: Power design for a solar bus-stop sensing prototype
label: MIT 6.9000 · Engineering for Impact · Spring 2023
summary: Building a sensor for a bus stop meant thinking about more than the measurements. It also had to fit on a pole, send its data, and keep running without an outlet.
order: 60
group: 2023–25
when: '2023'
context: MIT Engineering for Impact · PCB design · Power budgeting
list_title: Solar-powered bus stop sensing prototype
list_summary: Designed and assembled the power-management PCB and modeled battery and solar endurance for a course prototype.
---

<figure>
      <video controls playsinline preload="metadata" poster="/assets/projects/solar-sensor/operation-poster.jpg" aria-label="Bus-stop sensing prototype operation demo with outdoor footage and temperature and humidity plots"><source src="/assets/projects/solar-sensor/operation.mp4" type="video/mp4"><a href="/assets/projects/solar-sensor/operation.mp4">Watch the prototype operation demo</a></video>
      <figcaption>Our prototype operation demo, pairing outdoor footage with the web display of temperature and humidity measurements.</figcaption>
    </figure>

In spring 2023, I took MIT’s Engineering for Impact course, where our team worked on a sensing prototype for Miami-Dade bus stops. The goal was to understand the experience of waiting for a bus: how hot and humid it was, how many people were waiting, and for how long.

The interesting part was how quickly a seemingly straightforward sensing problem became a whole-system design problem. We needed electronics, firmware, a server, a web interface, and an enclosure. We also needed a way to power all of it outdoors. A sensor that gives useful readings on a lab bench still has a lot left to prove before it can live on a bus-stop pole.

## Deciding what to measure

Early on, we considered cameras, infrared sensors, motion detection, and Wi-Fi/Bluetooth scanning for estimating occupancy. Each option came with a different set of tradeoffs around power, privacy, cost, and what it could actually tell us about the people waiting.

Our beta design used a temperature and humidity sensor, with Wi-Fi and BLE scanning for estimates of occupancy and wait time. We moved away from capturing images, and the design kept device MAC addresses off the server. Counting nearby wireless devices is still an approximation of counting people, so that distinction mattered when thinking about what the data meant.

An ESP32 handled the sensing and a Particle Boron provided cellular communication. On the server side, the system combined sensor data with bus predictions from Swiftly and presented the information through a web interface.

<figure>
      <a href="/assets/projects/solar-sensor/system-diagram.png"><img src="/assets/projects/solar-sensor/system-diagram.png" loading="lazy" alt="Original beta system diagram connecting bus-stop sensors, power management, microcontroller and cellular communication to the server and Swiftly bus predictions"></a>
      <figcaption>Our beta system diagram. The power system, sensing, cellular link, and server all had to work together. Click to view the original diagram.</figcaption>
    </figure>

## Making the power budget close

A bus stop doesn’t come with a convenient USB port. We designed around a rechargeable battery and solar panel, which meant looking at both how much energy we could collect and how much the system would use throughout the day.

Just adding up the components’ active current wasn’t enough. The power budget tracked operating, idle, and sleep states, along with how long each part spent in those states. The beta schedule checked occupancy every three minutes and temperature and humidity every twelve minutes. The gaps between measurements were an opportunity to save power.

That tied the hardware decisions directly to the firmware. The choice of regulator mattered, but so did whether the microcontroller and cellular board could spend time asleep instead of staying on between measurements.

<div class="budget-wrap">
      <table class="budget">
        <caption>Beta power-budget model</caption>
        <tbody>
          <tr><th scope="row">Battery</th><td>10,000 mAh at 3.7 V</td></tr>
          <tr><th scope="row">Solar panel</th><td>6 W nominal</td></tr>
          <tr><th scope="row">Modeled average consumption</th><td>About 264 mW</td></tr>
          <tr><th scope="row">Modeled battery-only runtime</th><td>About 5.8 days</td></tr>
        </tbody>
      </table>
    </div>

<p class="meta">The runtime is an estimate from our archived power budget using its component loads and duty-cycle assumptions, rather than a multi-day endurance measurement.</p>

## Getting from a schematic to a board

The power work went through several iterations as the rest of the system changed. We needed to charge the battery, accept solar input, and supply the voltages required by the sensing and cellular hardware. The project plan captures that progression from a working power-management setup to a revised PCB with solar input and a buck/boost stage.

<figure>
      <a href="/assets/projects/solar-sensor/power-schematic.jpg"><img src="/assets/projects/solar-sensor/power-schematic.jpg" loading="lazy" alt="Hand-drawn power-management schematic with charging, regulation, outputs and status-pin notes"></a>
      <figcaption>An early power-management sketch, including charging, regulation, and status signals.</figcaption>
    </figure>

We also had to turn the design into something we could assemble and test. That meant laying out the PCB, soldering surface-mount components, and bringing out connectors and test points so the board could be checked before connecting the rest of the system.

<figure>
      <img class="hardware" src="/assets/projects/solar-sensor/power-board.jpg" loading="lazy" alt="Assembled early MILO power-management PCB with surface-mount components, battery and output connectors, status LEDs and test points">
      <figcaption>An early assembled power board. The connectors, status LEDs, and test points made the circuit much easier to work with on the bench.</figcaption>
    </figure>

## Getting the pieces to work together

Once the boards were assembled, we could test a more useful question: could the hardware run together and get a measurement all the way to the web interface? The integration recording below follows the physical power setup through to the displayed data.

<figure>
      <video controls playsinline preload="metadata" poster="/assets/projects/solar-sensor/power-integration-poster.jpg" aria-label="Bench integration test showing the battery-powered board and the sensor data display"><source src="/assets/projects/solar-sensor/power-integration.mp4" type="video/mp4"><a href="/assets/projects/solar-sensor/power-integration.mp4">Watch the power-board integration test</a></video>
      <figcaption>A bench integration test connecting the power hardware with the rest of the sensing system.</figcaption>
    </figure>

The packaging had to be part of that conversation too. Our beta installation concept placed the enclosure inside the top of a bus-stop pole, with a solar panel above it. Board dimensions, battery size, mounting, and access to the sensors all affected what we could fit.

<figure>
      <img class="hardware" src="/assets/projects/solar-sensor/assembled-enclosure.jpg" loading="lazy" alt="Assembled MILO prototype enclosure opened to show the battery, circuit board and internal wiring">
      <figcaption>The assembled prototype enclosure with the battery and electronics inside.</figcaption>
    </figure>

## What I took away

For me, this project made the connection between hardware and software much more tangible. Changing how often we scanned for devices changed the power budget. Changing the power system changed the board layout. Changing the board layout changed the enclosure. Those decisions kept coming back around to each other.

It was also a useful exercise in deciding what was worth measuring in the first place. We started with a long list of possible sensors and narrowed it down as we understood the constraints. By the end, the question was much more concrete: could we put together a system that collected useful information, respected the people around it, and had a realistic plan for staying powered?

*Team STADZ · MIT Engineering for Impact, 6.9000 · Spring 2023*
