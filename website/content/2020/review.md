---
title: Review - Learnings by the Organizers
layout: layout-2020
header_title: <h1>Review</h1>
---

<div style="text-align: center; font-style: italic;">Learnings by the Organizers</div>

Hello everyone,

the Dat conference this year has finished. We are happy that many showed up and think overall it turned out well.

In this article, we would like to review what we did and what we learned from it, for other operators or our-future-selves to not repeat mistakes.

**Warning:** We did attempt to keep this review as short as reasonable but it is quite long as we did a lot. Please stay with it and read with care if you wish to learn from our efforts.

> I have made this longer than usual because I have not had time to make it shorter. <br>_Blaise Pascal_

---

<div style="text-align: center"><strong>Content</strong></div>
<ol>
    <li><a href="#1-organization">Organization</a></li>
    <li><a href="#2-cf-p">Call for Proposals</a></li>
    <li><a href="#3-website-amp-registration">Website &amp; Registration</a></li>
    <li><a href="#4-big-blue-button">Big Blue Button</a></li>
    <li><a href="#5-streaming-to-youtube">Streaming to Youtube</a></li>
    <li><a href="#6-before-amp-after">Before and After</a></li>
</ol>

---

## 1. Organization

We have been looking into holding a Dat related event at the beginning of 2020. As the Corona Virus Crisis unfolded we quickly scrapped our plans for a physical event and decided to move to an online format. Making this our first online event.

[Diego](https://github.com/dpaez), [Franz](https://github.com/frando), and [Martin](https://github.com/martinheidegger) volunteered to hold the event in the online call. First, we used [Github Team Discussions][gh-team-discus] for sharing our progress. We had an initial kick-off on March 22nd but afterward progress stalled so we set up a meeting weekly - and one-hour call. Initially, the meetings were at a time similar to our consortium calls, during which Martin would need to get up late at night. We switched it soon to work for everyone. For the first few meetings, we would announce them using Github-discussions, but we turned it into a google calendar invite as people had a hard time tracking it.

After a few meetings we started, to work on the homepage and invited [Santiago](https://github.com/ssaavedra) to help us with it. Over time, he would become a full member of the team :heart_eyes:.

During our meetings, we would keep notes in [HackMD](https://hackmd.io) as it was the most convenient/well-known to all of us. We started using a "`Prev - Next`" navigation to make sure that people could easily catch up with previous meetings.

<img src="https://i.imgur.com/fVpxwql.png" style="border: 2px solid #f0f0f0" width="400" title="Screenshot of 2020-04-22 meeting notes showing a prev-next navigation and an Attending headline with Diego and Martin">

[gh-team-discus]: https://docs.github.com/en/github/building-a-strong-community/about-team-discussions

### Finding a good date

We discussed a few dates for the Dat event in the Dat consortium. The date of the 30th and 31st of July was chosen as it gave us time to organize but was still in the foreseeable future. We chose weekdays as those were easier for consortium members to attend.

We are in friendship with [dweb-camp](https://dwebcamp.org/) and [ournetworks](https://ournetworks.ca/) the former one not having a date for 2020 yet and **`ournetworks` to be live between September 8–13, 2020**. Diego joined their weekly calls as they are out of the timezone for other organizers.

Initially, we planned for the Dat Conference to be just before `ournetworks` but as there were delays with our network we have been a little over a month early.

### Task Management

We tried Github issues, but they didn't work for us. Likewise, Github projects didn't work for us as well. What we would do is create action items during each meeting and review them to make sure that we have some progress.

### Learnings

- Set up weekly or bi-weekly calls and use a time at which everyone is awake; Share invites using (Google) Calendar.
- Use `Prev - Next` navigation in your meeting notes to make sure that other people can catch up.
- Don't use Github-discussions.
- Your initial team is likely to stay as-is without recruitment.
- We need a HackMD equivalent running in Beaker.
- Specify action-items with deadlines clearly.

---

## 2. CfP

This year we wanted to have a Call for ~~Papers~~Proposals that is as open as possible to the wishes of the community. To highlight that we use Github, we thought it's enough to simply create Github issues.

> Please submit your ideas [as issues in our issue tracker](https://github.com/datproject/public-events/issues/new?assignees=&labels=proposal&template=proposal.md&title=).

As this was not accepted by the community _(no-one signed up)_ we opened a more common CfP quickly using google forms

> Please submit your ideas in [this submission form][gform-submissions].

[gform-submissions]: https://docs.google.com/forms/d/e/1FAIpQLSed1kHTAqgN7DvttNCEk8_BzuQvrqS3-eEJoCWS-T7wu5DqGw/viewform

Being "open for all suggestions" didn't give a frame of mind for what is possible to possible presenters. We also were very busy and didn't promote the CfP enough, but the Google Form did its job well enough. We got just about enough proposals for a conference. :sweat_smile: 

Then we had to sort and order the talks and put the schedule on the website though, and whoever had to do that task was asked for a few things:

- Respect the presenters` availability.
- Respect timezones when specifying the times.
- Give space _(breaks)_ between the entries.
- Notify all presenters of things that are happening.

### Moving to Pretalx

And also we had some missing information in our CfP that we had to gather. While looking into good tools to display the Schedule, we found [Pretalx][pretalx] and we found it quite smart:

- It automatically generates emails to presenters.
- It has a lot of useful features & flags.
- It deals (pretty) well with Timezones.
- It supports iCal out-of-the-box.
- It is OpenSource.

So we went with it. We imported all the talks we received through the google form and sent out the invitations to the presenters to confirm their talks.

_Note: If you don't use Pretalx: confirm the talks with the speakers similarly as Pretalx would._

Arranging the entries to a schedule with Pretalx is a breeze:

![Drag & Drop unassigned talk to Main room; Alert showing that speaker is not available; Dragging to an good time slot.](https://i.imgur.com/66KQ78S.gif)

We pulled the Pretalx data through an API into our Netlify hosted website _(inherited from the previous dat event)_ and rendered it in our style.

That doesn't mean all with Pretalx went well, there have been a few issues that we had to figure out:

1. Make sure the database collation is set up right [pretalx-docker#22](https://github.com/pretalx/pretalx-docker/issues/22), else emojis and other unicode-characters don't work.
2. Pressing the delete button on emails deletes emails without a second question [pretalx#967](https://github.com/pretalx/pretalx/issues/967).
3. Speakers are not sortable [pretalx#975](https://github.com/pretalx/pretalx/issues/975).
4. There is no good hook to trigger an update of the Netlify page [pretalx#964](https://github.com/pretalx/pretalx/issues/964) - We manually triggered the updates.
5. If the speakers don't activate their account within the preset limit, the sign-up breaks [pretalx#554](https://github.com/pretalx/pretalx/issues/554) - we had to work-around this issue using direct SQL access
6. Pretalx doesn't show to the presenters well what timezone is used for the event. Which is problematic if you are not clear about this in the CfP description: [pretalx#924](https://github.com/pretalx/pretalx/issues/924).

### Scheduling

This is an online event and we had a relatively complex scheduling requirement with speakers from Australia, Europe, and US timezones attending. To make sure to have space for all of them we scheduled the second day from 9:30-24:00 which meant that the moderators had to attend in shifts.

It also meant that we couldn't expect the attendees to attend all sessions equally and that our recordings would become all-the-more important. Furthermore, it meant that we didn't have an after-hours special event for everyone to attend. We initially thought it might be a good idea to have [gather.town](https://gather.town/) or [Mozilla Hubs](https://hubs.mozilla.com/) for a meetup but figured that it would be selective to the attendees and we wanted to focus on things beneficial to all. If the event would have taken up to 5 hours and focus only on a certain time-zone in which case an after-party would have been more reasonable.

One way to reduce the time would have been to have multiple talks starting at the same time, with multiple rooms. This, however, would have meant to set up multiple recording setups and we would have needed twice as much moderation & extra coordination. And while the shorter duration would have helped with the first issue, we would still need to accommodate the presenters of each timezone :sweat:.

To make sure that we get a breather between sessions and to fix eventual technical issues we added a 20min break between each session which we had to reduce occasionally to 15min to fit all presentations. This turned out to be a really good thing as we indeed had to deal with technical issues, some sessions went over-time and we had some time to make sure that the next speaker is ready _(eventual tech-check)_.

When we received the presentations through the google form we left it open to enter any duration and by happy accident, we think that was a good idea. Each session was just as long as the conductor felt comfortable with.

### Lessons Learned

- The CfP needs to be private - a public CfP _(using Github-issues)_ doesn't work.
- Use Pretalx from the Beginning.
- Be clearer in our event description and with our CfP goals.
- Put more effort into the promotion of the CfP.
- It is doable to set up a schedule with sessions of different durations and that turned out to be a good thing.
- Add generous breaks (15-20min) between sessions.
- If you send out emails, make sure that they are seen.
- Support [rixx](https://rixx.de) on [Liberapay](https://liberapay.com/rixx/) or [Patreon](https://patreon.com/rixx) as the software they build is useful.

[pretalx]: http://github.com/pretalx/pretalx

---

## 3. Website & Registration

### Website Renewal

The 2019 website was hosted on https://events.datproject.org, we moved it to https://events.dat.foundation and split it up into two separate folders. The domain was provided by the dat foundation, its source-code is on [datproject/public-events](https://github.com/datproject/public-events), is hosted on [Netlify](https://netlify.com) and since we ran out of Netlify data transfer quickly we activated the [CloudFlare CDN](https://www.cloudflare.com/) to cache the data.

### Registration through Eventbrite

We knew before the event that attendees likely forget about the event if there is no way to remind them. To prevent this we got an event-registration page up online, which we replaced with the "how-to-join" page once the event started as we wanted to makes sure that late-joiners would find their way.

We added Eventbrite registration to the website.

---

## 4. Big Blue Button

For the main system at the conference, we did think about different tools. We ended up trying the OSS tool [Big Blue Button](https://bigbluebutton.org/) and it immediately checked all our lists.

- It gives the options for multiple presenters showing their webcam simultaneously besides showing a presentation or screen-share.
- It gives the option to vote on questions. _(which were useful during the event)_
- It allowed for up to 200 attendee's in a room which is quite nice.
- We were able to moderate attendees. _(in case of CoC issues)_

So it had a decent set of functionality and it was open source but Big Blue Button needs to be hosted somewhere and as we didn't want to stress ourselves with server issues while dealing with the conference we asked [Collocall](https://collocall.de/) to host for us. They made us a very fair offer and we took it.

### Presenter Screenshare

We had two hiccups with the presenter sharing their screen. One during ["Changing to "Hyper" and the future of the Dat ecosystem" (Youtube)](https://youtu.be/mx52uO5SP7A?t=51) where the screen was stuck on part of the screen. It was fixable by restarting the screen share and in the Youtube-Editor made it possible to cut out the section relatively smoothly.

The other hiccup was during ["Inclusive indexing of research outputs through decentralized web"](https://events.dat.foundation/2020/talk/g7wtne/) where the presenter would share the wrong screen and think that the presentation moved on while non of the attendings noticed. We eventually managed to get back to the correct screen sharing but it was broken for a while. We could have easily prevented this by asking the presenters to share their presentation beforehand and step through two slides to see if it works. However, what we failed to notice it that it entirely broke on the stream which meant we had to fix the video track in post-editing and [re-upload the video](https://youtu.be/mkQzFMKLBGQ). This took about 4~5 hours.

### Slow chat issue

When we had many chat messages, the user-interface to enter new messages would become very slow. This seems to be a big-blue-button issue _(related to the React)_ that now Collocall is aware of and that will hopefully be fixed in upcoming BBB versions.

### Break out rooms failure

During ["Inclusive indexing of research outputs through decentralized web"](https://events.dat.foundation/2020/talk/g7wtne/), Vinodh wanted to break out the room for separate discussions. For some reason, even though it worked during the test, when trying to create the break-out rooms the BBB UI would be locked. We worked around this by holding the workshop in one room.

### Backing up Notes & Chat

Before ending the BBB session we saved the notes and we saved the chat log every time before we cleared it, to keep a record of the data. We stored it on our google drive.

### Ghost attendees

The streaming servers _(see [the next section](#5-streaming-to-youtube))_ added two extra users _"Youtube Stream Bot"_ which would show up in the attendee-list and would also be eventually sent into breakout rooms. There should be a feature to have bot users in BBB.

### Moderator help is limited

During some sessions, the presenter would ask the moderator or co-presenters to support them by preparing polls or other tasks. To do so, the moderator would need to "take the presenter role", and that meant that the screen that was shared by the presenter would be turned off and when the presenter role was passed on again the screen-sharing would need to be reinitiated.

### Learnings

- BBB has bugs, some of which will show after running BBB for a long time, some of which only show with many attendings.
- Ask the Presenter in an initial test to step through slides and ask if they show as the presenter intended.

---

## 5. Streaming to Youtube

BBB allows recording but the recording of BBB records every session in multiple files (video streams, presentations, etc.) that would need to be stitched together afterward, to publish videos that could be shared.

We wanted to have a video live-stream on a different platform that would also allow for a smooth following of the event on a mobile phone or on a browser that happens to be not supported by BBB.

### Considered Alternative Platforms:

1. _[Twitch][twitch]:_ First we thought it would be a better idea to start a twitch stream for the event but it turned out that Twitch is not embeddable with third-party cookies disabled.
3. _[Dacast][dacast]:_ Dacast has the most reasonable streaming pricing model that would allow embedding of streams, but its hosting of the videos afterward would cause a lot of additional work after the event.
4. _[Vimeo][vimeo-streaming]:_ Vimeo's premium plan supports video streaming on the own website but its rather expensive at a fixed (~70USD/month). But it would allow nice video modification and embedding.

In the end, we went with Youtube as the support for scheduling, community caption and immediate availability for the live videos was very attractive.

In our first tests, it was also possible to embed live videos on a page with third-party cookies enabled but maybe it was a temporal bug or whatnot, but it turned out that it didn't work and we had to redirect the streams to Youtube directly: [datproject/public-events#d4bbb0fe](https://github.com/datproject/public-events/commit/d4bbb0fec182a20eb22f81e3838a12696bac17d2#diff-a783f1d9526434c8837cc08ecea5861d)

_Note: we also streamlined a third-party-cookie test for this, in case you might need it: [nginx third-party-cookie-test](https://gist.github.com/martinheidegger/d37c2a7700b0d491aad031789fac760c)_

### Youtube Setup

For Youtube, we created an account using our organizer email address and a password that each organizer knows.

We discussed quite a bit if we should have 1 Youtube stream for the whole event, 2 Toutube streams, one for each day or 1 per session.

We chose 1 per session with the following arguments:

**`+`** We will lose motivation after the event and cutting a live stream apart will be painful.
**`+`** People following the stream will see when the sessions start using a time indicator.
**`+`** If something happens to fail, only one session will, and we can repair things until the next session.
**`-`** It will be more stress during the event.
**`-`** It is a lot to set up during the busy time before the event.

One of the things that certainly was well appreciated was the direct streaming to Youtube. Once we got all Speakers out we used a [Sketch][sketch] file, [Data Populator][data-populator], and a generated [JSON file of the sessions](https://github.com/datproject/public-events/blob/main/website/content/_data/2020/talks_simple.json) to generate the thumbnails for each Youtube session.

<img title="The sketch template" src="https://i.imgur.com/1xXqD0E.png" width="350">

We then created and recorded one dummy session on Youtube live. This was useful because it would later allow us to create the new session using the first one as a template:

<img title="Screen showing finished 'TEMPLATE' as option to be reused as new setting" src="https://i.imgur.com/5gBcCnq.png" width="350">

It makes it rather quick to fill out the rest of the information as further information _(only available through Youtube Studio)_ will be copied too. Like License, Language, or Comment settings.

<img src="https://i.imgur.com/9z45kgn.png" title="Form for the new video based on template" width="300">


The only problem that comes up is that the time needs to be entered **in your local timezone**. Now, we could have made our lives easy and simply changed the timezone of our computers when setting up, but we instead created [a small Html file](https://gist.github.com/martinheidegger/83931f8a10248e6bd53f485d095443d6) that we started with `npx http-server` that shows the sessions in the current timezone.

And while we thought we were clever with using the template it did bring another issue: by copying the stream, it also copies the stream key to each new video, showing this error message:

<img src="https://i.imgur.com/oXqHC0G.png" title="Error: We have detected multiple streams using the same strem key with auto-start" width="100%">

Now, that is because each video is _(correctly)_ activated auto-start for starting the live-stream when we press the button in OBS:

<img src="https://i.imgur.com/9WlkfRo.png" title="enable auto-start" width="300">
<br/><br/>

Naturally, Youtube doesn't know which live-stream to autostart if all have the same stream key. As this feature seems to be made for streamers who have repeating streams (once a week?) they don't mind. But we did.

So we hat do check each live-stream setting and create a new stream-key for it. We used the talk-code as an identifier, as that was easier to remember: 

<img src="https://i.imgur.com/cRBkeg1.png" title="Form for a new stream key, showing cryptic name and a 720p setup" width="300" style="display: inline;">

[twitch]: https://twitch.tv/
[sketch]: https://www.sketch.com/
[data-populator]: https://www.datapopulator.com/
[dacast]: https://www.dacast.com/
[vimeo-streaming]: https://vimeo.com/features/virtual-events


### Streaming setup

To stream the video from BBB, we set up 2 streaming computers. One to make sure we have a back-up. One Mac and one Windows computer stationary computer, each with **two screens**! Each of the computers was connected to a [TeamViewer](https://www.teamviewer.com/en/) account that all of the organizers have access to.

**Important** We made sure that both computers had enough hard disc available to keep the recordings!

<img src="https://i.imgur.com/DlsBxqu.png" title="Teamviewer list of computers" width="300">


On each computer, we installed [ObsStudio](https://obsproject.com/) which allows streaming to Youtube. For every session, we had to create a separate OBSStudio Profile. _(Each profile allows to store a different stream target in OBSStudio)_

So, we created one profile for every Youtube video to setup:

<img src="https://i.imgur.com/tW2jS8s.png" title="List of all the profiles" width="300">

Each profile contains the Stream key we copied from Youtube. We named each stream. For the naming, we made sure that the names are sorted correctly (OBSStudio automatically orders the names).

Also, we would prepare 3 scenes that can be used during the live-stream.

<img src="https://i.imgur.com/EnWlglm.png" title="Before Session, Big Blue Button, After Session" width="300">

---

1. A few minutes before the session started we would go to ``"Before Session"`` which shows the [`/live`](https://events.dat.foundation/2020/live/) page using a ``"Browser"`` input source which would show the next session about to start.
2. Then we'd check to have the correct profile setup and press ``"Start Streaming"``.
3. We would go to the Youtube video for the current presentation and make sure that the video is running.
    _Human Error Recovery:_
    1. If the Profile belonged to a stream that wasn't started yet we could simply change the description of the video and hope nobody notices.
    2. If the Profile was already recorded, we would Stop Streaming, and start again as streaming to a finished stream wouldn't work.
4. During the session,we would switch to `"Big Blue Button"` which does a screen capture of the second screen. We set the resolution of the second screen to 720p (1280x760). On the second screen, we would have a browser window open, full-screen, logged-in to BBB.
    To remove the BBB elements that we didn't want to show up in the stream we created [a little bookmarklet](https://gist.github.com/martinheidegger/52890ffee2ab2299032864052bf1d413) that we would run after the browser showed the BBB room view.
5. Right after the session ended we would switch to the `"After Session"` screen which is pretty much like `"Before Session"`, but shows [`/live-end`](https://events.dat.foundation/2020/live-end) because `/live` shows after the session the next session while `/live-end` shows "thanks for joining the previous session".
6. We monitored the YouTube output until the "After session" scene was displayed before pressing "Stop Streaming", to ensure that the whole video session was captured by Youtube.
9. We ended the stream in Youtube Live Stream (top right, current live stream).

#### Refreshing the Browser windows

The browser window in `"Before Session"` and `"After Session"` occassionally froze, to make sure it shows the correct window, OBSStudio has a slightly hidden _"Refresh cache of current page"_ feature that allows updating the page.

<img src="/assets/2020/c67524232da9a8488a3916569eacf00b.gif" title="Animation scrolling down in the Browser properties and showing the 'Refresh cache of current page button' and how the browser display refreshes" width="300">


#### Mac Specifics

On Mac OS, the setup works much like on Windows except that it doesn't support audio recording out of the box. You need to install the  [iShowU](https://support.shinywhitebox.com/hc/en-us/articles/204161459-Installing-iShowU-Audio-Capture-Mojave-and-earlier-) audio plugin, define it as Input Source in BBB and use it as an audio-input-device in the MacOS Audio settings. More about this here: [obsproject/forum#77163](https://obsproject.com/forum/threads/cannot-set-desktop-audio-device.77163/).

#### Audio Issues

If the BBB window in Chrome on the second is active for too long it will stop sending audio, resulting in a missing audio channel.
To prevent this it is necessary to restart Chrome and log into BBB again. It was curious that this was an issue with Chrome that happened on both streaming computers (Windows and Mac) simultaneously.

#### Stuck screens

The BBB window in crome may also just get entirely stuck with the audio still running, if unnoticed by the moderator the video was needed to be restructured in a future effort.

### Lessons Learned

- Just redirect to the Youtube Playlist unless you have trusted, well viewed Youtube channel allows live embedding.
- Change your timezone to the event's timezone to enter Youtube links.
- On the streaming machines: restart the browser for the stream if there are long enough breaks between the sessions.
- Make at least one example-run of the Streaming setup with every organizer. It is good for everyone to be prepared.
- Find a way to pay the developer of iShowU to make sure that it works in the future on Mac.
    > Kevin: you *can*, but the audio playthrough won't work, as that is baked into the iShowU apps themselves. I'm pondering if I write a paid-for variant of this. 
    https://support.shinywhitebox.com/hc/en-us/articles/360039968951
- Live streams make breakout rooms difficult, as the live-stream computers are also logged-in.
- Disable the recording-button in BBB avoids confusion. It can and should be disabled in the setup.
- Always record talks on both the main and backup computer, otherwise content may be lost if the main computer has an issue. Press "Start recording" on the backup computer and the "Start streaming" on the main computer. This way you can always "Start streaming" on the backup computer while it is still recording if the main computer fails.
- Check if the avatar in the Youtube stream is actually moving and not just showing the face to make sure that the browser is not stuck and look at the audio level to see that they are in the green area.

---

## 6. Before & After

### Introduction

With too short notice and only a little time at hand, we prepared only a short script to introduce the event to people. We wanted to record it before the first session but were short on time so we held it live the first day and recorded it on zoom during a break for the second day. _(At the beginning of the second day Martin would be by themselves, as they live in the most-eastern timezone)_

The topics covered in the introduction can be seen in [our video](https://youtu.be/QQi9KQ9guWw).

We showed the video before the first event on the second day using the video feature of BBB.

### After the event

As quickly mentioned before we skipped on the after-hours party. But after the first day, a group of people shared independently a `gather.town` link and we had discussions there in a small group.

On the second day, a group of people stayed after the event as well and we had small conversations.

Also, we opened a [comm-comm event](https://github.com/datproject/comm-comm/issues/166) and announced it quickly in the last session of the event and on the discord chat. ([Notes](https://github.com/datproject/comm-comm/blob/master/meeting-notes/59-06Aug2020.md))

Following the comm-comm event, we prepared a newsletter summary in which we linked all videos and gave a summary of the event itself in future.

### Money 

Before the event, we were considering to add other expenses: like the a-forementioned `gather.town`, sending gifts to presenters, or making sure every presenter has a good microphone. We were also considering asking for money from the attendees - _only an amount big enough to assure that people would show up, maybe ~8USD_ - and find sponsors for the event to make the video work not an entirely volunteer effort and also as a means to [donate to dat](http://opencollective.com/dat).

As we are volunteer organizers and the structure of the Dat foundation has been in flux in 2020, we decided to treat the event as an "outside" effort. This meant that we would not consider any forms of income, as we did have some costs we were able to convince the Dat foundation to support us with 2000 USD.

The Dat foundation asked us to present a combined receipt with all statements for the event. We needed 300 USD for hosting BBB with Collocall. We furthermore decided for each of us for organizers to receive a token 100 USD for their effort. For the work on the website, Santiago got 1050 USD as initially promised. We also decided to support Pretalx, BBB, and OBSStudio with 50 USD donations each. The rest went of 100 USD went to Franz for making sure that the finances are in order _(in case some taxes or accounting costs would show up at a later time)_. - ([OpenCollective Receipt](https://opencollective.com/dat/expenses/23384))

### Acknowledgement for non-monetary Support

- We were happy to use the Netlify plan from the Dat foundation for the homepage hosting.
- The Pretalx instance and the organizers` email address were provided by [Georepublic](https://georepublic.info).
- The streaming computers were provided by friends of the team.
- Eventbrite provides its service for free to free events.
- Cloudflare offers free caching Bandwidth for our domain.
- Probably clear but we still should acknowledge that we didn't need to pay for the Youtube Account.
- The initially used Google Form was as well provided free-of-charge by Google.

### Learnings

- Instead of a zoom call for the introduction, it would have been better to just reserve a presentation slot and Youtube stream.
- Practice the introduction a few times to make sure you get it right.
- Announcing the follow-up comm-comm call would have been good to do in the intro.
- It would have been good to place the introduction in the welcome-notes of the BBB channel.
- It would have reduced some friction to define before the kick-off of the event about the sponsorship of it, as we spent quite a bit of time after the fact to figure this out.
