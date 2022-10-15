---
layout: work-single
title:  "5toryline"
permalink: /5toryline/
image: /assets/img/5toryline/loading.gif
categories: [digital]
year: 2017
headerimg: /assets/img/5toryline/header.png
contributors: [Taishi Kamiya]
thanks: [Andreas Refsgaard, Gene Kogan, Ross Goodwin]
jsarr: [assets/js/vendors/jquery-3.2.1.min.js, assets/js/variables.js, assets/js/header.js]
---


<div class="work-single__container work-single__no-reverse">
  {% include project-desc.html %}
  <div class='work-single__text-holder work-single__header-text'>
    <p>5toryline is an exploration into human-machine relationships. With the rapid development of artificial intelligence and machine learning, we have never been closer to being able to co-create with the machines around us. 5toryline explores human-machine creativity by creating a platform in which you can collaboratively generate stories with your machine.</p>
    <p class='no-pad'><a href="https://github.com/mattvisco/5toryline" target="_blank">Download and run the application.</a></p>
  </div>
</div>

<div class="work-single__sub-header-container">
  <div class="work-single__sub-header" >
    How it Works
  </div>
</div>

<div class='work-single__text-holder'>
<p>5toryline is composed of an openFrameworks application and a python wrapper used to bridge two neural networks written in Torch. In the openFrameworks application a user selects 5 images to be used in the creation of a story.</p>
<p>These images are then sent via osc to the python script. This script first uses a library called NeuralTalk to caption the images. The image captions are then used as a primer sentence for another library called Char-RNN which generates full paragraphs.</p>
<p>Once the neural networks have completed their computations, the script sends the generated sentences back to the openFrameworks app via osc.</p>
<p class='no-pad'>5toryline is built on top Ross Goodwin's Neural Snap which can be found <a href="https://github.com/rossgoodwin/neuralsnap" target="_blank">here.</a></p>
</div>

<div class="work-single__container">
  <div class="work-single__left" >
    <p class="work-single__footnote">Human and machine's working together to create stories.</p>
  </div>
  <div class="work-single__right" >
    <div class='work-single__iframe-container'>
      <iframe src='https://player.vimeo.com/video/230642982' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
    </div>
  </div>
</div>

<div class="work-single__container">
  <div class="work-single__left" >
    <p class="work-single__footnote">Once you've selected five images you must wait while your computer writes the story.</p>
  </div>
  <div class="work-single__right" >
    <img src="/assets/img/5toryline/loading.png" alt="Loading screen for 5toryline" />
  </div>
</div>

<div class="work-single__container">
  <div class="work-single__left" >
    <p class="work-single__footnote">Scroll through the story you've created with your computer.</p>
  </div>
  <div class="work-single__right" >
    <img src="/assets/img/5toryline/scrolling.png" alt="The act of scrolling through your story" />
  </div>
</div>

<div class="work-single__container">
  <div class="work-single__left" >
    <p class="work-single__footnote">Enjoy the beauty of you and your computer's creation.</p>
  </div>
  <div class="work-single__right" >
    <img src="/assets/img/5toryline/story.jpg" alt="A story made by you and your computer" />
  </div>
</div>

<div class="work-single__container no-pad">
  <div class="work-single__left" >
    <p class="work-single__footnote">The inspiration for this project came from a book of faces expressing different sentiment. Here is a gif of agony, enjoy.</p>
  </div>
  <div class="work-single__right" >
    <img src="/assets/img/5toryline/agony2.gif" alt="A story made by you and your computer" />
  </div>
</div>
