# Behavioral Interviews

## Amazon Leadership Principles

### Customer Obsession

> Amazonians are encouraged to find ways to delight the customer before they know they’d like to be delighted.

+ Tell me about a time when you strongly **disagreed** with your manager or peer on something you considered very important to the business.
  + **S**: During development of our factory calibration pipeline for robotic mowers, I strongly disagreed with my manager's proposal to skip the camera reprojection validation step to save time in production.
  + **T**: The manager argued that since the calibration passed initial optimization with low residuals, we didn’t need a final projection check. But I believed that skipping this step could let silent failures (e.g. bad feature matches or incorrect chessboard detection) leak into production, which would degrade localization and ultimately hurt customer trust.
  + **A**: I respectfully raised my concern in our calibration review, backed by data from a recent batch where two units had excellent residuals but failed real-world testing due to wrong board detections. I showed how reprojection visualization would’ve caught those immediately. I also proposed a fast implementation of this check that added just 2 seconds per unit. I emphasized that catching bad units early avoids costly field returns and rework.
  + **R**: My manager agreed to test my proposal on the next 100 units. The check caught 3 failures that would’ve passed otherwise. It became a required step in our calibration line. This reinforced the value of speaking up with data—and balancing efficiency with long-term quality.

+ Tell me about a time when you overcommitted yourself or your company.
  
+ Tell me about one of your projects where you put customer first.

Use the calibration tool, improve user experience example

+ Describe a time when you went above and beyond to ensure a customer was satisfied with your service

+ Tell me about a time you had to deal with a difficult customer

Calibration tool example

### Invent and Simplify

> Engineers at Amazon are encouraged to innovate as well as cut costs.

+ Tell me about a time when you didn’t meet customer’s needs.

+ Give me an example of a complex problem you solved with a **simple solution**.
  + **S**: We needed a reliable way to calibrate stereo cameras and LiDARs in our factory line, which involved solving a large optimization problem with multiple sensor modalities and spatial constraints.
  + **T**: Initially, the team was considering building a full multi-sensor SLAM-based calibration system that accounted for all frames and extrinsics in one batch optimization. But this would have required complex infrastructure, long runtimes, and fragile convergence.
  + **A**: I proposed a much simpler approach: decompose the problem. Instead of solving everything (all parameters) together, I designed a step-by-step pipeline where each sensor was calibrated independently in a controlled setup using known targets, and then linked through a set of precisely measured rigid transformations. I reused intrinsic calibration from the factory, used a planar checkerboard for stereo extrinsic calibration, and employed a static LiDAR target to get LiDAR-to-camera transforms using point-to-plane error. This modular design allowed fast calibration (~30 seconds per mower), easy debugging, and repeatable results. No SLAM or complex optimization was needed.
  + **R**: The simple approach reduced calibration time by over 70%, handled 4 devices in parallel, and scaled easily to hundreds of thousands of units. It was robust and required minimal retraining of factory workers.

+ What is the most innovated idea you've ever had?

Same as above.

+ Tell me about a time when you came up with a creative solution to a complex problem. How did it simplify the solution?

Same as above.

+ Tell me about a time you re-designed a process and why.

Same as above.

+ Tell me about a time you solved a big problem in you company.

### Learn and Be Curious

> Amazon wants smart people who are never satisfied.

+ Give me an example of a mission or goal you didn’t think was achievable. 

+ Give me an example of something that you've worked on to improve your overall work effectiveness.

+ How do you stay up-to-date with industry trends and continuously learn in your field?

+ Tell me about a time you had to learn something quickly

+ Tell me about your **biggest career failure** and what you learned from it.
  + **S**: Early in my career at XXX Robotics, I was working on improving object localization robustness under dynamic lighting and partial occlusion. To accelerate development, I decided to integrate an experimental pose estimation approach based on sparse optical flow without sufficient benchmarking against the existing solution.
  + **T**: The goal was to improve accuracy and robustness in edge cases. But bcs I was trying to move quickly, I skipped through studies of the whole pipeline and broader stress testing, just assuming the new method’s theoretically stable enough to yield better real-world results.
  + **A**: After deployment in a pilot run, the system showed failures in low-texture scenes. The failures weren’t immediately reproducible and made debugging difficult for downstream teams. This caused delays in integration testing. I took full resiponsibility of the issue, halted further rollout, and worked nights and weekends to trace the root cause. I also designed a more rigorous test pipeline that included a synthetic dataset generator for corner cases, and formalized the performance evaluation criteria.
  + **R**: We reverted to the older method temporarily, but two months later, I introduced a hybrid version with both sparse and dense tracking, fully validated against the new benchmark suite. It eventually outperformed the original solution. But more importantly, my learning led to a culture change—my team adopted structured review gates for all algorithmic changes going forward.

### Insist on the Highest Standards

+ Tell me about a time when you had to work with a **difficult customer** or user.
  + **S**: One of our internal factory leads, responsible for operating the calibration stations, was highly frustrated with our initial tool. He complained it was too slow, prone to crash, and hard to identify error. He often escalated complaints to my manager directly, but gives very vague feedback.
  + **T**: My role was to improve the reliability and usability of the calibration tool, while keeping the production line running smoothly.
  + **A**: Instead of pushing back, I asked for a brief meeting with him and listened carefully to his concerns. I observed the calibration workflow firsthand on the floor and noticed that crashes often happened due to invalid file paths and unhandled device disconnections—things that didn’t occur during dev testing. He also wanted better progress feedback and fewer manual steps. I created a prioritized list of UX and stability issues and shipped improvements in small batches: added error handling, visual loading indicators, and an auto-reconnect mechanism for devices. I also offered a debug mode with logs he could easily send when things went wrong.
  + **R**: Within two weeks, the factory lead’s complaints stopped. He began sharing feedback more constructively and even suggested ideas for improvement. Over time, we built mutual trust. His team became our best source of real-world feedback, and tool uptime increased significantly.

+ Tell me about a time when you used external trends to improve your own company's products or services.

+ Tell me about a project where you set and maintained high standards for quality and excellence.

+ Tell me about the most successful project you've done

+ Tell me about a project that you wish you had done better and how you would do it differently today

### Deliver Results

+ Could you tell me about a time where you were working on a project where you were working with another person. Over time, that person lessened their involvement in the project and you had to take on more responsibility.

+ Tell me about a strategic decision you had to make without clear data or benchmarks.

+ Describe a challenging project where you had to meet **tight deadlines**. How did you ensure the successful delivery or results?
  + **S**: We were launching a new line of robotic mowers, and I was assigned to develop the entire stereo + LiDAR calibration pipeline for factory deployment. The launch date had already been announced to partners, which left us only 3 weeks to build a robust system that would run across multiple stations in parallel.
  + **T**: I was responsible for designing, implementing, and validating the calibration algorithm and delivering a UI tool that factory workers could use with minimal training.
  + **A**: I started by identifying critical path components—calibration accuracy, robustness, and factory throughput. I deprioritized features like detailed analytics and long-term diagnostics and focused only on the core workflow. To move fast, I reused existing tested modules (e.g., chessboard detection) and focused my energy on designing a repeatable sequence that worked under real lighting and layout constraints. I also worked closely with the production team by testing iteratively in the actual factory environment. Each evening I would ship an updated version based on the day's feedback. To parallelize effort, I split the UI and calibration backend into separate components so I could work on algorithm tuning while another teammate refined the interface.
  + **R**: The system was delivered on time. It handled 4 devices in parallel and completed each calibration within 30 seconds. We launched with zero critical bugs. The same pipeline was later scaled to tens of thousands of units with minimal modification. The key was ruthless prioritization, tight feedback loops, and daily integration/testing.

+ Tell me about a time you came across a scenario where the deadline given to you for a project was earlier than expected

+ Tell me about the most challenging project you ever worked on

### Strive to be the Earth's Best Employer

Skip

### Dive Deep

+ Tell me about a time when you had to communicate a **change in direction** that you anticipated people would have concerns with.
  + Deep learning loop closure

+ Tell me about a time where you were thrown into a project where you had **no experience** in.
  + **S**: At XXX, while developing a production calibration tool for our robotic mowers, I noticed that the calibration results were inconsistent and often outside the expected range.
  + **T**: I was responsible for the calibration software, not camera module evaluation or ISP configuration. However, the issue was blocking progress.
  + **A**: I suspected the root cause wasn't in the calibration logic but due to inconsistent camera modules. As our startup had no dedicated ISP engineer and the supplier lacked professional optical test equipment, I decided to dive into ISP tuning myself. I re-learned fundamentals of AE/AWB tuning, researched lightweight tuning strategies suited to our sensors, collaborated with the embedded team to understand relevant registers, and built a tool to let operators visualize and adjust key ISP parameters.
  + **R**: This ISP tuning tool quickly became a standard pre-check step in our factory pipeline, significantly reducing the number of faulty calibration reports. It helped production teams filter out bad modules early and ensured consistent calibration output. Even though this was outside my core responsibility, I earned the trust of both engineering and operations teams by solving a systemic issue.

+ Tell me about a time when you delved deeply into a problem to uncover insights. What did you discover?

+ Tell me about a project in which you had to **deep dive** into analysis
  + Use temperature drift

+ Tell me about the most complex problem you have worked on

### Have Backbone; Disagree and Commit

> I verbalize the things I disagree on. Then I commit to taking action. Whether it was the action you or I proposed doesn’t matter: I’ll commit to following through on something.

+ Give me an example of a time you committed to a group decision even though you **disagreed**.
  + **S**: At XXX Robotics, our team was designing a localization module for a mower expo indoor demo. We were debating whether to include loop closure detection in the initial release. I strongly advocated for including it because it significantly improved long-term drift correction in larger workspaces. However, several teammates argued that our use cases were mostly short sequences in controlled environments, and the loop closure pipeline would complicate the code and increase processing latency.
  + **T**: My responsibility was to ensure accurate and reliable localization. I felt that a system without loop closure was risky, especially for future scalability. But I also understood we had tight resource constraints and a strict release schedule for the demo day.
  + **A**: I prepared a benchmark comparing performance with and without loop closure across multiple environments, highlighting its benefits. However, after multiple discussions, the conclusion was to defer loop closure and focus on optimizing frame-to-frame tracking to meet latency and throughput requirements. Although I still disagreed with the decision, I respected the team's logic and chose to commit fully. I reallocated my efforts toward improving the robustness of tracking under challenging conditions (e.g., motion blur, partial occlusions) and implemented a lightweight relocalization fallback mechanism as a stopgap. I also documented a clean interface for adding loop closure in a future update
  + **R**: The product was released on time and met the customer’s immediate needs with high reliability. The simplified architecture proved easier to maintain and debug during deployment. Several months later, when use cases expanded to larger workspaces, the team picked up my modular loop closure code and integrated it with minimal overhead.

+ Tell me about a time where you disagreed with a coworker or PM or manager because you believed the decision they wanted to make was wrong for the customer.

+ Can you share a situation where you disagreed with your team, and how did you handle it ensure alignment and commitment?

+ Tell me about a time you had a conflict with a coworker or manager and how you approach it

+ Tell me about a time your work was criticized

### Success and Scale Bring Broad Responsibility

Skip

### Ownership

> Amazon wants folks who take big bets, hold themself to high expectations, and put in the hard work.

+ Describe a time when you took on work **outside of your comfort area**.
  + **S**: At XXX Robotics, there's a culture that every research engineer need to take at least one software task. I was primarily responsible for computer vision algorithm development, and I was asked to take over the development of a plugin tool inside our application that would control and visualize the calibration pipeline. I made simple GUI with drag and place tool, but I had never built a complex GUI before, and desktop application development wasn’t part of my usual skill set.
  + **T**: The tool had to interface with hardware, visualize camera feeds, step-by-step guide interface and calibration results, manage logs, and provide a responsive UI for factory operators — all with minimal latency and high reliability. Time was limited, and we couldn’t afford major failures during deployment.
  + **A**: Despite it being outside my comfort zone, I took full ownership. I first broke the problem down:
    + I studied Qt’s event system, threading model, and UI layout patterns.
    + I read code from similar open-source tools and consulted colleagues who had GUI experience.
    + To reduce risk, I rebuilt the backend-UI interface using a producer-consumer model, ensuring that the UI remained responsive while heavy computation ran in the background.
    + I also added logging, fail-safes, and test hooks to simplify debugging and future maintenance.
  + **R**: The application was deployed across multiple factory lines and helped calibrate over 100,000 robotic mowers. It reduced average calibration time to ~30 seconds per unit and enabled parallel calibration of four devices — boosting throughput without increasing headcount.

+ Describe a situation where you made an important business decision without consulting your manager.

+ Describe a time where you took full ownership from start to finish. What were the results?

+ Tell me about a time you did something at work that wasn't your responsibility / in your job description.

### Are Right, A Lot

> This LP doesn’t mean Amazonians can’t mess up. They openly encourage candidates to describe times they were wrong, especially when they were wrong on a big gamble. Their ethical decision tree would look something like: Step 1: Dominate. Step 2: Did you dominate? If yes, proceed to success. If not, you better have risked enough to learn if and how domination is possible.

+ Tell me about a time when you did not effectively manage your projects and something **did not get completed on time**.
  + **S**: In XXX Robotics, I was given a task to make an internal tool to support testing for our vision localization system. I was excited and wanted to build something flexible and reusable from the ground up. However, I underestimated how much time it would take to design the software architecture and test corner cases in real-world conditions.
  + **T**: My goal was to deliver a working demo to the QA and deployment teams within four weeks so they could begin validating the system in real production environments.
  + **A**: Instead of making a minimal but functional MVP, I aimed too high and tried to make the system modular, highly configurable, and ready for all kinds of future extensions. I spent a lot of time tuning abstract interfaces and data pipelines—basically overengineering. Around two weeks, I realized I wouldn’t be able to finish all the core features and polish the UI in time. I immediately communicated the risk to my manager and the QA team. I narrowed the focus and stripped the design down to the core path tracking and mapping features. Then I worked extra hours to at least deliver a basic visualizer and CLI tool that could help them start data collection. It wasn’t perfect, but it was usable and unblocked their work.
  + **R**: While I missed the original milestone, the team appreciated the transparency and quick recovery. From this experience, I began actively discussing scoping decisions with peers and product leads before starting any new project. Since then, I’ve consistently delivered on time by focusing first on value delivery, then on abstraction or polish if time allows.

+ Tell me about a time you **wouldn’t compromise** on achieving a great outcome when others felt something was good enough.
  + Modular code

+ Give me an example of a situation where you made a difficult decision that turned out to be correct. How did you reach that decision?

+ Tell me how deal with **ambiguity**.

+ Tell me about a time when you were faced with **a problem that had a number of possible solutions**.

### Hire and Develop the Best

+ Tell me about a time when you received **negative feedback**.
  + **S**: During my graduate research, I was developing a structured light system for precise 3D scanning. I had spent weeks optimizing the stereo calibration and phase unwrapping pipeline, and I felt confident in the results. I prepared a presentation for my advisor, expecting positive feedback on the accuracy and point cloud quality.
  + **T**: My goal was to demonstrate a working prototype and validate the system’s performance so we could include it in a paper submission. I had focused mostly on the geometric accuracy and assumed that would be the main evaluation criterion.
  + **A**: However, during the meeting, my advisor gave me blunt feedback: although the technical work was solid, the system lacked usability. The calibration steps required too many manual operations, and the reconstruction had no intuitive visualization. He told me, “No one outside this lab will want to use it unless you think about the human side.” At first, I was disappointed—I'd focused so heavily on the algorithmic performance that I had neglected user experience. But after reflecting, I realized this feedback was important. I took a step back and designed a lightweight desktop interface that guided users through calibration and previewed the live reconstruction results. I also added automatic quality checks and cleaner output formatting.
  + **R**: Once I integrated these changes, the prototype became much more accessible—not just to our lab members but also to collaborators in other departments. The improved version was eventually demoed at an academic conference. The feedback I initially resisted helped me grow beyond just solving the “hard” algorithmic problem—it taught me to think about usability and end-to-end value, which has stayed with me ever since, especially in product-focused roles.

+ Describe a time when you improved morale and productivity on your team.

+ Can you share an experience where you identified and developed talent within your team?

+ Tell me about a time you provided feedback that was helpful to a peer

+ Tell me about a time you hired or worked with people smarter than you are

### Think Big

> It’s about having a grand vision of the future so they can achieve those high standards.

+ Give an example of a creative idea you had that proved really difficult to implement.

+ Tell me about a time when you encouraged a team member or organization to take a big risk.

+ Describe a situation where you set ambitious goals and achieved them. What was your thought process?

+ Tell me about your **most significant accomplishment**. Why was it significant
  + **S**: At XXX company, I was responsible for improving the accuracy and efficiency of the sensor calibration process for stereo cameras and LiDARs. At the time, our factory calibration was slow, error-prone, and difficult to scale across large production volumes.
  + **T**: My goal was to redesign the calibration system to be faster, more repeatable, and robust enough to handle four devices at once, while still achieving subpixel accuracy and long-term stability—even under thermal drift during operation.
  + **A**: I designed a fast and fully guided calibration scheme, optimizing both the algorithm and workflow. On the software side, I developed a Qt-based desktop tool that tightly integrated hardware control, data acquisition, and real-time feedback for quality checking. On the algorithm side, I implemented efficient geometric calibration and validation pipelines, tuned for factory deployment. To address in-field issues, I also proposed and developed an online calibration strategy that automatically detects and compensates for calibration drift during real-world use, significantly reducing failure risk from thermal expansion or mechanical shifts.
  + **R**: The new system cut factory calibration time from several minutes down to ~30 seconds per device and enabled processing four units simultaneously. It was deployed across manufacturing lines and used to calibrate around 100,000 devices, with zero customer complaints related to calibration-induced localization errors. Internally, the system became a benchmark for future calibration work and contributed directly to the company’s reputation for reliability.

+ Tell me about a time you proposed a non-intuitive solution to a problem and how you identified that it required a different way of thinking?

### Bias for Action

> You might have the best idea to refactor the codebase in your head, but if it never moves towards implementation, it’s worthless.

+ Give me an example of a calculated risk that you have taken where speed was critical.

+ Tell me about a time where you were the first one to take action on something.

+ Tell me about a time when you launched a feature with **known risks**.
  + **S**: While working on a SLAM system at XXX Robotics, I was leading the integration of a new loop closure module. This feature was designed to improve long-term trajectory consistency in large outdoor environments. However, the feature added computational overhead and occasionally introduced false positives in cluttered scenes.
  + **T**: My task was to integrate and release this feature for field testing with some key retail distributors, who was evaluating our system, so that they can buy and sale in Europe. There was time pressure because their demo was approaching, but the loop closure module hadn't been validated across all possible edge cases yet.
  + **A**: I made the decision to launch the feature behind a runtime toggle, with clear configuration and fallback mechanisms. I documented its known risks, including potential map inconsistencies in low-texture environments. I also added diagnostic logging and rollback support, so if something went wrong, the system could disable the module and continue mapping. To mitigate issues further, I worked closely with the QA team to prioritize test cases in environments with similar characteristics to the client’s space.
  + **R**: The client was impressed with the improved mapping consistency and loop closure benefits. While one minor false loop happened during testing, the diagnostics I built in allowed us to quickly diagnose and improve the heuristics. Over the next few iterations, we refined the module further, and it became a core component of our SLAM pipeline.

+ Give me an example of a time when you took action without waiting for direction. What was the outcome?

+ Tell me about a time you had to make an urgent decision without data

### Frugality

> Amazon wants you to not only figure out how to go to the moon, they want you to cut costs while you do it. One way to impress Amazon in the interview is to talk about the decisions you made in the past which saved the company money.

+ Tell me about a time you pushed back on a deadline.

+ Give me an example of how you have helped save costs or eliminate waste within your role or organization.

+ How have you demonstrated cost-consciousness in your previous roles?

+ Tell me about a time you successfully delivered a project with **limited budget or resources**
  + **S**: At XXX, I was given the task to develop a reliable sensor calibration solution for a new generation of robotic mowers that included stereo cameras and LiDAR. The calibration process needed to be fast, accurate, and scalable for mass production. However, we had limited engineering bandwidth and no existing infrastructure to support factory-scale calibration. Additionally, the timeline was tight — we had just weeks before production ramp-up.
  + **T**:I had to build a factory calibration system that could handle as many devices as possible simultaneously, produce repeatable results, and easy to operable by factory operator, all while minimizing computation and setup cost.
  + **A**: To work within constraints, I:
    + To minimize manual intervention at the same time maintain repeatibility, I choose to use an automatic moving platform instead of robot arm.
    + Rewrite the calibration pipeline, move some of the image processing function to streaming part, while parallel the optimization part.
    + Built a desktop application that unified visualization, control, and logging into a single tool — eliminating the need for external scripts or utilities.
    + Reused existing hardware and low-cost targets, designing the calibration setup to work reliably even with variability in factory lighting and surface conditions.
    + Automated data saving and validation process, so operators could process multiple units in parallel.
  + **R**: The system was deployed successfully and calibrated over 100,000 mowers in production with zero customer complaints related to calibration-related localization failures. Despite our resource limitations, the tool handled the load reliably, and its performance exceeded expectations in both speed and repeatability.

+ Tell me about the last time you figured out a way to keep a approach simple or to save on expenses.

### Earn Trust

> This LP is about showing you know how to repair: either reactively after or proactively before a difference of opinion.

+ Tell me about a time when you had a **disagreement** with a colleague or manager.

+ Describe a time when you needed to influence a peer who had **a different opinion** about a shared goal.
  + **S**: At XXX, I was working on improving localization stability in our SLAM system for robotic mowers. A peer on the team believed we should rely more heavily on IMU pre-integration and tighter fusion with wheel odometry, arguing it would improve short-term accuracy in uneven terrain. However, I believed this approach would introduce drift over longer paths especially under real-world noise.
  + **T**: Our shared goal was to improve robustness in all terrains, especially under partial sensor failures or degraded vision. I needed to influence my peer and guide the team toward a solution that balanced robustness and maintainability without causing long-term drift.
  + **A**: Instead of directly rejecting his approach, I ran side-by-side simulations using real mower logs across multiple terrains and lighting conditions. I documented how excessive reliance on dead-reckoning worsened performance over longer periods without loop closure or relocalization. At the same time, I proposed an alternative strategy:
    + Increase the reliability of visual keyframe selection
    + Add a fallback geometric relocalization module when visual tracking is lost
    + Improve IMU usage for failure detection, not just for fusion
  I presented both options during our design review, including quantitative comparisons and edge case analysis. I also openly acknowledged strengths in his approach to build trust and show respect for his point of view.
  + **R**: My peer appreciated the depth of analysis and the constructive tone. In the end, we combined ideas — keeping IMU for short-term estimation but reducing its weight during long segments, and added my proposed visual relocalization fallback. This hybrid solution improved both short- and long-term localization accuracy and was adopted in production.

+ Share an instance where you had to rebuild trust with a colleague or client. How did you go about it?

+ How do you **earn trust** with a team?
  + **S**: At XXX, I was assigned to lead the development of the sensor calibration system for our robotic mowers. Although I officially owned the task, I often found that the project manager didn’t proactively share first-hand requirements or updates from the factory or production planning team. This made it difficult to anticipate shifting needs or validate assumptions early.
  + **T**: To succeed in this role, I needed not only to build a robust and efficient calibration solution, but also to **earn the trust of cross-functional teams**, including manufacturing, hardware, and product teams, so I could get the insights and collaboration needed to iterate quickly and correctly.
  + **A**: Instead of passively waiting for updates, I decided to take full ownership of the task and build credibility through consistent, high-quality work:
    + I kept detailed notes of every test — logging metrics, edge cases, and pain points — and proactively shared summaries with stakeholders.
    + I collaborated closely with the hardware and factory teams, visiting the production line and asking questions to understand their real pain points.
    + I simplified the operator interface in the Qt desktop app to reduce training time and human error, which impressed the deployment team.
    + I incorporated feedback fast, even when it came from side channels, and showed measurable progress in each internal demo.
  As I consistently delivered results, other teams started coming to me directly for input. A few managers from other departments even praised my responsiveness and thoroughness, which helped improve the visibility of my work within the org.
  + Over time, I gained the trust not just of my immediate team, but also of cross-functional stakeholders. Eventually, people looped me in directly when calibration-related decisions were being made — even those not officially in my scope. My work helped scale the calibration process to support factory-level throughput with high repeatability and zero failure complaints.

+ Tell me a piece of difficult feedback you received and how you handled it

### Other Top Questions

+ Why Amazon?

+ Tell me about a time you failed at work. What did you learn from it?

+ Tell me about a challenge you faced. What was your role & the outcome?

+ Tell me about a time you disagreed with a coworker/manager/decision

+ Tell me about a time you had to work or make a decision quickly/under a tight deadline?

+ Tell me a time you don't know what to do next/how to solve a **challenging problem**. How to get unstuck? What piece of info you didn't know you need?
  + **S**: At XXX, after we shipped the first batch of robotic mowers to our beta customers, we started noticing that some units had localization drift while GPS and visual SLAM module looked fine. The issue wasn’t consistent and was hard to reproduce. This was unexpected, as they passed all factory calibration tests.
  + **T**: It seems to be a calibration problem, so I was tasked to investigate the problem and try to mitigate the problem. I needed to develop some kinds of online calibration algorithm that could compensate for changes in sensor alignment caused by thermal expansion over time. I am aware temperature could affect sensor accuracy, but I never worked on real time vehicle navigation, not to mentioned this temperature issue in my previous company was already Tier 1 problem
  + **A**: I started by diving deep into real-world logs from affected units. I visualized localization errors across different environments, times of day, and temperatures. That’s when I noticed a pattern: alignment errors increased with device surface temperature, particularly in stereo baselines. This clue pointed toward thermal shift in the camera rig. To confirm this, I:
    + Installed temperature sensors in test units and ran outdoor experiments.
    + Modeled how camera-to-camera extrinsics changed with temperature using time-series data.
    + Developed a lightweight online extrinsic refinement algorithm that triggers only when drift exceeds a threshold, using features already detected for SLAM.
  The missing piece was realizing I needed to treat temperature as a dynamic variable in the system, rather than assuming calibration is static post-deployment.
  + **R**: The solution was rolled out via firmware update and significantly reduced localization issues without adding hardware or requiring user input. It helped restore customer trust and prevented warranty escalations. The best part — there were zero complaints about localization failure due to calibration drift after rollout.

+ Tell me a time you explored a new area of existing space. Why hasn't someone else explored it yet?

+ Tell me a time you received tough feedback, what was the feedback, what did you do? Describe a time you improved team morale and productivity? What was the underlying problem, how did you add ressit?

+ Tell me a time you needed another teams help, how you convinced them to help you, how to bring them onboard?

+ Tell me about your most challenging customer. How did you resolve their issues and make them satisfied?

+ Describe a time when you had to make a decision without having all the data or information you need

+ Tell me about a time when you were working on a project, and you realized that you needed to make changes to what you were doing. How did you feel about the work you had already completed?

+ Describe a time when you faced a challenge at work. How did you handle it?

+ How do you prioritize tasks when you have multiple deadlines?

+ Give me an example of a time you used data to make a decision?

+ Describe a situation where you had to work with a difficult team member. How do you handle it?

## Phone Interview Questions

+ Can you briefly introduce yourself and your professional background?

+ What attracted you to applying for this position?

+ What do you know about our company and our products and services?

+ How would you describe your strengths and weaknesses?

+ Can you provide an example of a challenging situation you faced at work and how you resolved it?

+ What are your short-term/long-term career goals?

+ How do you prioritize and manage your tasks?

+ What relevant experience do you have in this industry or field?

+ Have you worked remotely before? If so, what strategies do you use to stay organized and motivated?

+ How do you handle tight deadlines and work underpressure?

## Epic Games

Epic Games Research Scientist Interview Questions
In this section, we’ll review the various interview questions that might be asked during a Research Scientist interview at Epic Games. The interview process will likely focus on your technical expertise, problem-solving abilities, and collaborative skills, particularly in the context of game development and machine learning applications.

Technical Skills
**1. Can you explain a complex algorithm you developed and how it improved a project?
This question assesses your ability to communicate technical concepts clearly and your experience with algorithm development.**

How to Answer
Choose an algorithm that had a significant impact on a project. Explain the problem it solved, the approach you took, and the results achieved.

Example
“I developed a pathfinding algorithm for a game that significantly reduced the computational load during gameplay. By implementing A* search with heuristic optimizations, we improved the NPC movement efficiency, which enhanced the overall player experience by making interactions more fluid.”

**2. What experience do you have with machine learning frameworks like TensorFlow or PyTorch?
This question gauges your familiarity with essential tools in the field of machine learning.**

How to Answer
Discuss specific projects where you utilized these frameworks, highlighting your role and the outcomes.

Example
“I used TensorFlow to build a neural network for image recognition in a game development project. The model achieved over 90% accuracy in classifying in-game objects, which allowed us to implement dynamic interactions based on player behavior.”

**3. Describe a time when you had to troubleshoot a significant issue in your code.
This question evaluates your problem-solving skills and resilience in the face of challenges.**

How to Answer
Provide a specific example, detailing the issue, your troubleshooting process, and the resolution.

Example
“During a project, I encountered a memory leak that caused crashes during gameplay. I systematically reviewed the code, utilized profiling tools, and identified that an object was not being properly deallocated. After fixing the issue, I implemented better memory management practices to prevent future occurrences.”

**4. How do you approach rapid prototyping in your research?
This question assesses your ability to iterate quickly and effectively in a research environment.**

How to Answer
Explain your methodology for rapid prototyping, including tools and techniques you use.

Example
“I prioritize creating minimal viable products using Python for rapid prototyping. I focus on core functionalities first, allowing for quick testing and feedback. This iterative approach helps refine ideas before full-scale implementation.”

**5. Can you discuss your experience with real-time graphics and how it relates to your research?
This question explores your understanding of real-time graphics and its application in game development.**

How to Answer
Share specific experiences or projects that highlight your expertise in real-time graphics.

Example
“I worked on a project that involved real-time rendering techniques to enhance visual fidelity in a game. By implementing advanced shading models, we achieved a more immersive experience, which was well-received by players and critics alike.”

Collaboration and Communication
**1. How do you ensure effective communication within a multidisciplinary team?
This question evaluates your interpersonal skills and ability to work collaboratively.**

How to Answer
Discuss strategies you use to facilitate communication among team members with different expertise.

Example
“I hold regular check-ins with team members from different disciplines to ensure everyone is aligned on project goals. I also encourage open discussions during meetings to address any concerns and foster a collaborative environment.”

**2. Describe a situation where you had to mentor a junior researcher or team member.
This question assesses your leadership and mentoring abilities.**

How to Answer
Provide an example that illustrates your mentoring style and the impact it had on the individual or team.

Example
“I mentored an intern who was struggling with data analysis techniques. I provided guidance on best practices and resources, and we worked together on a project. By the end of the internship, they were able to independently analyze data and present findings, which boosted their confidence and skills.”

**3. What do you think is the most important aspect of fostering an inclusive work environment?
This question gauges your understanding of diversity and inclusion in the workplace.**

How to Answer
Share your perspective on inclusivity and how it contributes to team success.

Example
“I believe that fostering an inclusive environment allows for diverse perspectives, which leads to more innovative solutions. I actively promote inclusivity by encouraging team members to share their ideas and ensuring that everyone feels valued and heard.”

**4. How do you handle disagreements or conflicts within a team?
This question evaluates your conflict resolution skills.**

How to Answer
Discuss your approach to resolving conflicts while maintaining a positive team dynamic.

Example
“When conflicts arise, I focus on understanding each party's perspective. I facilitate a discussion to find common ground and encourage collaborative problem-solving. This approach often leads to a resolution that satisfies everyone involved.”

**5. Why do you want to work at Epic Games, and what do you hope to contribute?
This question assesses your motivation for applying and your alignment with the company’s values.**

How to Answer
Express your enthusiasm for the company and how your skills align with their mission.

Example
“I admire Epic Games for its commitment to innovation and community engagement. I hope to contribute my expertise in machine learning and graphics to help push the boundaries of what’s possible in gaming, ultimately enhancing player experiences.”