# Contributing

## Adding a new chapter/meetup

### Chapter

Adding a new chapter consists of 2 parts

- Adding a logo

    Add a new logo file to the '/cna/static/img' folder with the following naming convention:

    > YOURCHAPTERNAME.png

    e.g.

    > graz.png

- Adding your page

    Under '/cna/src/pages' add a new folder named after your chapter. The path then would look like this...

    > /cna/src/pages/graz

    Within this folder you copy the template index.js from the template folder.
    Then you need to create a description mdx file descriping your chapter - use the template or be creative :).

    Adding new meetup dates and information for those events is discussed in the next section.

    If you did everything right your chapter should be shown on the homepage alongside the others and, if you added  meetup(s) already, the next upcoming meetup if there is one.

### Meetup

If you have your chapter already created, adding a new meetup is as simple as adding a new mdx file to your chapter folder withing /src/pages/YOUR-CHAPTER following this naming convention:

> YYYYMMDD.mdx

|Convention|Explanation
|-|-
|YYYY|The year the meetup will take place e.g. "2024"
|MM|The month the meetup will take place e.g. "02" for february
|DD|The day of the month the meetup will take place e.g. "04"

So the file from the explanations above would be named like this.

> 20240204.mdx

If you follow this convention the date is read and shown in your description of your location as one of the meetup dates.
Moreover if it is the next meetup happenig it will be automatically shown on the start page as the next meetup of your chapter.
Make sure to provide all the necessary information as a front matter block in the mdx file.
This will look something like..

```mdxjs
---
id: 20241219,
title: xmas Meetup Graz
date: "2024-12-19"
timeStart: "6pm"
timeEnd: "10pm"
location: "Adventmarkt"
locationAddress: "Mariahilferplatz, 8020 Graz"
locationGmapsUrl: "https://maps.app.goo.gl/pfHivZWt6yAm8zyN8"
locationOpenStreetUrl: "https://www.openstreetmap.org/relation/11511612"
urlMeetup: https://www.meetup.com/cncf-graz/events/304739580
urlBevy: https://community.cncf.io/events/details/cncf-cloud-native-graz-presents-cncg-graz-december-meetup/
---

## Topics

🎄 CNCG Graz December Meetup 🎄

Let's wrap up the year together! Join us for a cozy and informal meetup at the Christmas market on Mariahilfer Platz in Graz.
No agenda, no presentations—just good company, festive vibes, and a chance to recap the year while enjoying some mulled wine or mulled cider.
```

## To the page itself

The page is currently made with [Docusaurus](https://docusaurus.io).
If you have any expierence with it, or any static site generator for that matter, you are more than welcome to create a PR to make the experience/performance better.
Please keep in mind though to update the necessary parts of the readme if any of your changes would be affect that.
