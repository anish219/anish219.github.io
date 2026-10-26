---
layout: layouts/article.njk
kind: project
tags:
- projects
permalink: /projects/ros-racecar.html
title: Perception and planning on an MIT ROS racecar
label: MIT Robotics Science and Systems · Spring 2023
summary: A semester of getting a small autonomous car to see, figure out where it was, and actually follow the path we gave it.
order: 50
group: 2023–25
when: '2023'
context: MIT coursework · ROS 2 · Computer vision
list_title: ROS racecar perception and planning
list_summary: Built and debugged an autonomous racecar with three teammates, from visual perception and localization on hardware to path planning and the final driving challenge.
---

<figure>
      <video controls playsinline preload="metadata" poster="/assets/projects/ros-racecar/race-day-poster.jpg" aria-label="Racecar driving on the indoor track during the final challenge"><source src="/assets/projects/ros-racecar/race-day.mp4" type="video/mp4"><a href="/assets/projects/ros-racecar/race-day.mp4">Watch the race-day clip</a></video>
      <figcaption>The final challenge race. The semester started with following a wall and ended on an indoor running track.</figcaption>
    </figure>

In spring 2023, I took MIT’s Robotics: Science and Systems course with three teammates. Over the semester, we built up a ROS 2 stack for a small racecar using camera images, LiDAR scans, and odometry. We started with wall following and a safety controller, then added visual servoing, localization, and path planning before putting things together for the final challenge.

We worked on visual target matching, evaluated localization on the physical car, and explored different approaches to path planning. A lot of the learning came from the gaps between those pieces: a path that looked reasonable on a map could still hit a wall, and a localization algorithm that was easy to score in simulation was much harder to evaluate on hardware.

## Getting the camera view into the control loop

The visual servoing lab connected computer vision to an actual action. We worked with color segmentation, template matching, and SIFT feature matching to locate targets in an image. Detecting something was only the first step. We then needed to turn its pixel location into a position relative to the car so a controller could use it.

For objects on the ground plane, a homography gave us that mapping. The final challenge extended the perception and control work to lane following. The debug view below shows the detected lines and a lookahead point overlaid on the camera image. Being able to see what the car thought it was following made the behavior much easier to reason about.

<figure>
      <img src="/assets/projects/ros-racecar/lane-debug.jpg" width="1440" height="900" loading="lazy" alt="Archived lane-following debug view with red detected lines and a green lookahead point over the indoor track">
      <figcaption>The lane-following debug view from a recorded test. The overlays expose the perception output before it becomes a steering command.</figcaption>
    </figure>

## Following the wrong lines

One issue that showed up on the actual track was that there were a lot more lines than the ones we wanted to follow. In the clip below, the car starts tracking the gray markings instead of the white lane boundaries. It was following a line, just not the right one.

<figure>
      <video controls playsinline preload="metadata" poster="/assets/projects/ros-racecar/wrong-line-tracking-poster.jpg" aria-label="Racecar tracking gray markings instead of the white track lines during testing"><source src="/assets/projects/ros-racecar/wrong-line-tracking.mp4" type="video/mp4"><a href="/assets/projects/ros-racecar/wrong-line-tracking.mp4">Watch the wrong-line tracking test</a></video>
      <figcaption>Before the final challenge: the car picks up the gray markings instead of staying with the white track lines.</figcaption>
    </figure>

We had to update our controller to be robust to those competing markings before the final challenge. This was a useful reminder that a controller can look reasonable in the debug view and still act on the wrong thing. Testing on the actual track exposed an assumption that was easy to miss when we were just trying to get lane following working.

## Knowing where the car was

For localization, our team implemented a particle filter that combined odometry with LiDAR observations of a known map. One interesting result was that adding noise helped. Without enough variation, the particles could converge too quickly on the wrong pose and stay there. In one simulated comparison, adding noise reduced the average position error from 15.6 m to 0.277 m.

When we evaluated the system on the physical car, we immediately lost the convenient ground-truth position available in simulation. We considered measuring out a grid or a known route, but ultimately used repeated visual checks of the estimated pose and the car’s movement. The real-car demo was useful evidence that localization was working, though it didn’t give us a precise hardware accuracy number.

<figure>
      <video controls playsinline preload="metadata" poster="/assets/projects/ros-racecar/localization-poster.jpg" aria-label="RViz visualization from the physical-car localization test"><source src="/assets/projects/ros-racecar/localization.mp4" type="video/mp4"><a href="/assets/projects/ros-racecar/localization.mp4">Watch the localization demo</a></video>
      <figcaption>A 40-second excerpt from our physical-car localization recording, showing the map and estimated pose in RViz. The error numbers above came from simulation.</figcaption>
    </figure>

## Finding a path was only part of the problem

We explored both A* and RRT* for planning through the map. With RRT*, the idea was to sample a point, extend the tree toward it, and update connections to improve the path cost. We also expanded obstacles in the occupancy map to account for the fact that the car takes up space.

The lab version of our RRT* planner still had problems avoiding walls. Looking back at the output, that’s a pretty useful reminder that producing a path and producing a path the car can safely drive are different milestones. The controller introduced another set of tradeoffs. A short lookahead could follow corners more closely but oscillate; a long lookahead could smooth things out and cut straight into a wall.

<figure>
      <img class="map" src="/assets/projects/ros-racecar/rrt-planning.png" width="628" height="452" loading="lazy" alt="RRT star planning output from the original lab report, showing a white path over the Stata basement occupancy map">
      <figcaption>The RRT* output from our original lab report. This was a development result; wall avoidance still needed work.</figcaption>
    </figure>

## Putting it together

The final challenge brought the semester’s work into two settings: racing around an indoor track and navigating a small city course with stop signs. After updating the controller to handle the competing track markings, we put it to the test in the race portion.

<figure>
      <video controls playsinline preload="metadata" poster="/assets/projects/ros-racecar/race-results-poster.jpg" aria-label="Race portion of the final challenge after updating the controller"><source src="/assets/projects/ros-racecar/race-results.mp4" type="video/mp4"><a href="/assets/projects/ros-racecar/race-results.mp4">Watch the final challenge race results</a></video>
      <figcaption>Our results on the race portion of the final challenge, after updating the controller.</figcaption>
    </figure>

The city course gave us a different setting to work with: taped roads, cardboard buildings, and tighter turns. The footage below shows a segment of that run.

<figure>
      <video controls playsinline preload="metadata" poster="/assets/projects/ros-racecar/city-driving-poster.jpg" aria-label="Racecar turning through taped roads and cardboard buildings on the city course"><source src="/assets/projects/ros-racecar/city-driving.mp4" type="video/mp4"><a href="/assets/projects/ros-racecar/city-driving.mp4">Watch the city-driving clip</a></video>
      <figcaption>A short clip from the city-driving run. This shows one segment of the course.</figcaption>
    </figure>

One of my biggest takeaways was how much easier debugging became once I could inspect the data moving between ROS nodes. Publishing intermediate results and visualizing them in RViz helped me understand the system far better than scattering print statements through the code.

The team side mattered too. At one point, several of us were trying to fix the same controller at once, and it became a “too many chefs in the kitchen” situation. I learned to be clearer about what I was working on and to ask for help earlier when I was stuck. Those are lessons I still want to carry into robotics work: make the system easy to inspect, test it on the actual hardware, and communicate before a small blocker becomes everyone’s problem.

*Team 17: Arnold Su, Anish Ravichandran, Anirudh Valiveru, and Devin McCabe. This was a team project built on the course’s supplied racecar platform and starter code.*
