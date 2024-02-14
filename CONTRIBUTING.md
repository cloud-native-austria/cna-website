# Contributing

## Adding a new chapter/meetup

### Chapter

Adding a new chapter consists of 2 parts

- Adding a logo

    Add a new logo file to the '/cna/static/img' folder with the following naming convention:

    > YOURCHAPTERNAME.svg

    e.g.

    > graz.svg

- Adding your page

    Under '/cna/src/pages' add a new folder named after your chapter. The path then would look like this...

    > /cna/src/pages/graz

    Within this folder you copy the template index.js from the template folder. 
    Then you need to create a description markdown file descriping your chapter - use the template or be creative :).

    Adding new meetup dates and information for those events is discussed in the next section.

    If you did everything right your chapter should be shown on the homepage alongside the others and, if you added  meetup(s) already, the next upcoming meetup if there is one. 

### Meetup

If you have your chapter already created, adding a new meetup is as simple as adding a new markdown file to your chapter folder withing /src/pages/YOUR-CHAPTER following this naming convention:

> YYYYMMDD.md

|Convention|Explanation 
|-|-
|YYYY|The year the meetup will take place e.g. "2024"
|MM|The month the meetup will take place e.g. "02" for february
|DD|The day of the month the meetup will take place e.g. "04"

So the file from the explanations above would be named like this.

> 20240204.md

If you follow this convention the date is read and shown in your description of your location as one of the meetup dates. Moreover if it is the next meetup happenig it will be automatically shown on the start page as the next meetup of your chapter.

## To the page itself

The page is currently made with [Docusaurus](https://docusaurus.io). If you have any expierence with it, or any static site generator for that matter, you are more than welcome to create a PR to make the experience/performance better even if it means switching to another static site generator altogether. Please keep in mind though to update the necessary parts of the readme if any of your changes would be affect that.