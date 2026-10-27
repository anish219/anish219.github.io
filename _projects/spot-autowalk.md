---
layout: layouts/article.njk
kind: project
tags:
- projects
permalink: /projects/spot-autowalk.html
title: A summer building software for Spot
label: Boston Dynamics · Robotics Software Internship · Summer 2022
summary: Shipping Autowalk SDK examples, working on repeatable sensor pointing, and finding a few less industrial uses for a robot dog along the way.
card_image: /assets/projects/spot-autowalk/intern-group.jpg
card_image_alt: Boston Dynamics interns posing with Spot
card_image_position: center 32%
order: 70
group: '2022'
when: '2022'
context: Boston Dynamics · Robotics software internship
list_title: Spot Autowalk software and inspection imaging
list_summary: Built and tested SDK examples and an interface for camera and sensor state while invoking Autowalk; shipped sensor-pointing integration for repeatable inspection images.
---

<figure class="group-header">
      <img src="/assets/projects/spot-autowalk/intern-group.jpg" alt="The summer 2022 Boston Dynamics interns posing together with Spot">
      <figcaption>The summer 2022 intern crew, plus Spot.</figcaption>
    </figure>

I spent the summer of 2022 at Boston Dynamics working on software for Spot. My initial assignment was to build and ship SDK examples for the Autowalk service. I finished that work in under four weeks, which opened up the rest of the summer to a new project with the sensor-pointing team. I also worked on a voice-command side project, and somehow latte art became a competitive sport.

## Making Autowalk easier to use

[Autowalk](https://dev.bostondynamics.com/docs/concepts/autonomy/readme) lets an operator record a route and a sequence of actions, then have Spot repeat the mission autonomously. My assignment was to make the service easier to work with through the SDK: give developers examples they could use to understand the API and build their own workflows.

I built and tested the examples along with an interface for viewing fused camera feeds and sensor state while invoking mission functions. Having the robot’s view and state available alongside the controls made it easier to understand what was happening as a mission ran.

The work shipped to customers in under four weeks and was also used by the sales team. That was a pretty satisfying way to start the internship: something I built was already being used while I still had most of the summer ahead of me.

## Getting the same inspection image again

After finishing the initial assignment, I joined the sensor-pointing team. The problem there was more physical: if Spot returns to inspect a gauge, how do we get the sensor pointed at it consistently? Replaying an Autowalk didn’t guarantee the exact same location or pose. Spot could end up a few inches away from where it had been on the previous run, which was enough to change the camera’s view.

My work involved coordinating the robot’s leg services with third-party sensor services to account for that variation. Once Spot reached the Autowalk checkpoint, we adjusted the pitch, roll, and yaw of its body before adjusting the camera mount. A lot of the work was in getting the sequence of those adjustments right: moving the body changes where the camera is pointing, so the two couldn’t be treated independently.

We then captured an image, evaluated the gauge’s visibility with a computer vision model, and used that feedback to course-correct. It became a control problem: reach the checkpoint, adjust the body and camera, check the resulting view, and correct it. The goal was to get a useful inspection image despite the variation in where the robot started each time.

## A voice-command side project

I also built a voice-command interface for Spot as a fun side project. This was pre-ChatGPT, and I used a speech-to-text model from Google to listen for the wake phrase **“Hey Spot!”** I then mapped the phrase that followed to commands in the Spot SDK.

That let me tell Spot to stand, sit, follow me, or dance. The dance was a pre-programmed choreography, which made for a pretty fun command to have available. After spending time working with mission functions and sensor services, it was satisfying to get the robot to respond to something I could just say out loud.

## Spot, but with margaritas

There were also some robot applications that didn’t involve inspecting gauges. Margarita Spot was a pretty good reminder of where I was spending the summer.

<figure>
      <video controls playsinline preload="metadata" poster="/assets/projects/spot-autowalk/margarita-spot-poster.jpg" aria-label="Spot carrying a margarita setup at an outdoor gathering"><source src="/assets/projects/spot-autowalk/margarita-spot.mp4" type="video/mp4"><a href="/assets/projects/spot-autowalk/margarita-spot.mp4">Watch Margarita Spot</a></video>
      <figcaption>Margarita Spot in action.</figcaption>
    </figure>

<figure class="fun-photo">
      <a href="/assets/projects/spot-autowalk/margarita-spot.jpg"><img src="/assets/projects/spot-autowalk/margarita-spot.jpg" loading="lazy" alt="A photo with Spot carrying a margarita setup outdoors at Boston Dynamics"></a>
      <figcaption>An important category of robot interaction.</figcaption>
    </figure>

## The other competition: latte art

Alongside the robotics, there was a latte-art competition between the interns and employees. I kept photos of my attempts over the summer, which turned out to be a useful record of the learning process. The progress was not exactly linear.

<div class="latte-gallery" aria-label="Latte-art progression from July to August 2022">
      <figure><a href="/assets/projects/spot-autowalk/latte-01.jpg"><img src="/assets/projects/spot-autowalk/latte-01.jpg" loading="lazy" alt="Latte-art attempt photographed July 20, with a broad white shape in the crema"></a><figcaption>July 20</figcaption></figure>
      <figure><a href="/assets/projects/spot-autowalk/latte-02.jpg"><img src="/assets/projects/spot-autowalk/latte-02.jpg" loading="lazy" alt="Latte-art attempt photographed July 26, showing a rounded white foam shape"></a><figcaption>July 26</figcaption></figure>
      <figure><a href="/assets/projects/spot-autowalk/latte-03.jpg"><img src="/assets/projects/spot-autowalk/latte-03.jpg" loading="lazy" alt="Latte-art attempt photographed July 27, showing a large central patch of milk foam"></a><figcaption>July 27</figcaption></figure>
      <figure><a href="/assets/projects/spot-autowalk/latte-04.jpg"><img src="/assets/projects/spot-autowalk/latte-04.jpg" loading="lazy" alt="Latte-art attempt photographed August 10, with a more detailed branching pattern"></a><figcaption>August 10</figcaption></figure>
      <figure><a href="/assets/projects/spot-autowalk/latte-05.jpg"><img src="/assets/projects/spot-autowalk/latte-05.jpg" loading="lazy" alt="Latte-art attempt photographed August 24, showing a leafy pattern"></a><figcaption>August 24</figcaption></figure>
    </div>

If I remember correctly, I finished second. First place went to a former barista who was also the person who taught me how to do it in the first place, so I felt pretty good about that. I did beat all of the employees who participated!

## What I took away

The internship gave me a chance to work on several layers of a robotics system in one summer: making an API usable, coordinating hardware and sensor services, and experimenting with a new interaction method. It made the software side of robotics feel much more concrete. There was an actual robot on the other end of the code, and the result had to make sense on that robot.

Getting the first project shipped early also meant I got to do more than I’d initially expected. I started with SDK examples and ended up working on inspection workflows, with some voice commands and increasingly recognizable latte art in between.

*Robotics Software Intern · Boston Dynamics · Waltham, MA · June–August 2022*
